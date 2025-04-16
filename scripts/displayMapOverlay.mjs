export function displayMapOverlay() {
    const mapContainer = document.getElementById('map');

    if (!mapContainer) {
        console.error('Map container not found!');
        return;
    }

    if (mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
    }

    const savedLocation = JSON.parse(localStorage.getItem("userLocation"));
    const { lat, lon } = savedLocation;

    let zoom;

    if (Math.abs(lat) < 25 && Math.abs(lon) < 50) {
        zoom = 12;
    } else if (Math.abs(lat) < 50 && Math.abs(lon) < 50) {
        zoom = 10;
    } else {
        zoom = 6;
    }

    const map = L.map('map').setView([lat, lon], zoom);
    window.map = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const weatherLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=bf4bfee1ad11f82006a74a4d5990e597`,
        {
            attribution: 'Weather data © <a href="https://openweathermap.org/">OpenWeather</a>',
            opacity: 0.6
        }
    );
    weatherLayer.addTo(map);
}
