import { display } from "./display.mjs";

export function getCoordinates() {
  const searchInput = document.getElementById('search');
  const city = searchInput.value.trim();
  if (!city) return;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=bf4bfee1ad11f82006a74a4d5990e597`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      const location = { lat, lon };
      localStorage.setItem('userLocation', JSON.stringify(location));
      display();
    })
    .catch(err => {
      console.error('Error fetching coordinates:', err);
    });
}