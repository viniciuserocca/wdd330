const openWeatherApiKey = '15734b5411a831554cc7dadec5d3fbf8';

export function getCurrentPosition() {
    const DEFAULT_LAT = 43.82256070108409;
    const DEFAULT_LON = -111.7918827257959;

    const savedLocation = JSON.parse(localStorage.getItem("userLocation"));

    if (savedLocation) {
        fetchForecastData(savedLocation.lat, savedLocation.lon);
        return; 
    } else {
        fetchForecastData(DEFAULT_LAT, DEFAULT_LON);
    }

    if ("geolocation" in navigator) {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    } else {
        console.warn("Geolocation not supported. Using default.");
    }

    function successCallback(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        localStorage.setItem("userLocation", JSON.stringify({ lat, lon }));
        fetchForecastData(lat, lon);
    }

    function errorCallback(error) {
        console.warn("Geolocation failed. Using default:", error.message);
        fetchForecastData(DEFAULT_LAT, DEFAULT_LON);
    }

    function fetchForecastData(lat, lon) {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherApiKey}`;
        apiFetch(forecastUrl);
    }
}

async function apiFetch(forecastUrl) {
    try {
        const forecastResponse = await fetch(forecastUrl);

        if (forecastResponse.ok) {
            const forecastData = await forecastResponse.json();
            displayHourlyForecast(forecastData);
        } else {
            throw Error(await forecastResponse.text());
        }
    } catch (error) {
        console.error(error);
    }
}

function displayHourlyForecast(forecastData) {
    const menuContainer = document.getElementById('forecastMenu');
    const forecastContainer = document.getElementById('hourlyForecast');

    menuContainer.innerHTML = '';
    forecastContainer.innerHTML = '';

    const dailyForecasts = {};

    forecastData.list.forEach(entry => {
        const date = entry.dt_txt.split(' ')[0];
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = [];
        }
        dailyForecasts[date].push(entry);
    });

    const today = new Date().toISOString().split('T')[0];
    const nextFiveDays = Object.keys(dailyForecasts)
        .filter(date => date >= today)
        .sort()
        .slice(0, 5);

    nextFiveDays.forEach((date, index) => {
        const weekday = new Date(date + "T00:00").toLocaleDateString("en-US", { weekday: "short" });

        const button = document.createElement('button');
        button.textContent = weekday;
        button.className = 'day-button';
        if (index === 0) button.classList.add('active');

        button.addEventListener('click', () => {
            document.querySelectorAll('.day-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderForecastCards(dailyForecasts[date]);
        });

        menuContainer.appendChild(button);
    });

    renderForecastCards(dailyForecasts[nextFiveDays[0]]);

    function renderForecastCards(entries) {
        forecastContainer.innerHTML = '';

        entries.forEach(entry => {
            const forecastDate = new Date(entry.dt_txt);
            const hour = forecastDate.toLocaleTimeString("en-US", {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            const temp = Math.trunc(entry.main.temp);
            const icon = entry.weather[0].icon;

            const card = document.createElement('div');
            card.className = 'hourly-weather weather-box';

            const timeP = document.createElement('p');
            timeP.className = 'bold-text';
            timeP.innerHTML = `<strong>${hour}</strong>`;

            const iconImg = document.createElement('img');
            iconImg.src = `../images/${icon}.svg`;
            iconImg.alt = 'Weather Icon';
            iconImg.width = 100;
            iconImg.height = 100;

            const tempP = document.createElement('p');
            tempP.id = 'minmax-paragraph';
            tempP.innerHTML = `${temp}&deg;C`;

            card.appendChild(timeP);
            card.appendChild(iconImg);
            card.appendChild(tempP);

            forecastContainer.appendChild(card);
        });
    }
}