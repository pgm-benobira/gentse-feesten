// ---------------- IMPORT --------------------------------------------------------------------------------------------------------------------------------
import { changeLogo } from "./helpers/changeLogo.js";
import { generateHTMLForTeaser } from "./renderers/teaser.js";
import { API_URL_EVENTS, fetchData } from "./helpers/fetch.js";
import { changeEventsView } from "./helpers/changeEventsView.js";
import { renderRandomEvents } from "./renderers/randomEvents.js";
import { filteredEventsByDay, filteredEventsByDayAccessibility, filteredEventsByDayPrice } from "./helpers/filters.js";

(() => {
const urlPathDetail = '';
const urlPath = '../static';
const $events = document.getElementById('events');
const $randomEvents = document.getElementById('random-events');

// ---------------- FILTER EVENTS -------------------------------------------------------------------------------------------------------------------------
const urlParams = new URLSearchParams(window.location.search);
let selectedDay = urlParams.get('day') ? urlParams.get('day') : '14';

// ---------------- CHECK SELECTED DAY --------------------------------------------------------------------------------------------------------------------
function isValidDay(selectedDay) {
    const eventDays = ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    return eventDays.includes(selectedDay);
};

function handleURLParams() {
    if (isValidDay(selectedDay)) {
        console.log('Correct day!');
    } else {
        window.open('day.html', '_self');
    }
};

// ---------------- INSPECT CHECKBOXES --------------------------------------------------------------------------------------------------------------------
const $accessibleElement = document.getElementById('accessibility');
const $priceElement = document.getElementById('price');
function clickOnFilter(events) {
    $accessibleElement.addEventListener('click', () => {
        $accessibleElement.classList.toggle('accessibility--checked');
        renderEvents(events);
    });
    $priceElement.addEventListener('click', () => {
        $priceElement.classList.toggle('price--checked');
        renderEvents(events);
    });
};

function inspectCheckboxes(data, selectedDay) {
    const accessibilityChecked = $accessibleElement.classList.contains('accessibility--checked');
    const priceChecked = $priceElement.classList.contains('price--checked');
    data = filteredEventsByDay(data, selectedDay);
    if (accessibilityChecked) {
        data = filteredEventsByDayAccessibility(data);
    }
    if (priceChecked) {
        data = filteredEventsByDayPrice(data);
    }
    return data;
};

// ---------------- EVENTS --------------------------------------------------------------------------------------------------------------------------------
function generateHTMLForEvents(events, category) {
    // All the events for one category
    const categoryEvents = events.filter((item) => item.category.includes(category))
    // Sort the events with the sort_key
    categoryEvents.sort((a, b) => {
        return a.sort_key - b.sort_key;
    });

    // HTML for teasers in one category
    const teasersHTML = categoryEvents.map((event) => `
        ${generateHTMLForTeaser(urlPathDetail, urlPath, event)}
    `).join('')

    // HTML for the entire category
    return `
    <div class="event-category" id="${category}">
        <div class="event-category__title">
            <h2>${category}</h2>
            <a class="go-up" href="#filters"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 32"><path d="M17.8 9.9 8.94 0 0 9.9l2.23 2L7.4 6.15V32h3V6.14l5.17 5.76z"/></svg></a>
        </div>
        <div class="event-category__teasers">
            ${teasersHTML}
        </div>
    </div>
    `
};

function renderEvents(data) {
    // Filter events on selected day
    const filteredEvents = inspectCheckboxes(data, selectedDay);
    // Extract unique categories from the events array
    const categories = [...new Set(filteredEvents.map(event => event.category).flat())].sort();
    // Used to accumulate all HTML for all categories
    let eventsHTML = '';
    for (const category of categories) {
        eventsHTML += generateHTMLForEvents(filteredEvents, category);
    };
    $events.innerHTML = eventsHTML;
};

// ---------------- ACTIVE VIEW (calendar) ----------------------------------------------------------------------------------------------------------------
function activeCalendarLink(selectedDay) {
    const $calendarLinks = document.querySelectorAll('.calendar-link')

    // First remove all links with calendar-link--active
    $calendarLinks.forEach(link => {
        link.classList.remove('calendar-link--active')
    });

    // Add calendar-link--active to the selected link
    const selectedLink = document.getElementById(selectedDay)
    if (selectedLink) {
        selectedLink.classList.add('calendar-link--active')
    }
};

// ---------------- UPDATE PAGE TITLE ---------------------------------------------------------------------------------------------------------------------
function updatePageTitle(selectedDay) {
    const days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag']
    const d = new Date(`July ${selectedDay}, 2023`); // Get day of the week for specific date
    let day = days[d.getDay()]; // Returns number between 0 and 6 => days array to turn it into a readable day
    document.title = `${day} ${selectedDay} juli | Gentse Feesten 2023`
};

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application
function initialize () {
    // Change the logo
    changeLogo(urlPath);
    // Load the events from the API
    fetchData(API_URL_EVENTS, data => {
        const filteredEvents = filteredEventsByDay(data, selectedDay);
        clickOnFilter(data);
        handleURLParams();
        renderEvents(data);
        renderRandomEvents(urlPathDetail, urlPath, $randomEvents, 3, filteredEvents);
        changeEventsView($events, data);
        activeCalendarLink(selectedDay);
        updatePageTitle(selectedDay);
    });
    // Console checks
    console.log('Day:', selectedDay);
};

// Call the function for the application
initialize();
})();