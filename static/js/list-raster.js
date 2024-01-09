const $events = document.getElementById('events');

// ---------------- ACTIVE VIEW (list/raster) -------------------------------------------------------------------------------------------------------------
const $list = document.querySelector('.list');
const $raster = document.querySelector('.raster');

function changeEventsView() {
    $list.addEventListener('click', () => {
        $raster.classList.remove('event-view--active')
        $events.classList.add('events--list')
        $list.classList.add('event-view--active')
    });
    $raster.addEventListener('click', () => {
        $list.classList.remove('event-view--active')
        $events.classList.remove('events--list')
        $raster.classList.add('event-view--active')
    });
};

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application
function initialize () {
    // Change the appearance of the compact header links
    changeEventsView()
};

// Call the function for the application
initialize();