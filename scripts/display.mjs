import { getLatLon, apiFetch } from "./utils.mjs";
import { displayCurrentWeather } from "./displayCurrentWeather.mjs";
import { displayMapOverlay } from "./displayMapOverlay.mjs";

export async function display(){
    const { weatherUrl, forecastUrl, AQIUrl } = await getLatLon();
    const { weatherData, forecastData, AQIData } = await apiFetch(weatherUrl, forecastUrl, AQIUrl);
    displayCurrentWeather(weatherData, forecastData, AQIData);
    displayMapOverlay();
}