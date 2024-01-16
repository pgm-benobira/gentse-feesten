// ---------------- IMPORT --------------------------------------------------------------------------------------------------------------------------------
import { changeLogo } from "./helpers/changeLogo.js";
import { API_URL_NEWS, fetchData } from "./helpers/fetch.js";

(() => {
const urlPath = './static';

// ---------------- GENERATE USER INTERFACE --------------------------------------------------------------------------------------------------------------
// Show the user interface for the news items
function renderNewsItems(data) {
    const $newsItems = document.getElementById('news-items');

    $newsItems.innerHTML = ''; // Clear news items
    data.forEach(item => {
        renderNewsItem($newsItems, item);
    });
};

function renderNewsItem($newsItems, item) {
    const $newsItem = document.createElement('div');
    $newsItem.innerHTML = `
        <a href="#" class="news-item news-item--larger">
            <div class="news-item__left">
                <span>${item.title}</span>
                <div class="arrow">
                    <svg class="arrow--right" viewBox="0 0 94 32"><path d="M86.53 14.15 81.37 9l2.33-2.32 9.36 9.36-9.3 9.3-2.34-2.34 5.44-5.44H0v-3.4z"/></svg>
                </div>
            </div>
            <div class="news-item__right">
                <img src="${item.picture.medium}" alt="nieuws-sfeerbeeld">
            </div>
        </a>
        `;
    $newsItems.appendChild($newsItem);
};

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application
function initialize () {
    // Change the logo
    changeLogo(urlPath);
    fetchData(API_URL_NEWS, renderNewsItems);
};

// Call the function for the application
initialize();
})();