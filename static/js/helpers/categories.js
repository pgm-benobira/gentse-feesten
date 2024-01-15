(() => {
// ---------------- API URL ------------------------------------------------------------------------------------------------------------------------------
const API_URL = 'https://www.pgm.gent/data/gentsefeesten/categories.json';

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
// Show the user interface for the categories
function renderCategories(data) {
    const $categories = document.getElementById('categories');

    $categories.innerHTML = ''; // Clear categories
    const sortedData = data.sort();
    sortedData.forEach(item => {
        renderCategory($categories, item);
    });
};

function renderCategory($categories, item) {
    const $category = document.createElement('li');
    $category.innerHTML = `
    <a href="#${item}" class="category">${item}</a>
    `;
    $categories.appendChild($category);
};

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application
function initialize () {
    fetchData(API_URL, renderCategories);
};

// Call the function for the application
initialize();
})();