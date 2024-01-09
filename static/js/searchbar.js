(() => {
const $events = document.getElementById('events');

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
let searchValue = urlParams.get('search');

function filteredSearchEvents(events, searchValue) {
    return events.filter((event) => event.title.toLowerCase().includes(searchValue.toLowerCase()));
};

// ---------------- SHOW FILTERED EVENTS ------------------------------------------------------------------------------------------------------------------
function renderSearchEvents(events) {
    // Filter events on selected day
    const filteredEvents = filteredSearchEvents(events, searchValue);
    const searchEventsHTML = filteredEvents.map((item) => `
        <a href="detail.html?day=${item.day}&slug=${item.slug}" class="teaser__wrapper">
            <span class="teaser__date">${item.day_of_week} ${item.day} juli</span>
            <img class="teaser__img" src="${item.image ? item.image.thumb : './static/img/no-event-image.jpg'}" alt="thumb-image-${item.slug}">
            <div class="teaser">
                <h3>${item.title}</h3>
                <p class="teaser__location">${item.location}</p>
                <p class="teaser__start">${item.start} u.</p>
                ${item.wheelchair_accessible ? `<svg class="teaser__paid" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 32"><path d="M20.68 27.23c-4.46 0-8-2.35-9.72-6.01h11.76v-3.8H9.9c-.09-.45-.09-.93-.09-1.42 0-.44 0-.88.05-1.33h12.86v-3.8H10.87a10.53 10.53 0 0 1 9.81-6.1c4.38 0 7.83 2.35 9.5 5.97h5.36C33.59 4.34 27.89 0 20.73 0 13.39 0 7.56 4.42 5.53 10.87H0v3.8h4.82c-.05.45-.05.89-.05 1.33 0 .49 0 .97.05 1.42H0v3.8h5.57C7.6 27.62 13.39 32 20.73 32c7.16 0 12.86-4.33 14.8-10.74H30.2a10.16 10.16 0 0 1-9.5 5.97z"/></svg>` : ''}
            </div>
        </a>
    `).join('');
    $events.innerHTML = `
    <div class="event-category__teasers">
        ${searchEventsHTML}
    </div>
    `;
};

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application
function initialize () {
    // Load the events from the API
    const api = API_URL;
    fetchData(api, data => {
        console.log(filteredSearchEvents(data, searchValue));
        renderSearchEvents(data);
    });
    // Console checks
    console.log(searchValue);
};

// Call the function for the application
initialize();
})();