(() => {
const $events = document.getElementById('events');

// ---------------- RANDOM LETTER ------------------------------------------------------------------------------------------------------------------------
// Array of possible letters for the src attribute
const possibleLetters = ["G", "E", "N", "T", "S", "E"];

// Get a random letter from the array
function getRandomIndex(max) {
    return Math.floor(Math.random() * max) + 1;
};

function changeLogo() {
    const $logoElements = document.querySelectorAll('.logo-gf')
    const $campaignElements = document.querySelectorAll('.campaign-gf')

    const amountOfLetters = possibleLetters.length;
    const randomIndex = getRandomIndex(amountOfLetters);
    const randomLetter = possibleLetters[randomIndex - 1];
    console.log('Letter:', randomLetter);
    
    $logoElements.forEach(logo => {
        logo.src = `./static/img/gentse-feesten-logos/GF-logo-2023-${randomIndex}-${randomLetter}.svg`
    });
    $campaignElements.forEach(elem => {
        elem.style.backgroundImage = `url(./static/img/gentse-feesten-logos/campagne-${randomIndex}-${randomLetter}.png)`
    })
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
let searchValue = urlParams.get('search');

function filteredSearchEvents(events, searchValue) {
    // Only do if there is a searchValue otherwise it's just a blank search page
    if (searchValue !== null) {
        return events.filter((event) => {
        // To catch empty locations or empty descriptions
        const lowerCaseLocation = event.location ? event.location.toLowerCase() : '';
        const lowerCaseDescription = event.description ? event.description.toLowerCase() : '';
        return (
            event.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            event.day.toLowerCase().includes(searchValue.toLowerCase()) ||
            lowerCaseLocation.toLowerCase().includes(searchValue.toLowerCase()) ||
            lowerCaseDescription.toLowerCase().includes(searchValue.toLowerCase()) ||
            event.day_of_week.toLowerCase().includes(searchValue.toLowerCase())
            );
        });
    };
    console.log('Blank search page');
};

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
function generateHTMLForTeaser(event) {
    return `
    <a href="detail.html?day=${event.day}&slug=${event.slug}" class="teaser__wrapper">
        <span class="teaser__date">${event.day_of_week} ${event.day} juli</span>
        <img class="teaser__img" src="${event.image ? event.image.thumb : './static/img/no-event-image.jpg'}" alt="thumb-image-${event.slug}">
        <div class="teaser">
            <h3>${event.title}</h3>
            <p class="teaser__location">${event.location}</p>
            <p class="teaser__start">${event.start} u.</p>
            ${event.ticket === "paid" ? `<svg class="teaser__paid" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 32"><path d="M20.68 27.23c-4.46 0-8-2.35-9.72-6.01h11.76v-3.8H9.9c-.09-.45-.09-.93-.09-1.42 0-.44 0-.88.05-1.33h12.86v-3.8H10.87a10.53 10.53 0 0 1 9.81-6.1c4.38 0 7.83 2.35 9.5 5.97h5.36C33.59 4.34 27.89 0 20.73 0 13.39 0 7.56 4.42 5.53 10.87H0v3.8h4.82c-.05.45-.05.89-.05 1.33 0 .49 0 .97.05 1.42H0v3.8h5.57C7.6 27.62 13.39 32 20.73 32c7.16 0 12.86-4.33 14.8-10.74H30.2a10.16 10.16 0 0 1-9.5 5.97z"/></svg>` : ''}
            ${event.wheelchair_accessible ? `<svg class="teaser__accessibility" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="m31 24.1.9 1.8a1 1 0 0 1-.45 1.34l-4.1 2.05a2 2 0 0 1-2.7-.94L20.73 20H12a2 2 0 0 1-1.98-1.72C7.9 3.45 8.02 4.38 8 4a4 4 0 1 1 4.59 3.96l.29 2.04H21a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-7.55l.3 2H22c.78 0 1.48.45 1.82 1.15l3.6 7.65 2.25-1.14a1 1 0 0 1 1.34.45zM19.47 22h-1.53A7.01 7.01 0 0 1 4 21c0-2.6 1.42-4.86 3.52-6.08l-.6-4.14A11.03 11.03 0 0 0 0 21a11.01 11.01 0 0 0 21.07 4.43L19.47 22z"/></svg>` : ''}
        </div>
    </a>
    `
};

function renderSearchEvents(events, amount) {
    // Only rendrer if there are events
    if (events !== undefined) {
        // Display a maximum amount of teasers
        const slicedEvents = events.slice(0, amount)
        // HTML for searched events
        const searchEventsHTML = slicedEvents.map((event) => `
            ${generateHTMLForTeaser(event)}
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
    // Change the logo
    changeLogo();
    // Load the events from the API
    fetchData(API_URL, data => {
        const filteredEvents = filteredSearchEvents(data, searchValue);
        renderSearchEvents(filteredEvents, 24);
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