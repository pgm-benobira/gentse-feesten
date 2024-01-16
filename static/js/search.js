// ---------------- IMPORT --------------------------------------------------------------------------------------------------------------------------------
import { changeLogo } from "./helpers/changeLogo.js";
import { generateHTMLForTeaser } from "./renderers/teaser.js";
import { API_URL_EVENTS, fetchData } from "./helpers/fetch.js";
import { changeEventsView } from "./helpers/changeEventsView.js"
import { filteredSearchEvents } from "./helpers/filters.js";

(() => {
const urlPathDetail = 'events/';
const urlPath = './static';
const $events = document.getElementById('events');

// ---------------- GET URL PARAMS ------------------------------------------------------------------------------------------------------------------------
const urlParams = new URLSearchParams(window.location.search);
let searchValue = urlParams.get('search');

// ---------------- ITEMS NAV -----------------------------------------------------------------------------------------------------------------------------
function renderItemsNav(items) {
    if (items.length >= 73) {
        return `
        <nav class="iems-nav">
            <a href="#" class="page-button page-button--active"><span>01</span></a>
            <a href="#" class="page-button"><span>02</span></a>
            <a href="#" class="page-button"><span>03</span></a>
            <a href="#" class="page-button"><span>04</span></a>
        </nav>
        `;
    } else if (items.length >= 49) {
        return `
        <nav class="iems-nav">
            <a href="#" class="page-button page-button--active"><span>01</span></a>
            <a href="#" class="page-button"><span>02</span></a>
            <a href="#" class="page-button"><span>03</span></a>
        </nav>
        `;
    } else if (items.length >= 25) {
        return `
        <nav class="iems-nav">
            <a href="#" class="page-button page-button--active"><span>01</span></a>
            <a href="#" class="page-button"><span>02</span></a>
        </nav>
        `;
    } else {
        return ``;
    }
};

// ---------------- SHOW FILTERED EVENTS ------------------------------------------------------------------------------------------------------------------
function renderSearchEvents(events, amount) {
    // Only rendrer if there are events
    if (events !== undefined) {
        // Display a maximum amount of teasers
        const slicedEvents = events.slice(0, amount)
        // HTML for searched events
        const searchEventsHTML = slicedEvents.map((event) => `
            ${generateHTMLForTeaser(urlPathDetail, urlPath, event)}
        `).join('');
        $events.innerHTML = `
        <div class="event-category__teasers search-events">
            ${searchEventsHTML}
        </div>
        ${renderItemsNav(events)}
        `;
    };
};

// ---------------- CHANGE INPUT VALUE --------------------------------------------------------------------------------------------------------------------
const $searchBar = document.getElementById('search-bar');
function changeInputValue(searchValue) {
    return $searchBar.value = searchValue;
};

// ---------------- SEARCH FEEDBACK -----------------------------------------------------------------------------------------------------------------------
const $searchFeedback = document.getElementById('search-feedback');
function showSearchFeedback(searchValue, filteredEvents) {
    if (searchValue === null) {
        $searchFeedback.classList.add('search-feedback--hidden'); // To remove the html search feedback section because there is no searchvalue given
    };
    const eventViewHTML = `
    <div class="event-view" id="event-view">
        <button class="event-view__button raster event-view--active"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M0 28a4 4 0 0 0 8 0 4 4 0 0 0-8 0m4-16a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm24-4a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM0 4a4 4 0 0 0 8 0 4 4 0 0 0-8 0m28 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-16 4a4 4 0 0 0 8 0 4 4 0 0 0-8 0m0-24a4 4 0 0 0 8 0 4 4 0 0 0-8 0m4 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg></button>
        <button class="event-view__button list"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 32"><path d="M13.74 5.05h29.2a2.53 2.53 0 0 0 0-5.05h-29.2a2.53 2.53 0 1 0 0 5.05zm29.2 8.42h-29.2a2.53 2.53 0 1 0 0 5.06h29.2a2.53 2.53 0 0 0 0-5.06zm0 13.48h-29.2a2.53 2.53 0 0 0 0 5.05h29.2a2.53 2.53 0 0 0 0-5.05zM2.53 0H2.5a2.53 2.53 0 1 0 .02 0zm0 13.47H2.5a2.53 2.53 0 1 0 .02 0zm0 13.48H2.5c-1.4 0-2.51 1.13-2.51 2.52S1.14 32 2.54 32a2.52 2.52 0 1 0 0-5.05z"/></svg></button>
    </div>
    `;
    const searchCount = filteredEvents ? filteredEvents.length : '0';
    console.log('Number of results:', searchCount);
    if (searchCount === 0) {
        eventViewHTML = ``; // To remove the html event view buttons
        $events.classList.add('events--hidden'); // To remove the html events section
    }
    $searchFeedback.innerHTML = `
    <p class="search-feedback__paragraph"><strong>${searchCount} resultaten</strong> voor "${searchValue}"</p>
    ${eventViewHTML}
    `
    // If there is only one result found change from 'resultaten' to 'resultaat'
    if (searchCount === 1) {
        $searchFeedback.innerHTML = `
        <p class="search-feedback__paragraph"><strong>${searchCount} resultaat</strong> voor "${searchValue}"</p>
        ${eventViewHTML}
        `
    };
};

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application
function initialize () {
    // Change the logo
    changeLogo(urlPath);
    // Load the events from the API
    fetchData(API_URL_EVENTS, data => {
        const filteredEvents = filteredSearchEvents(data, searchValue);
        renderSearchEvents(filteredEvents, 24);
        showSearchFeedback(searchValue, filteredEvents);
        changeEventsView($events, filteredEvents);
    });
    // Show the searchValue in the input field
    changeInputValue(searchValue)
    // Console checks
    console.log('Search:', searchValue);
};

// Call the function for the application
initialize();
})();