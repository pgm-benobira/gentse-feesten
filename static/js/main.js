(() => {
const $logoElements = document.querySelectorAll('.logo-gf')
const $campaignElements = document.querySelectorAll('.campaign-gf')
const $languageElements = document.querySelectorAll('.language-button')
const $modalElement = document.querySelector('.modal');
const $buttonElement = document.querySelector('.menu-button')
const $closeModalElement = document.querySelector('.menu-button--close')

// ---------------- RANDOM LETTER ------------------------------------------------------------------------------------------------------------------------
// Array of possible letters for the src attribute
const possibleLetters = ["G", "E", "N", "T", "S", "E"];

// Get a random letter from the array
function getRandomIndex(max) {
    return Math.floor(Math.random() * max) + 1;
};

function changeLogo() {
    const amountOfLetters = possibleLetters.length;
    const randomIndex = getRandomIndex(amountOfLetters);
    const randomLetter = possibleLetters[randomIndex - 1];
    console.log('Letter:', randomLetter);
    $logoElements.forEach(logo => {
        logo.src = `/Users/benoit/Desktop/Artevelde/2023-24/S1/Kwartaal%202/@Work%201/atwork-1_project_2_biraguma_benoit/app/static/img/gentse-feesten-logos/GF-logo-2023-${randomIndex}-${randomLetter}.svg`
    });
    $campaignElements.forEach(elem => {
        elem.style.backgroundImage = `url(/Users/benoit/Desktop/Artevelde/2023-24/S1/Kwartaal%202/@Work%201/atwork-1_project_2_biraguma_benoit/app/static/img/gentse-feesten-logos/campagne-${randomIndex}-${randomLetter}.png)`
    })
};

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
    // Change the logo
    changeLogo();
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