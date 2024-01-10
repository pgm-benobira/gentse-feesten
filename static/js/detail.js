(() => {
const $eventDetail = document.getElementById('event-detail');
const $eventExtra = document.getElementById('event-extra');

// ---------------- API URL -------------------------------------------------------------------------------------------------------------------------------
const API_URL = 'https://www.pgm.gent/data/gentsefeesten/events.json';

// ---------------- FETCH THE DATA ------------------------------------------------------------------------------------------------------------------------
async function fetchData(url, callback) {
    try {
        const response = await fetch(url);
        if (response.status === 200) {
            const data = await response.json();
            callback(data);
        } else {
            throw new Error('Er ging iets mis met de API.');
        }
    } catch (error) {
        console.error(error.message);
    }
};

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
    console.log(eventObject);
    // Filter on events with the same location and day
    const eventsSameLocationDay = data.filter((item) => item.location === eventObject.location && item.day === eventObject.day);
    // Filter out the selected event from the eventsSameLocationDay
    const filteredEvents = eventsSameLocationDay.filter((item) => item.slug !== selectedEvent);
    console.log(filteredEvents);
    return generateHTMLForTeasers(filteredEvents);
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
function generateHTMLForEventDetailGoBack(item) {
    return `
    <a href="./day.html?day=${item.day}" class="go-back">
        <svg class="go-back__arrow" viewBox="0 0 94 32"><path d="M86.53 14.15 81.37 9l2.33-2.32 9.36 9.36-9.3 9.3-2.34-2.34 5.44-5.44H0v-3.4z"/></svg>
        <p>Overzicht ${item.day_of_week} ${item.day} juli</p>
    </a>
    `
};

function generateHTMLForEventDetailSpaceTime(item) {
    return `
    <div class="event-space-time">
        <a href="#" class="event-space">${item.location}</a>
        <p class="event-time">${item.start} u. - ${item.end} u.</p>
        ${item.wheelchair_accessible ? `<div class="event-accessibility__container"><svg class="event-accessibility" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="m31 24.1.9 1.8a1 1 0 0 1-.45 1.34l-4.1 2.05a2 2 0 0 1-2.7-.94L20.73 20H12a2 2 0 0 1-1.98-1.72C7.9 3.45 8.02 4.38 8 4a4 4 0 1 1 4.59 3.96l.29 2.04H21a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-7.55l.3 2H22c.78 0 1.48.45 1.82 1.15l3.6 7.65 2.25-1.14a1 1 0 0 1 1.34.45zM19.47 22h-1.53A7.01 7.01 0 0 1 4 21c0-2.6 1.42-4.86 3.52-6.08l-.6-4.14A11.03 11.03 0 0 0 0 21a11.01 11.01 0 0 0 21.07 4.43L19.47 22z"/></svg></div>`  : ''}
    </div>
    `
};

function generateHTMLForEventDetailOrganizer(item) {
    return `
    <div class="event-info">
        <p class="event-info__key">Organisator:</p>
        <p>${item.organizer}</p>
    </div>
    `
};

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

function generateHTMLForEventDetailSocials() {
    return `
    <ul class="socials socials--event">
        <li><a href="#" target="_blank"><img src="../static/img/gentse-feesten-icoontjes/twitter.svg" alt="twitter-logo"></a></li>
        <li><a href="#" target="_blank"><img src="../static/img/gentse-feesten-icoontjes/facebook.svg" alt="facebook-logo"></a></li>
        <li><a href="#" target="_blank"><img src="../static/img/gentse-feesten-icoontjes/pinterest.svg" alt="pinterest-logo"></a></li>
    </ul>
    `
};

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

function generateHTMLForEventDetailMobile(item) {
    return `
    <div class="segment__inner segment__inner--newspage event-detail event-detail--mobile">
        <section class="event-detail__left">
            ${generateHTMLForEventDetailGoBack(item)}
            <div class="event-detail__content">
                <h2>${item.title}</h2>
                ${generateHTMLForEventDetailSpaceTime(item)}
                <p class="event-description">${item.description}</p>
                <img class="event-detail__photo" loading="lazy" src="${item.image ? item.image.full : ''}" alt="foto-${item.slug}">
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

function generateHTMLForEventDetail(item) {
    return `
    <div class="segment__inner segment__inner--newspage event-detail">
        <section class="event-detail__left">
            ${generateHTMLForEventDetailGoBack(item)}
            <div class="event-detail__content">
                <h2>${item.title}</h2>
                ${generateHTMLForEventDetailSpaceTime(item)}
                <p class="event-description">${item.description}</p>
                ${generateHTMLForEventDetailOrganizer(item)}
                ${item.url ? `<div class="event-info"><p class="event-info__key">Website:</p><a href="${item.url}" target="_blank">${item.url}</a></div>`: ''}
                ${generateHTMLForEventDetailCategories(item)}
            </div>
        </section>
        <section class="event-detail__right">
            <img class="event-detail__photo" loading="lazy" src="${item.image ? item.image.full : ''}" alt="foto-${item.slug}">
            ${generateHTMLForEventDetailSocials()}
        </section>
    </div>
    ${generateHTMLForEventDetailMobile(item)}
    ${generateHTMLForEventDetailMap(item)}
    `
};

function renderEventDetail(event) {
    $eventDetail.innerHTML = generateHTMLForEventDetail(event);
};

// ---------------- EVENT-EXTRA ---------------------------------------------------------------------------------------------------------------------------
function generateHTMLForTeasers(events) {
    return events.map((event) => `
    <a href="detail.html?day=${event.day}&slug=${event.slug}" class="teaser__wrapper">
        <span class="teaser__date">${event.day_of_week} ${event.day} juli</span>
        <img class="teaser__img" src="${event.image ? event.image.thumb : '../static/img/no-event-image.jpg'}" alt="thumb-image-${event.slug}">
        <div class="teaser">
            <h3>${event.title}</h3>
            <p class="teaser__location">${event.location}</p>
            <p class="teaser__start">${event.start} u.</p>
            ${event.wheelchair_accessible ? `<svg class="teaser__paid" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 32"><path d="M20.68 27.23c-4.46 0-8-2.35-9.72-6.01h11.76v-3.8H9.9c-.09-.45-.09-.93-.09-1.42 0-.44 0-.88.05-1.33h12.86v-3.8H10.87a10.53 10.53 0 0 1 9.81-6.1c4.38 0 7.83 2.35 9.5 5.97h5.36C33.59 4.34 27.89 0 20.73 0 13.39 0 7.56 4.42 5.53 10.87H0v3.8h4.82c-.05.45-.05.89-.05 1.33 0 .49 0 .97.05 1.42H0v3.8h5.57C7.6 27.62 13.39 32 20.73 32c7.16 0 12.86-4.33 14.8-10.74H30.2a10.16 10.16 0 0 1-9.5 5.97z"/></svg>` : ''}
        </div>
    </a>
    `).join('')
};

function generateHTMLForEventExtra(data) {
    return `
    <div class="segment__inner segment__inner--newspage" id="nog-te-beleven-op-deze-locatie">
        <div class="event-category__title">
            <h2>Nog te beleven op deze locatie</h2>
        </div>
        <div class="event-category__teasers">
            ${filteredEventsByEventLocationAndDay(data, selectedEvent)}
        </div>
    </div>
    `
};

function renderEventExtra(data) {
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
    // Load from the events API
    const api = API_URL;
    fetchData(api, data => {
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