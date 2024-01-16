// ---------------- IMPORT --------------------------------------------------------------------------------------------------------------------------------
import { generateHTMLForTeaser } from "./teaser.js";

// ---------------- RANDOM DAY EVENTS ---------------------------------------------------------------------------------------------------------------------
// urlPathDetail for the teaser link, urlPath for no image found, $elem is the events container and data from where does the function get a random event
export function renderRandomEvents(urlPathDetail, urlPath, $elem ,amount, data) {
    // Shuffle the events (https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/)
    const shuffledEvents = data.sort(() => Math.random() - 0.5);
    // Take the first 'amount' from the shuffled events array
    const randomEvents = shuffledEvents.slice(0, amount);
    const randomEventsHTML = randomEvents.map((event) => `
        ${generateHTMLForTeaser(urlPathDetail, urlPath, event)}
    `).join('');
    $elem.innerHTML = randomEventsHTML;
};