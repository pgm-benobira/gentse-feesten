(() => {
const $languageElements = document.querySelectorAll('.language-button')
const $modalElement = document.querySelector('.modal');
const $buttonElement = document.querySelector('.menu-button')
const $closeModalElement = document.querySelector('.menu-button--close')

// ---------------- LANGUAGE -----------------------------------------------------------------------------------------------------------------------------
function generateUIForLanguages () {
    $languageElements.forEach(dropdown => {
        dropdown.addEventListener('click', () => {
            dropdown.classList.toggle('language-button--open')
        });
    });
};

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