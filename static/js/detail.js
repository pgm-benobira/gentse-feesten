// ---------------- IMPORT --------------------------------------------------------------------------------------------------------------------------------
import { changeLogo } from "./helpers/changeLogo.js";
import { generateHTMLForTeaser, generateHTMLForTeasers } from "./renderers/teaser.js";
import { API_URL_EVENTS, fetchData } from "./helpers/fetch.js";

(() => {
const urlPathDetail = '';
const urlPath = '../static';

// ---------------- FILTER EVENTS -------------------------------------------------------------------------------------------------------------------------
const urlParams = new URLSearchParams(window.location.search);
let selectedDay = urlParams.get('day') ? urlParams.get('day') : '14';
let selectedEvent = urlParams.get('slug');

function filteredEventsBySlug(data, slug) {
    return data.find((item) => item.slug === slug && item.day === selectedDay);
};

function filteredEventsByEventLocationAndDay(data, selectedEvent) {
    // Gives back the selected event object
    const eventObject = filteredEventsBySlug(data, selectedEvent);
    // Filter on events with the same location and day
    const eventsSameLocationDay = data.filter((item) => item.location === eventObject.location && item.day === eventObject.day);
    // Filter out the selected event from the eventsSameLocationDay
    const filteredEvents = eventsSameLocationDay.filter((item) => item.slug !== selectedEvent);
    return generateHTMLForTeasers(urlPathDetail, urlPath, filteredEvents);
};

function filteredEventsByEventOrganizer(data, selectedEvent, amount) {
    // Gives back the selected event object
    const eventObject = filteredEventsBySlug(data, selectedEvent);
    // Filter on events with the same organizer
    const eventsSameOrganizer = data.filter((item) => item.organizer === eventObject.organizer);
    // Filter out the selected event from the eventsSameOrganizer
    const filteredEvents = eventsSameOrganizer.filter((item) => item.slug !== selectedEvent);
    // Only show a specified amount of filteredEvents
    const amountOfFilteredEvents = filteredEvents.slice(0, amount);
    return generateHTMLForTeasers(urlPathDetail, urlPath, amountOfFilteredEvents);
};

// ---------------- CHECK SELECTED DAY AND EVENT -----------------------------------------------------------------------------------------------------------
function isValidDay(selectedDay) {
    const eventDays = ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    return eventDays.includes(selectedDay);
};

function isValidEvent(data ,selectedEvent) {
    const eventSlugs = data.map(item => item.slug);
    return eventSlugs.includes(selectedEvent);
};

function handleURLParams(data) {
    if (isValidDay(selectedDay) && isValidEvent(data, selectedEvent)) {
        console.log('Correct event and day!');
    } else {
        window.open('day.html', '_self');
    }
};

// ---------------- EVENT ---------------------------------------------------------------------------------------------------------------------------------
// Go back arrow section
function generateHTMLForEventDetailGoBack(item) {
    return `
    <a href="./day.html?day=${item.day}" class="go-back">
        <svg class="go-back__arrow" viewBox="0 0 94 32"><path d="M86.53 14.15 81.37 9l2.33-2.32 9.36 9.36-9.3 9.3-2.34-2.34 5.44-5.44H0v-3.4z"/></svg>
        <p>Overzicht ${item.day_of_week} ${item.day} juli</p>
    </a>
    `
};

// Location and time section
function generateHTMLForEventDetailSpaceTime(item) {
    return `
    <div class="event-space-time">
        ${item.location ? `<a href="#" class="event-space">${item.location}</a>` : `<a href="#" class="event-space">Geen locatie</a>`}
        <p class="event-time">${item.start} u. - ${item.end} u.</p>
        ${item.wheelchair_accessible ? `<div class="event-accessibility__container"><svg class="event-accessibility" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="m31 24.1.9 1.8a1 1 0 0 1-.45 1.34l-4.1 2.05a2 2 0 0 1-2.7-.94L20.73 20H12a2 2 0 0 1-1.98-1.72C7.9 3.45 8.02 4.38 8 4a4 4 0 1 1 4.59 3.96l.29 2.04H21a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-7.55l.3 2H22c.78 0 1.48.45 1.82 1.15l3.6 7.65 2.25-1.14a1 1 0 0 1 1.34.45zM19.47 22h-1.53A7.01 7.01 0 0 1 4 21c0-2.6 1.42-4.86 3.52-6.08l-.6-4.14A11.03 11.03 0 0 0 0 21a11.01 11.01 0 0 0 21.07 4.43L19.47 22z"/></svg></div>`  : ''}
    </div>
    `
};

// Organizer section
function generateHTMLForEventDetailOrganizer(item) {
    return `
    <div class="event-info">
        <p class="event-info__key">Organisator:</p>
        <p>${item.organizer}</p>
    </div>
    `
};

// Cateogires section
function generateHTMLForEventDetailCategories(item) {
    const categoriesHTML = item.category.map((c) => `<a href="./day.html?day=${item.day}#${c}">${c}</a>`).join('\n');
    return `
    <div class="event-info">
        <p class="event-info__key">Categorieën:</p>
        <div class="event-info__categories">
            ${categoriesHTML}
        </div>
    </div>
    `
};

// Socials section
function generateHTMLForEventDetailSocials() {
    return `
    <ul class="socials socials--event">
        <li><a href="#" target="_blank"><img src="../static/img/gentse-feesten-icoontjes/twitter.svg" alt="twitter-logo"></a></li>
        <li><a href="#" target="_blank"><img src="../static/img/gentse-feesten-icoontjes/facebook.svg" alt="facebook-logo"></a></li>
        <li><a href="#" target="_blank"><img src="../static/img/gentse-feesten-icoontjes/pinterest.svg" alt="pinterest-logo"></a></li>
    </ul>
    `
};

// Map section
function generateHTMLForEventDetailMap(item) {
    return `
    <div class="segment__inner segment__inner--newspage map">
        <section class="location">
            <a href="#" class="event-space event-space--map">${item.location}</a>
            <a href="#" class="open-in-maps">Open in Google Maps</a>
        </section>
        <section class="google-maps">
            <img src="../static/img/map-decoration-img.png" alt="map-of-ghent">
        </section>
    </div>
    `
};

// Mobile view
function generateHTMLForEventDetailMobile(item) {
    return `
    <div class="segment__inner segment__inner--newspage event-detail event-detail--mobile">
        <section class="event-detail__left">
            ${generateHTMLForEventDetailGoBack(item)}
            <div class="event-detail__content">
                <h2>${item.title}</h2>
                ${generateHTMLForEventDetailSpaceTime(item)}
                ${item.description ? `<p class="event-description">${item.description}</p>` : `<p class="event-description"><em>Geen bescrijving beschikbaar</em></p>`}
                <img class="event-detail__photo" loading="lazy" src="${item.image ? item.image.full : '../static/img/no-event-image.jpg'}" alt="foto-${item.slug}">
            </div>
        </section>
        <section class="event-detail__right">
            ${generateHTMLForEventDetailOrganizer(item)}
            ${item.url ? `<div class="event-info"><p class="event-info__key">Website:</p><a href="${item.url}" target="_blank">${item.url}</a></div>`: ''}
            ${generateHTMLForEventDetailCategories(item)}
            ${generateHTMLForEventDetailSocials()}
        </section>
    </div>
    `
};

// Default view (desktop)
function generateHTMLForEventDetail(item) {
    return `
    <div class="segment__inner segment__inner--newspage event-detail">
        <section class="event-detail__left">
            ${generateHTMLForEventDetailGoBack(item)}
            <div class="event-detail__content">
                <h2>${item.title}</h2>
                ${generateHTMLForEventDetailSpaceTime(item)}
                ${item.description ? `<p class="event-description">${item.description}</p>` : `<p class="event-description"><em>Geen bescrijving beschikbaar</em></p>`}
                ${generateHTMLForEventDetailOrganizer(item)}
                ${item.url ? `<div class="event-info"><p class="event-info__key">Website:</p><a href="${item.url}" target="_blank">${item.url}</a></div>`: ''}
                ${generateHTMLForEventDetailCategories(item)}
            </div>
        </section>
        <section class="event-detail__right">
            <img class="event-detail__photo" loading="lazy" src="${item.image ? item.image.full : '../static/img/no-event-image.jpg'}" alt="foto-${item.slug}">
            ${generateHTMLForEventDetailSocials()}
        </section>
    </div>
    ${generateHTMLForEventDetailMobile(item)}
    ${generateHTMLForEventDetailMap(item)}
    `
};

function renderEventDetail(event) {
    const $eventDetail = document.getElementById('event-detail');
    $eventDetail.innerHTML = generateHTMLForEventDetail(event);
};

// ---------------- EVENT-EXTRA ---------------------------------------------------------------------------------------------------------------------------
function generateHTMLForSameLocationDayEvent(data) {
    const filteredEventsHTML = filteredEventsByEventLocationAndDay(data, selectedEvent);
    // If there is no HTML then there a no events matching day and location
    if (filteredEventsHTML === '') {
        return ``
    }
    return `
    <div class="segment__inner segment__inner--newspage segment__inner--events">
        <div class="event-category__title">
            <h2>Nog te beleven op deze locatie</h2>
        </div>
        <div class="event-category__teasers">
            ${filteredEventsHTML}
        </div>
    </div>
    `
}

function generateHTMLForSameOrganizerEvent(data) {
    const filteredEventsHTML = filteredEventsByEventOrganizer(data, selectedEvent, 4);
    // If there is no HTML then there a no events matching day and location
    if (filteredEventsHTML === '') {
        return ``
    }
    return `
    <div class="segment__inner segment__inner--newspage segment__inner--events events--list">
        <div class="event-category__title">
            <h2>Andere evenementen van deze organisator</h2>
        </div>
        <div class="event-category__teasers">
            ${filteredEventsHTML}
            <div class="dark-button--centered">
                <a class="dark-button" href="#">Alle evenementen van deze organisator</a>
            </div>
        </div>
    </div>
    `
}

function generateHTMLForEventExtra(data) {
    return `
    ${generateHTMLForSameLocationDayEvent(data)}
    ${generateHTMLForSameOrganizerEvent(data)}
    `
};

function renderEventExtra(data) {
    const $eventExtra = document.getElementById('event-extra');
    $eventExtra.innerHTML = generateHTMLForEventExtra(data);
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
function updatePageTitle(selectedEvent) {
    document.title = `${selectedEvent} | Gentse Feesten 2023`
};

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application
function initialize () {
    // Change the logo
    changeLogo(urlPath);
    // Load from the events API
    fetchData(API_URL_EVENTS, data => {
        const selectedEventData = selectedEvent ? filteredEventsBySlug(data, selectedEvent) : ``;
        isValidEvent(data ,selectedEvent);
        handleURLParams(data)
        renderEventDetail(selectedEventData);
        renderEventExtra(data);
        activeCalendarLink(selectedDay);
        updatePageTitle(selectedEventData.title);
    });
    // Console checks
    console.log('Day:', selectedDay);
    console.log('Event:', selectedEvent)
};

// Call the function for the application
initialize();
})();