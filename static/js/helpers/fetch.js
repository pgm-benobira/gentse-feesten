// ---------------- API URL'S -----------------------------------------------------------------------------------------------------------------------------
export const API_URL_EVENTS = 'https://www.pgm.gent/data/gentsefeesten/events.json';
export const API_URL_EVENTS_LIGHT = 'https://www.pgm.gent/data/gentsefeesten/events_500.json';
export const API_URL_CATEGORIES = 'https://www.pgm.gent/data/gentsefeesten/categories.json';
export const API_URL_NEWS = 'https://www.pgm.gent/data/gentsefeesten/news.json';

// ---------------- FETCH THE DATA ------------------------------------------------------------------------------------------------------------------------
export async function fetchData(url, callback) {
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