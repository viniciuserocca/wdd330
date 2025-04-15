
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=-20.57266509249185&lon=-48.567067915293904&units=metric&appid=bf4bfee1ad11f82006a74a4d5990e597";

export async function apiFetch() {
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

    // Clear old content
    menuContainer.innerHTML = '';
    forecastContainer.innerHTML = '';

    const dailyForecasts = {};

    // Group forecast entries by date
    forecastData.list.forEach(entry => {
        const date = entry.dt_txt.split(' ')[0];
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = [];
        }
        dailyForecasts[date].push(entry);
    });

    // Get next 5 days starting from today
    const today = new Date().toISOString().split('T')[0];
    const nextFiveDays = Object.keys(dailyForecasts)
        .filter(date => date >= today)
        .sort()
        .slice(0, 5);

    // Create day selection menu
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

    // Show forecast for the first day by default
    renderForecastCards(dailyForecasts[nextFiveDays[0]]);

    // Helper to render cards for a selected day
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