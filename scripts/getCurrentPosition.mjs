import { display } from "./display.mjs";

const DEFAULT_LAT = 43.82256070108409;
const DEFAULT_LON = -111.7918827257959;

export function getCurrentPosition() {
    
    const savedLocation = JSON.parse(localStorage.getItem("userLocation"));
  
    if (!savedLocation) {
      localStorage.setItem("userLocation", JSON.stringify({ lat: DEFAULT_LAT, lon: DEFAULT_LON }));
      
      if ("geolocation" in navigator) {
        const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
  
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
  
          localStorage.setItem("userLocation", JSON.stringify({ lat, lon }));
          display();
        },
        error => {
          console.warn("Geolocation failed. Using default:", error.message);
          localStorage.setItem("userLocation", JSON.stringify({ lat: DEFAULT_LAT, lon: DEFAULT_LON }));
        },
        options
      );
    } else {
      console.warn("Geolocation not supported. Using default.");
      localStorage.setItem("userLocation", JSON.stringify({ lat: DEFAULT_LAT, lon: DEFAULT_LON }));
    }
    } else {
      return;
    }
  
}