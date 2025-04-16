const openWeatherApiKey = '15734b5411a831554cc7dadec5d3fbf8';

let map;
let directionsRenderer;
let weatherMarkers = [];

export function initMap() {

    const savedLocation = JSON.parse(localStorage.getItem("userLocation"));
    const { lat, lon } = savedLocation;

    let zoomLvl;

    if (Math.abs(lat) < 25 && Math.abs(lon) < 50) {
        zoomLvl = 12;
    } else if (Math.abs(lat) < 50 && Math.abs(lon) < 50) {
        zoomLvl = 10;
    } else {
        zoomLvl = 6;
    }
    
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: zoomLvl,
        center: { lat: lat, lng: lon },
    });

    directionsRenderer = new google.maps.DirectionsRenderer({ map });
}

window.handleRoute = async function () {
    const origin = document.getElementById("origin").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const errorDiv = document.getElementById("error");
    const weatherList = document.getElementById("weather-list");
    errorDiv.textContent = "";
    weatherList.innerHTML = '';

    if (!origin || !destination) {
        errorDiv.textContent = "Please fill in both origin and destination.";
        return;
    }

    const directionsService = new google.maps.DirectionsService();
    directionsRenderer.setMap(null);
    directionsRenderer = new google.maps.DirectionsRenderer({ map });
    directionsRenderer.setMap(map);

    weatherMarkers.forEach(marker => marker.setMap(null));
    weatherMarkers = [];

    directionsService.route(
        {
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
        },
        async (result, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(result);
                const route = result.routes[0];
                const leg = route.legs[0];
                document.getElementById("distance").textContent = `Distance: ${leg.distance.text}`;
                document.getElementById("duration").textContent = `Estimated Time: ${leg.duration.text}`;
                const startTime = new Date();
                const totalDurationSec = leg.duration.value;
                const totalDurationHours = Math.ceil(totalDurationSec / 3600);

                const path = route.overview_path;
                const sampledPoints = samplePath(path, Math.floor(path.length / totalDurationHours));

                for (let i = 0; i < totalDurationHours; i++) {
                    const point = sampledPoints[i];
                    const etaSec = (i / totalDurationHours) * totalDurationSec;
                    const eta = new Date(startTime.getTime() + etaSec * 1000);

                    const weather = await getForecastWeather(point.lat(), point.lng(), eta);
                    if (weather) {
                        const iconUrl = `../images/${weather.icon}.svg`;
                        const marker = new google.maps.Marker({
                            position: point,
                            map: map,
                            icon: {
                                url: iconUrl,
                                scaledSize: new google.maps.Size(80, 80)
                            },
                            title: `${weather.description} - ${weather.temperature}°C\nETA: ${eta.toLocaleTimeString()}`
                        });
                        weatherMarkers.push(marker);

                        const weatherItem = document.createElement("li");
                        weatherItem.setAttribute('class', 'weather-box'); 

                        const iconImage = document.createElement("img");
                        iconImage.src = iconUrl;
                        iconImage.alt = weather.description;
                        weatherItem.appendChild(iconImage);

                        const tempText = document.createElement("span");
                        tempText.textContent = `Temperature: ${Math.trunc(weather.temperature)}°C`;
                        weatherItem.appendChild(tempText);

                        const descriptionText = document.createElement("span");
                        descriptionText.setAttribute('id', 'condition') 
                        descriptionText.textContent = `Description: ${weather.description}`;
                        weatherItem.appendChild(descriptionText);

                        const etaText = document.createElement("span");
                        etaText.textContent = `ETA: ${eta.toLocaleTimeString()}`;
                        weatherItem.appendChild(etaText);

                        weatherList.appendChild(weatherItem);
                    }
                }
            } else {
                errorDiv.textContent = "Failed to fetch route. Please check your locations.";
            }
        }
    );
};

function samplePath(path, everyNth) {
    return path.filter((_, index) => index % everyNth === 0);
}

async function getForecastWeather(lat, lon, eta) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.list) return null;

    const closestForecast = data.list.reduce((prev, curr) => {
        const prevDiff = Math.abs(new Date(prev.dt_txt) - eta);
        const currDiff = Math.abs(new Date(curr.dt_txt) - eta);
        return currDiff < prevDiff ? curr : prev;
    });

    return {
        description: closestForecast.weather[0].description,
        icon: closestForecast.weather[0].icon,
        temperature: closestForecast.main.temp,
        time: closestForecast.dt_txt,
    };
}

document.getElementById("getRouteBtn").addEventListener("click", () => {
    handleRoute();
    document.getElementById("route-info").style.display = "block";
    document.getElementById("weather-info").style.display = "block";
  });