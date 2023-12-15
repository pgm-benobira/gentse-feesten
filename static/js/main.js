(() => {
const $languageElement = document.querySelector('.language-button')
const $languagesElement = document.querySelector('.languages')
const $modalElement = document.querySelector('.modal');
const $buttonElement = document.querySelector('.menu-button')
const $closeModalElement = document.querySelector('.menu-button--close')

// ---------------- LANGUAGE -----------------------------------------------------------------------------------------------------------------------------
function generateUIForLanguages () {
    $languageElement.addEventListener('click', () => {
        $languageElement.classList.toggle('language-button--open')
        $languagesElement.classList.toggle('languages--open')
    });
}

// ---------------- MENU ---------------------------------------------------------------------------------------------------------------------------------
function generateUIForMenu () {
    $buttonElement.addEventListener('click', () => {
        $modalElement.classList.add('modal-open')
    });
    $closeModalElement.addEventListener('click', () => {
        $modalElement.classList.remove('modal-open')
    });
};

// ---------------- GENERATE USER INTERFACE --------------------------------------------------------------------------------------------------------------
// Show the user interface for 'Gentse Feesten'
function generateUI () {
    // Show the language dropdown
    generateUIForLanguages();
    // Show the menu
    generateUIForMenu();
};

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application 'Gentse Feesten'
function initialize () {
    generateUI();
};

// Call the function for the application
initialize();
})();