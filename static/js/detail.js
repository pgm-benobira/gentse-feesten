(() => {
const $eventDetail = document.getElementById('event-detail');

// ---------------- API URL -------------------------------------------------------------------------------------------------------------------------------
const API_URL = 'https://www.pgm.gent/data/gentsefeesten/events_500.json';

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
let selectedEvent = urlParams.get('slug')

function filteredEventsBySlug(data, slug) {
    return data.find((item) => item.slug === slug);
};

// ---------------- EVENTS --------------------------------------------------------------------------------------------------------------------------------
function generateHTMLForEventDetail(item) {
    categoriesHTML = item.category.map((c) => `<a href="./day.html?day=${item.day}#${c}">${c}</a>`).join('\n')
    return `
    <div class="segment__inner segment__inner--newspage event-detail">
        <section class="event-detail__left">
            <a href="./day.html?day=${item.day}" class="go-back">
                <svg class="go-back__arrow" viewBox="0 0 94 32"><path d="M86.53 14.15 81.37 9l2.33-2.32 9.36 9.36-9.3 9.3-2.34-2.34 5.44-5.44H0v-3.4z"/></svg>
                <p>Overzicht ${item.day_of_week} ${item.day} juli</p>
            </a>
            <div class="event-detail__content">
                <h2>${item.title}</h2>
                <div class="event-space-time">
                    <p class="event-space">${item.location}</p>
                    <p class="event-time">${item.start} u. - ${item.end} u.</p>
                    ${item.wheelchair_accessible ? `<div class="event-accessibility__container"><svg class="event-accessibility" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="m31 24.1.9 1.8a1 1 0 0 1-.45 1.34l-4.1 2.05a2 2 0 0 1-2.7-.94L20.73 20H12a2 2 0 0 1-1.98-1.72C7.9 3.45 8.02 4.38 8 4a4 4 0 1 1 4.59 3.96l.29 2.04H21a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-7.55l.3 2H22c.78 0 1.48.45 1.82 1.15l3.6 7.65 2.25-1.14a1 1 0 0 1 1.34.45zM19.47 22h-1.53A7.01 7.01 0 0 1 4 21c0-2.6 1.42-4.86 3.52-6.08l-.6-4.14A11.03 11.03 0 0 0 0 21a11.01 11.01 0 0 0 21.07 4.43L19.47 22z"/></svg></div>`  : ''}
                </div>
                <p class="event-description">${item.description}</p>
                <div class="event-info">
                    <p class="event-info__key">Organisator:</p>
                    <p>${item.organizer}</p>
                </div>
                ${item.url ? `<div class="event-info"><p class="event-info__key">Website:</p><a href="${item.url}" target="_blank">${item.url}</a></div>`: ''}
                <div class="event-info">
                    <p class="event-info__key">Categorieën:</p>
                    <div class="event-info__categories">
                        ${categoriesHTML}
                    </div>
                </div>
            </div>
        </section>
        <section class="event-detail__right">
            <img class="event-detail__photo" src="${item.image ? item.image.full : ''}" alt="foto-${item.slug}">
            <ul class="socials socials--event">
                <li><a href="#" target="_blank"><img src="../static/img/gentse-feesten-icoontjes/twitter.svg" alt="twitter-logo"></a></li>
                <li><a href="#" target="_blank"><img src="../static/img/gentse-feesten-icoontjes/facebook.svg" alt="facebook-logo"></a></li>
                <li><a href="#" target="_blank"><img src="../static/img/gentse-feesten-icoontjes/pinterest.svg" alt="pinterest-logo"></a></li>
            </ul>
        </section>
    </div>
    <div class="segment__inner segment__inner--newspage event-detail event-detail--mobile">
        <section class="event-detail__left">
            <a href="./day.html?day=${item.day}" class="go-back">
                <svg class="go-back__arrow" viewBox="0 0 94 32"><path d="M86.53 14.15 81.37 9l2.33-2.32 9.36 9.36-9.3 9.3-2.34-2.34 5.44-5.44H0v-3.4z"/></svg>
                <p>Overzicht ${item.day_of_week} ${item.day} juli</p>
            </a>
            <div class="event-detail__content">
                <h2>${item.title}</h2>
                <div class="event-space-time">
                    <p class="event-space">${item.location}</p>
                    <p class="event-time">${item.start} u. - ${item.end} u.</p>
                    ${item.wheelchair_accessible ? `<div class="event-accessibility__container"><svg class="event-accessibility" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="m31 24.1.9 1.8a1 1 0 0 1-.45 1.34l-4.1 2.05a2 2 0 0 1-2.7-.94L20.73 20H12a2 2 0 0 1-1.98-1.72C7.9 3.45 8.02 4.38 8 4a4 4 0 1 1 4.59 3.96l.29 2.04H21a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-7.55l.3 2H22c.78 0 1.48.45 1.82 1.15l3.6 7.65 2.25-1.14a1 1 0 0 1 1.34.45zM19.47 22h-1.53A7.01 7.01 0 0 1 4 21c0-2.6 1.42-4.86 3.52-6.08l-.6-4.14A11.03 11.03 0 0 0 0 21a11.01 11.01 0 0 0 21.07 4.43L19.47 22z"/></svg></div>`  : ''}
                </div>
                <p class="event-description">${item.description}</p>
                <img class="event-detail__photo" src="${item.image ? item.image.full : ''}" alt="foto-${item.slug}">
            </div>
        </section>
        <section class="event-detail__right">
            <div class="event-info">
                <p class="event-info__key">Organisator:</p>
                <p>${item.organizer}</p>
            </div>
            ${item.url ? `<div class="event-info"><p class="event-info__key">Website:</p><a href="${item.url}" target="_blank">${item.url}</a></div>`: ''}
            <div class="event-info">
                <p class="event-info__key">Categorieën:</p>
                <div class="event-info__categories">
                    ${categoriesHTML}
                </div>
            </div>
            <ul class="socials socials--event">
                <li><a href="#" target="_blank"><img src="../static/img/gentse-feesten-icoontjes/twitter.svg" alt="twitter-logo"></a></li>
                <li><a href="#" target="_blank"><img src="../static/img/gentse-feesten-icoontjes/facebook.svg" alt="facebook-logo"></a></li>
                <li><a href="#" target="_blank"><img src="../static/img/gentse-feesten-icoontjes/pinterest.svg" alt="pinterest-logo"></a></li>
            </ul>
        </section>
    </div>
    <div class="segment__inner segment__inner--newspage map">
        <section class="location">
            <p class="event-space event-space--map">${item.location}</p>
            <a href="#">Open in Google Maps</a>
        </section>
        <section class="google-maps">
            <img src="../static/img/map-decoration-img.png" alt="map-of-ghent">
        </section>
    </div>
    `
};

function renderEventDetail(data) {
    $eventDetail.innerHTML = generateHTMLForEventDetail(data);
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
}

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application
function initialize () {
    // Load the events from the API
    const api = API_URL;
    fetchData(api, data => {
        const selectedEventData = selectedEvent ? filteredEventsBySlug(data, selectedEvent) : '';
        renderEventDetail(selectedEventData);
        activeCalendarLink(selectedDay);
        updatePageTitle(selectedEventData.title);
    });
    console.log('Day:', selectedDay);
    console.log('Event:', selectedEvent)
};

// Call the function for the application
initialize();
})();