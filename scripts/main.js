import { HamburgerMenu} from "./utils.mjs";
import { getCurrentPosition } from "./getCurrentPosition.mjs";
import { getCoordinates } from "./getCoordinates.mjs";
import { display } from "./display.mjs";
import { renderSearchDropdown } from "./searchHistory.mjs"

HamburgerMenu();
getCurrentPosition();

const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-button');

searchBtn.addEventListener('click', getCoordinates);
searchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    getCoordinates();
    renderSearchDropdown(history);
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  renderSearchDropdown(history);
});

display();