(() => {
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
                <img src="${item.picture.medium}">
            </div>
        </a>
        `;
    $newsItems.appendChild($newsItem);
};

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application
function initialize () {
    const api = API_URL;
    fetchData(api, renderNewsItems);
};

// Call the function for the application
initialize();
})();