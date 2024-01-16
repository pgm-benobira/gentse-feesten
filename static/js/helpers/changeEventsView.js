// ---------------- ACTIVE VIEW (list/raster) -------------------------------------------------------------------------------------------------------------
export function changeEventsView($events, filteredEvents) {
    const searchCount = filteredEvents ? filteredEvents.length : '0';
    // If there are events displayed the make te changeEventsView work
    if (searchCount !== 0) {
        const $list = document.querySelector('.list');
        const $raster = document.querySelector('.raster');
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
    }
};