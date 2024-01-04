(() => {
const $events = document.getElementById('events');

// ---------------- ACTIVE VIEW ----------------------------------------------------------------------------------------------------------------------------
const $list = document.querySelector('.list');
const $raster = document.querySelector('.raster');

function changeEventsView() {
    $list.addEventListener('click', () => {
        $raster.classList.remove('event-view--active')
        $events.classList.add('events--list')
        $list.classList.add('event-view--active')
    })
    $raster.addEventListener('click', () => {
        $list.classList.remove('event-view--active')
        $events.classList.remove('events--list')
        $raster.classList.add('event-view--active')
    })
}

// ---------------- API URL ------------------------------------------------------------------------------------------------------------------------------
const API_URL = 'https://www.pgm.gent/data/gentsefeesten/events_500.json';

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
    return `
    <div class="event-category" id="${category}">
        <div class="event-category__title">
            <h2>${category}</h2>
            <a class="go-up" href="#filters"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 32"><path d="M17.8 9.9 8.94 0 0 9.9l2.23 2L7.4 6.15V32h3V6.14l5.17 5.76z"/></svg></a>
        </div>
        <div class="event-category__teasers">
            ${items.filter((item) => item.category === category).map((item) => `
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
            `).join('')}
        </div>
        
    </div>
    `
}

function renderEvents(data) {
    // Filter events on selected day
    const filteredEvents = filteredEventsByDay(data, selectedDay)
    // Extract unique categories from the events array
    categories = [...new Set(filteredEvents.map(event => event.category))];
    // Used to accumulate all HTML for all categories
    let eventsHTML = '';
    for (const category of categories) {
        eventsHTML += generateHTMLForEvents(filteredEvents, category);
    };
    $events.innerHTML = eventsHTML;
}

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application
function initialize () {
    // Change the appearance of the compact header links
    changeEventsView()
    // Load the events from the API
    const api = API_URL;
    fetchData(api, renderEvents);
    console.log(selectedDay);
};

// Call the function for the application
initialize();
})();