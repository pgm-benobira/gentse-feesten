// ---------------- IMPORT --------------------------------------------------------------------------------------------------------------------------------
import { changeLogo } from "./helpers/changeLogo.js";
import { API_URL_EVENTS, API_URL_NEWS, fetchData } from "./helpers/fetch.js";
import { renderRandomEvents } from "./renderers/randomEvents.js";

(() => {
const urlPathDetail = 'events/';
const urlPath = './static';
const $randomEvents = document.getElementById('random-events');

// ---------------- MOVE SCROLL ---------------------------------------------------------------------------------------------------------------------------
function scrollEvents() {
    const $moveRightElement = document.getElementById('arrow--right');
    const $moveLeftElement = document.getElementById('arrow--left');
    $moveRightElement.addEventListener('click', () => {
        $randomEvents.scrollLeft += 420;
    });
    $moveLeftElement.addEventListener('click', () => {
        $randomEvents.scrollLeft += -420;
    });
};

// ---------------- SHOW LAST THREE NEWS ITEMS ------------------------------------------------------------------------------------------------------------
function renderLastThreeNewsItems(amount, data) {
    const $newsGridElement = document.getElementById('news__grid');
    const threeNewsItems = data.slice(0, amount);
    const threeNewsItemsHTML = threeNewsItems.map((item, index) => `
    <a href="./news.html" class="news-item news-item--${index + 1}">
        <span>${item.title}</span>
        <div class="arrow">
            <svg class="arrow--right" viewBox="0 0 94 32"><path d="M86.53 14.15 81.37 9l2.33-2.32 9.36 9.36-9.3 9.3-2.34-2.34 5.44-5.44H0v-3.4z"/></svg>
        </div>
    </a>
    `).join('');
    const newsGridHTML = `
    ${threeNewsItemsHTML}
    <div class="news-photo news-item--4">
        <img src="./static/img/news-decoration-img.jpg" alt="sfeer-beeld-1">
    </div>
    `
    $newsGridElement.innerHTML = newsGridHTML;
};

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application
function initialize () {
    // Change the logo
    changeLogo(urlPath);
    // Scroll through random events
    scrollEvents()
    // Load the events from the API
    fetchData(API_URL_EVENTS, data => {
        renderRandomEvents(urlPathDetail, urlPath, $randomEvents, 8, data);
    });
    fetchData(API_URL_NEWS, data => {
        renderLastThreeNewsItems(3, data);
    });
};

// Call the function for the application
initialize();
})();