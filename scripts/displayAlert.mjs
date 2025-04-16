export async function displayAlert() {

  const savedLocation = JSON.parse(localStorage.getItem("userLocation"));
  const { lat, lon } = savedLocation;

  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=15734b5411a831554cc7dadec5d3fbf8`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const alertBox = document.getElementById("weather-alerts");

    if (data.alerts && data.alerts.length > 0) {
      let alertHTML = "<strong>⚠️ Weather Alert(s):</strong><br><br>";
      data.alerts.forEach(alert => {
        alertHTML += `
          <p><strong>${alert.event}</strong><br>
          <em>${alert.sender_name}</em><br>
          From: ${new Date(alert.start * 1000).toLocaleString()}<br>
          To: ${new Date(alert.end * 1000).toLocaleString()}<br>
          ${alert.description}</p><hr>`;
      });
      alertBox.innerHTML = alertHTML;
      alertBox.style.display = "block";
      } else {
        alertBox.innerHTML = "✅ No active weather alerts.";
        alertBox.style.display = "block";
      }
  } catch (error) {
    console.error("Error fetching alerts:", error);
    document.getElementById("weather-alerts").innerText = "❌ Failed to fetch weather data.";
    document.getElementById("weather-alerts").style.display = "block";
  }
}