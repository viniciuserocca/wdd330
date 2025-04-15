const hourlyForecast = document.querySelector('.hf-container');

const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=-20.57266509249185&lon=-48.567067915293904&units=metric&appid=bf4bfee1ad11f82006a74a4d5990e597";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=-20.57266509249185&lon=-48.567067915293904&units=metric&appid=bf4bfee1ad11f82006a74a4d5990e597";

export async function apiFetch() {
    try {
        const weatherResponse = await fetch(weatherUrl);
        const forecastResponse = await fetch(forecastUrl);

        if (weatherResponse.ok && forecastResponse.ok) {
            const weatherData = await weatherResponse.json();
            const forecastData = await forecastResponse.json();
            displayHourlyForecast(weatherData, forecastData);
        } else {
            throw Error(await weatherResponse.text() && forecastResponse.text());
        }
    } catch (error) {
        console.error(error);
    }
}

// Display Hourly Forecast
function displayHourlyForecast(weatherData, forecastData){

    const dailyTemperatures = {};
    
    forecastData.list.forEach(entry => {
        const date = entry.dt_txt.split(' ')[0];
        const tempMin = entry.main.temp_min;
        const tempMax = entry.main.temp_max;
        
        if (!dailyTemperatures[date]) {
            dailyTemperatures[date] = { min: tempMin, max: tempMax};
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
        const { min, max} = nextThreeDays[date];
        const weekday = new Date(date  + "T00:00").toLocaleDateString("en-US", { weekday: "short" });

        let forecastCard = document.createElement('div');
        let forecastDate = document.createElement('p');
        let forecastIcon = document.createElement('img');
        let forecastTemp = document.createElement('p');

        forecastCard.setAttribute('class', 'hourly-weather weather-box') 
        forecastDate.setAttribute('class', 'bold-text') 
        forecastDate.innerHTML = `<strong>${weekday}</strong>`;
        forecastIcon.setAttribute('src', `../images/${weatherData.weather[0].icon}.svg`);
        forecastIcon.setAttribute('alt', `Weather Icon`);
        forecastIcon.setAttribute('width', 100);
        forecastIcon.setAttribute('height', 100);
        forecastTemp.setAttribute('id', 'minmax-paragraph') 
        forecastTemp.innerHTML = `${Math.trunc(min)}&deg;C/${Math.trunc(max)}&deg;C`;

        forecastCard.appendChild(forecastDate);
        forecastCard.appendChild(forecastIcon);
        forecastCard.appendChild(forecastTemp);

        hourlyForecast.appendChild(forecastCard);
    }
}