(() => {
const $events = document.getElementById('events');

// ---------------- ACTIVE VIEW (list/raster) -------------------------------------------------------------------------------------------------------------
const $list = document.querySelector('.list');
const $raster = document.querySelector('.raster');

function changeEventsView() {
    $list.addEventListener('click', () => {
        $raster.classList.remove('event-view--active')
        $events.classList.add('events--list')
        $list.classList.add('event-view--active')
    });
    $raster.addEventListener('click', () => {
        $list.classList.remove('event-view--active')
        $events.classList.remove('events--list')
        $raster.classList.add('event-view--active')
    });
};

// ---------------- API URL ------------------------------------------------------------------------------------------------------------------------------
const API_URL = 'https://www.pgm.gent/data/gentsefeesten/events.json';

// ---------------- FETCH THE DATA -----------------------------------------------------------------------------------------------------------------------
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

function filteredEventsByDay(events, selectedDay) {
    return events.filter((event) => event.day === selectedDay);
};

// ---------------- EVENTS --------------------------------------------------------------------------------------------------------------------------------
function generateHTMLForEvents(items, category) {
    // All the items for one category
    const categoryItems = items.filter((item) => item.category === category)

    // HTML for teasers in one category
    const teasersHTML = categoryItems.map((item) => `
    <div class="teaser__wrapper">
        <span class="teaser__date">${item.day_of_week} ${item.day} juli</span>
        <img class="teaser__img" src="${item.image ? item.image.thumb : ''}" alt="">
        <div class="teaser">
            <h3>${item.title}</h3>
            <div>
                <p class="teaser__location">${item.location}</p>
                <p>${item.start} u.</p>
            </div>
        </div>
    </div>
    `)

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
    const filteredEvents = filteredEventsByDay(data, selectedDay)
    // Extract unique categories from the events array
    categories = [...new Set(filteredEvents.map(event => event.category))];
    console.log(categories);
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

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application
function initialize () {
    // Change the appearance of the compact header links
    changeEventsView()
    // Load the events from the API
    const api = API_URL;
    fetchData(api, data => {
        renderEvents(data);
        activeCalendarLink(selectedDay);
    });
    console.log(selectedDay);
};

// Call the function for the application
initialize();
})();