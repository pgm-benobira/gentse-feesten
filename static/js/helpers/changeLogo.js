// ---------------- RANDOM LETTER ------------------------------------------------------------------------------------------------------------------------
// Array of possible letters for the src attribute
const possibleLetters = ["G", "E", "N", "T", "S", "E"];

// Get a random letter from the array
function getRandomIndex(max) {
    return Math.floor(Math.random() * max) + 1;
};

export function changeLogo(urlPath) {
    const $logoElements = document.querySelectorAll('.logo-gf')
    const $campaignElements = document.querySelectorAll('.campaign-gf')

    const amountOfLetters = possibleLetters.length;
    const randomIndex = getRandomIndex(amountOfLetters);
    const randomLetter = possibleLetters[randomIndex - 1];
    console.log('Letter:', randomLetter);

    // Is it inside the static folder? urlPath = ./static and inside the events folder? urlPath = ../static
    $logoElements.forEach(logo => {
        logo.src = `${urlPath}/img/gentse-feesten-logos/GF-logo-2023-${randomIndex}-${randomLetter}.svg`
    });
    $campaignElements.forEach(elem => {
        elem.style.backgroundImage = `url(${urlPath}/img/gentse-feesten-logos/campagne-${randomIndex}-${randomLetter}.png)`
    })
};