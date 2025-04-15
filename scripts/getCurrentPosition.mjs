import { apiFetch } from "./utils.mjs";

export function getCurrentPosition() {
    const DEFAULT_LAT = 43.82256070108409;
    const DEFAULT_LON = -111.7918827257959;

    const savedLocation = JSON.parse(localStorage.getItem("userLocation"));

    if (savedLocation) {
        fetchWeatherData(savedLocation.lat, savedLocation.lon);
        return; 
    } else {
        fetchWeatherData(DEFAULT_LAT, DEFAULT_LON);
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
        fetchWeatherData(lat, lon);
    }

    function errorCallback(error) {
        console.warn("Geolocation failed. Using default:", error.message);
        fetchWeatherData(DEFAULT_LAT, DEFAULT_LON);
    }

    function fetchWeatherData(lat, lon) {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=bf4bfee1ad11f82006a74a4d5990e597`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=bf4bfee1ad11f82006a74a4d5990e597`;
        apiFetch(weatherUrl, forecastUrl);
    }

}