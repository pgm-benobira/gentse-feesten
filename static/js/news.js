(() => {
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

// ---------------- API URL ------------------------------------------------------------------------------------------------------------------------------
const API_URL = 'https://www.pgm.gent/data/gentsefeesten/news.json';

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

// ---------------- GENERATE USER INTERFACE --------------------------------------------------------------------------------------------------------------
// Show the user interface for the news items
function renderNewsItems(data) {
    const $newsItems = document.getElementById('news-items');

    $newsItems.innerHTML = ''; // Clear news items
    data.forEach(item => {
        renderNewsItem($newsItems, item);
    });
};

function renderNewsItem($newsItems, item) {
    const $newsItem = document.createElement('div');
    $newsItem.innerHTML = `
        <a href="#" class="news-item news-item--larger">
            <div class="news-item__left">
                <span>${item.title}</span>
                <div class="arrow">
                    <svg class="arrow--right" viewBox="0 0 94 32"><path d="M86.53 14.15 81.37 9l2.33-2.32 9.36 9.36-9.3 9.3-2.34-2.34 5.44-5.44H0v-3.4z"/></svg>
                </div>
            </div>
            <div class="news-item__right">
                <img src="${item.picture.medium}" alt="nieuws-sfeerbeeld">
            </div>
        </a>
        `;
    $newsItems.appendChild($newsItem);
};

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application
function initialize () {
    // Change the logo
    changeLogo();
    fetchData(API_URL, renderNewsItems);
};

// Call the function for the application
initialize();
})();