import { getCurrentPosition } from "./getCurrentPosition.mjs";

export function HamburgerMenu(){
    const hamButton = document.querySelector('#menu');
    const navigation = document.querySelector('.navigation');
    
    hamButton.addEventListener('click', () => {
        navigation.classList.toggle('open');
        hamButton.classList.toggle('open');
    });
}

export async function getLatLon(){
    let savedLocation = JSON.parse(localStorage.getItem("userLocation"));

    let lat = 0;
    let lon = 0;

    if (!savedLocation) {
        lat = 43.82256070108409;
        lon = -111.7918827257959;
    } else {
        lat = savedLocation.lat;
        lon = savedLocation.lon;
    }
    
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=bf4bfee1ad11f82006a74a4d5990e597`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=bf4bfee1ad11f82006a74a4d5990e597`;
    const AQIUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=bf4bfee1ad11f82006a74a4d5990e597`;
  
    return { weatherUrl, forecastUrl, AQIUrl };
  }

export async function apiFetch(weatherUrl, forecastUrl, AQIUrl) {
    try {
        const weatherResponse = await fetch(weatherUrl);
        const forecastResponse = await fetch(forecastUrl);
        const AQIResponse = await fetch(AQIUrl);

        if (weatherResponse.ok && forecastResponse.ok && AQIResponse.ok) {
            const weatherData = await weatherResponse.json();
            const forecastData = await forecastResponse.json();
            const AQIData = await AQIResponse.json();
            return { weatherData, forecastData, AQIData };
        } else {
            throw Error(await weatherResponse.text() && forecastResponse.text() && AQIResponse.text());
        }
    } catch (error) {
        console.error(error);
    }
}

export function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    let formattedDate = date.toLocaleDateString('en-US', options);

    formattedDate = formattedDate.replace(/\d+/, match => {
        const day = parseInt(match);
        const suffix = (day % 10 === 1 && day !== 11) ? 'st' :
                    (day % 10 === 2 && day !== 12) ? 'nd' :
                    (day % 10 === 3 && day !== 13) ? 'rd' : 'th';
        return day + suffix;
    });

    return formattedDate;
}

export function qualitativeName(aqi){

    let name = "";

    switch (aqi){
        case 1:
        name = "Good";
        break;
    }

    switch (aqi){
        case 2:
            name = "Fair";
        break;
    }

    switch (aqi){
        case 3:
        name = "Moderate";
        break;
    }

    switch (aqi){
        case 4:
        name = "Poor";
        break;
    }

    switch (aqi){
        case 5:
        name = "Very Poor";
        break;
    }

    return name;
}