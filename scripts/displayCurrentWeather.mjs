import { qualitativeName, formatTimestamp } from "./utils.mjs";

const weatherContent = document.querySelector('.weather-content');
const weatherForecast = document.querySelector('.weekly-weather');

export function displayCurrentWeather(weatherData, forecastData, AQIData) {

    if (weatherContent) weatherContent.innerHTML = '';
    if (weatherForecast) weatherForecast.innerHTML = '';

    const weatherInfo = document.createElement('div');
    let weatherLocation= document.createElement('p');
    let weatherDate = document.createElement('p');
    let weatherCond = document.createElement('p');
    let weatherTemp = document.createElement('p');
    let weatherAQI = document.createElement('p');
    const weatherImage = document.createElement('div');
    let weatherIcon = document.createElement('img');

    weatherInfo.className = 'weather-info';
    weatherImage.className = 'weather-image';

    weatherLocation.setAttribute('id', 'location') 
    weatherLocation.innerHTML = weatherData.name; 
    weatherDate.setAttribute('id', 'current-date') 
    weatherDate.innerHTML = `${formatTimestamp(weatherData.dt)}<br><br>`;
    weatherCond.setAttribute('id', 'condition') 
    weatherCond.innerHTML = weatherData.weather[0].description;
    weatherTemp.setAttribute('id', 'temperature') 
    weatherTemp.innerHTML = `Temperature: <strong>${Math.trunc(weatherData.main.temp)}&deg;C</strong>`;
    weatherAQI.setAttribute('id', 'aqi') 
    weatherAQI.innerHTML = `Air Quality Index: ${AQIData.list[0].main.aqi} - ${qualitativeName(AQIData.list[0].main.aqi)}`; //change

    weatherIcon.setAttribute('src', `images/${weatherData.weather[0].icon}.svg`);
    weatherIcon.setAttribute('alt', `Weather Icon`);
    weatherIcon.setAttribute('id', 'weather-icon') 
    weatherIcon.setAttribute('width', 150);
    weatherIcon.setAttribute('height', 150);

    weatherInfo.appendChild(weatherLocation);
    weatherInfo.appendChild(weatherDate);
    weatherInfo.appendChild(weatherCond);
    weatherInfo.appendChild(weatherTemp);
    weatherInfo.appendChild(weatherAQI);
    weatherImage.appendChild(weatherIcon);

    weatherContent.appendChild(weatherInfo);
    weatherContent.appendChild(weatherImage);

    const dailyTemperatures = {};
    let counter = 1;
    
    forecastData.list.forEach(entry => {
        const date = entry.dt_txt.split(' ')[0];
        const tempMin = entry.main.temp_min;
        const tempMax = entry.main.temp_max;
        const icon = entry.weather[0].icon;
        
        if (!dailyTemperatures[date]) {
            dailyTemperatures[date] = { min: tempMin, max: tempMax, icon: icon };
        } else {
            dailyTemperatures[date].min = Math.min(dailyTemperatures[date].min, tempMin);
            dailyTemperatures[date].max = Math.max(dailyTemperatures[date].max, tempMax);
        }
    });
    
    const today = new Date().toISOString().split('T')[0]; 
    const nextThreeDays = Object.keys(dailyTemperatures)
        .filter(date => date > today)
        .sort()
        .slice(0, 3)
        .reduce((acc, date) => {
            acc[date] = dailyTemperatures[date];
            return acc;
        }, {});
    
    for (const date in nextThreeDays) {
        const { min, max, icon} = nextThreeDays[date];
        const weekday = new Date(date  + "T00:00").toLocaleDateString("en-US", { weekday: "short" });

        let forecastCard = document.createElement('div');
        let forecastDate = document.createElement('p');
        let forecastIcon = document.createElement('img');
        let forecastTemp = document.createElement('p');

        forecastCard.setAttribute('class', 'daily-weather weather-box') 
        if (counter == 3) {
            forecastCard.setAttribute('id', 'last-one');
        }

        forecastDate.setAttribute('class', 'bold-text') 
        forecastDate.innerHTML = `<strong>${weekday}</strong>`;
        forecastIcon.setAttribute('src', `images/${icon}.svg`);
        forecastIcon.setAttribute('alt', `Weather Icon`);
        forecastIcon.setAttribute('width', 100);
        forecastIcon.setAttribute('height', 100);
        forecastTemp.setAttribute('id', 'minmax-paragraph') 
        forecastTemp.innerHTML = `${Math.trunc(min)}&deg;C | ${Math.trunc(max)}&deg;C`;

        forecastCard.appendChild(forecastDate);
        forecastCard.appendChild(forecastIcon);
        forecastCard.appendChild(forecastTemp);

        weatherForecast.appendChild(forecastCard);
        counter ++;
        }
}