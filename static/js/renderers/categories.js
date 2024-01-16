import { API_URL_CATEGORIES, fetchData } from "../helpers/fetch.js"; 

(() => {
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
    fetchData(API_URL_CATEGORIES, renderCategories);
};

// Call the function for the application
initialize();
})();