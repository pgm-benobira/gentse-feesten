// ---------------- FILTER EVENTS -------------------------------------------------------------------------------------------------------------------------
export function filteredSearchEvents(events, value) {
    // Only do if there is a value otherwise it's just a blank search page
    if (value !== null) {
        return events.filter((event) => {
        // To catch empty locations or empty descriptions
        const lowerCaseLocation = event.location ? event.location.toLowerCase() : '';
        const lowerCaseDescription = event.description ? event.description.toLowerCase() : '';
        return (
            event.title.toLowerCase().includes(value.toLowerCase()) ||
            event.day.toLowerCase().includes(value.toLowerCase()) ||
            lowerCaseLocation.toLowerCase().includes(value.toLowerCase()) ||
            lowerCaseDescription.toLowerCase().includes(value.toLowerCase()) ||
            event.day_of_week.toLowerCase().includes(value.toLowerCase())
            );
        });
    };
    console.log('Blank search page');
};

export function filteredEventsByDay(events, day) {
    return events.filter((event) => event.day === day);
};

export function filteredEventsByDayAccessibility(events) {
    return events.filter((event) => event.wheelchair_accessible);
};

export function filteredEventsByDayPrice(events) {
    return events.filter((event) => event.ticket === "free");
};