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
    // Only do if there is a searchValue otherwise it's just a blank search page
    if (searchValue !== null) {
        return events.filter((event) => event.title.toLowerCase().includes(searchValue.toLowerCase()));
    }
    console.log('Blank search page');
};

// ---------------- SHOW FILTERED EVENTS ------------------------------------------------------------------------------------------------------------------
function renderSearchEvents(events) {
    // Only rendrer if there are events
    if (events !== undefined) {
        // HTML for searched events
        const searchEventsHTML = events.map((item) => `
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
    }
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
    eventViewHTML = `
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

// ---------------- ACTIVE VIEW (list/raster) -------------------------------------------------------------------------------------------------------------
function changeEventsView(filteredEvents) {
    const searchCount = filteredEvents ? filteredEvents.length : '0';
    // If there are events displayed the make te changeEventsView work
    if (searchCount !== 0) {
        const $list = document.querySelector('.list');
        const $raster = document.querySelector('.raster');
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
    }
};

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application
function initialize () {
    // Load the events from the API
    const api = API_URL;
    fetchData(api, data => {
        const filteredEvents = filteredSearchEvents(data, searchValue);
        renderSearchEvents(filteredEvents);
        showSearchFeedback(searchValue, filteredEvents);
        changeEventsView(filteredEvents);
    });
    // Show the searchValue in the input field
    changeInputValue(searchValue)
    // Console checks
    console.log('Search:', searchValue);
};

// Call the function for the application
initialize();
})();