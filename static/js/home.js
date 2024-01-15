(() => {
const $randomEvents = document.getElementById('random-events');

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

// ---------------- MOVE SCROLL ---------------------------------------------------------------------------------------------------------------------------
function scrollEvents() {
    const $moveRightElement = document.getElementById('arrow--right');
    const $moveLeftElement = document.getElementById('arrow--left');
    $moveRightElement.addEventListener('click', () => {
        $randomEvents.scrollLeft += 420;
    });
    $moveLeftElement.addEventListener('click', () => {
        $randomEvents.scrollLeft += -420;
    });
};

// ---------------- API URL -------------------------------------------------------------------------------------------------------------------------------
const API_URL_EVENTS = 'https://www.pgm.gent/data/gentsefeesten/events.json';
const API_URL_NEWS = 'https://www.pgm.gent/data/gentsefeesten/news.json';

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

// ---------------- RANDOM DAY EVENTS ---------------------------------------------------------------------------------------------------------------------
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

function renderRandomEvents(amount, data) {
    // Shuffle the events (https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/)
    const shuffledEvents = data.sort(() => Math.random() - 0.5);
    // Take the first three from the shuffled events array
    const randomEvents = shuffledEvents.slice(0, amount);
    const randomEventsHTML = randomEvents.map((event) => `
        ${generateHTMLForTeaser(event)}
    `).join('');
    $randomEvents.innerHTML = randomEventsHTML;
};

// ---------------- RANDOM DAY EVENTS ---------------------------------------------------------------------------------------------------------------------
function renderLastThreeNewsItems(amount, data) {
    const $newsGridElement = document.getElementById('news__grid');
    const threeNewsItems = data.slice(0, amount);
    const threeNewsItemsHTML = threeNewsItems.map((item, index) => `
    <a href="./news.html" class="news-item news-item--${index + 1}">
        <span>${item.title}</span>
        <div class="arrow">
            <svg class="arrow--right" viewBox="0 0 94 32"><path d="M86.53 14.15 81.37 9l2.33-2.32 9.36 9.36-9.3 9.3-2.34-2.34 5.44-5.44H0v-3.4z"/></svg>
        </div>
    </a>
    `).join('');
    const newsGridHTML = `
    ${threeNewsItemsHTML}
    <div class="news-photo news-item--4">
        <img src="./static/img/news-decoration-img.jpg" alt="sfeer-beeld-1">
    </div>
    `
    $newsGridElement.innerHTML = newsGridHTML;
};

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application
function initialize () {
    // Change the logo
    changeLogo();
    // Scroll through random events
    scrollEvents()
    // Load the events from the API
    fetchData(API_URL_EVENTS, data => {
        renderRandomEvents(8, data);
    });
    fetchData(API_URL_NEWS, data => {
        renderLastThreeNewsItems(3, data);
    });
};

// Call the function for the application
initialize();
})();