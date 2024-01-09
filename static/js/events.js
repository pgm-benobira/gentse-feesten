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

function filteredEventsByDay(events, selectedDay) {
    return events.filter((event) => event.day === selectedDay);
};

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

// ---------------- EVENTS --------------------------------------------------------------------------------------------------------------------------------
function generateHTMLForEvents(items, category) {
    // All the items for one category
    const categoryItems = items.filter((item) => item.category.includes(category))

    // HTML for teasers in one category
    const teasersHTML = categoryItems.map((item) => `
    <a href="detail.html?day=${item.day}&slug=${item.slug}" class="teaser__wrapper">
        <span class="teaser__date">${item.day_of_week} ${item.day} juli</span>
        <img class="teaser__img" src="${item.image ? item.image.thumb : '../static/img/no-event-image.jpg'}" alt="thumb-image-${item.slug}">
        <div class="teaser">
            <h3>${item.title}</h3>
            <p class="teaser__location">${item.location}</p>
            <p class="teaser__start">${item.start} u.</p>
            ${item.wheelchair_accessible ? `<svg class="teaser__paid" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 32"><path d="M20.68 27.23c-4.46 0-8-2.35-9.72-6.01h11.76v-3.8H9.9c-.09-.45-.09-.93-.09-1.42 0-.44 0-.88.05-1.33h12.86v-3.8H10.87a10.53 10.53 0 0 1 9.81-6.1c4.38 0 7.83 2.35 9.5 5.97h5.36C33.59 4.34 27.89 0 20.73 0 13.39 0 7.56 4.42 5.53 10.87H0v3.8h4.82c-.05.45-.05.89-.05 1.33 0 .49 0 .97.05 1.42H0v3.8h5.57C7.6 27.62 13.39 32 20.73 32c7.16 0 12.86-4.33 14.8-10.74H30.2a10.16 10.16 0 0 1-9.5 5.97z"/></svg>` : ''}
        </div>
    </a>
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
    const filteredEvents = filteredEventsByDay(data, selectedDay)
    // Extract unique categories from the events array
    const categories = [...new Set(filteredEvents.map(event => event.category).flat())];
    // Used to accumulate all HTML for all categories
    let eventsHTML = '';
    for (const category of categories) {
        eventsHTML += generateHTMLForEvents(filteredEvents, category);
    };
    $events.innerHTML = eventsHTML;
};

// ---------------- RANDOM DAY EVENTS ---------------------------------------------------------------------------------------------------------------------
function renderRandomEvents(amount, data) {
    const $randomEvents = document.getElementById('random-events')
    // Filter events on selected day
    const filteredEvents = filteredEventsByDay(data, selectedDay);
    // Shuffle the events (https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/)
    const shuffledEvents = filteredEvents.sort(() => Math.random() - 0.5)
    // Take the first three from the shuffled events array
    const randomEvents = shuffledEvents.slice(0, amount)
    const randomEventsHTML = randomEvents.map((item) => `
        <a href="detail.html?day=${item.day}&slug=${item.slug}" class="teaser__wrapper">
            <span class="teaser__date">${item.day_of_week} ${item.day} juli</span>
            <img class="teaser__img" src="${item.image ? item.image.thumb : '../static/img/no-event-image.jpg'}" alt="thumb-image-${item.slug}">
            <div class="teaser">
                <h3>${item.title}</h3>
                <p class="teaser__location">${item.location}</p>
                <p class="teaser__start">${item.start} u.</p>
                ${item.wheelchair_accessible ? `<svg class="teaser__paid" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 32"><path d="M20.68 27.23c-4.46 0-8-2.35-9.72-6.01h11.76v-3.8H9.9c-.09-.45-.09-.93-.09-1.42 0-.44 0-.88.05-1.33h12.86v-3.8H10.87a10.53 10.53 0 0 1 9.81-6.1c4.38 0 7.83 2.35 9.5 5.97h5.36C33.59 4.34 27.89 0 20.73 0 13.39 0 7.56 4.42 5.53 10.87H0v3.8h4.82c-.05.45-.05.89-.05 1.33 0 .49 0 .97.05 1.42H0v3.8h5.57C7.6 27.62 13.39 32 20.73 32c7.16 0 12.86-4.33 14.8-10.74H30.2a10.16 10.16 0 0 1-9.5 5.97z"/></svg>` : ''}
            </div>
        </a>
    `).join('');
    $randomEvents.innerHTML = randomEventsHTML;
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
    // Change the appearance of the compact header links
    changeEventsView()
    // Load the events from the API
    const api = API_URL;
    fetchData(api, data => {
        handleURLParams()
        renderEvents(data);
        renderRandomEvents(3, data)
        activeCalendarLink(selectedDay);
        updatePageTitle(selectedDay);
    });
    // Console checks
    console.log('Day:', selectedDay);
};

// Call the function for the application
initialize();
})();