export function saveSearchToHistory(city) {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    history = history.filter(item => item.toLowerCase() !== city.toLowerCase());

    history.unshift(city);

    if (history.length > 5) {
        history = history.slice(0, 5);
    }

    localStorage.setItem("searchHistory", JSON.stringify(history));
    renderSearchDropdown(history);
}

export function renderSearchDropdown(history) {
    const datalist = document.getElementById("history");
    datalist.innerHTML = "";

    history.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        datalist.appendChild(option);
    });
}