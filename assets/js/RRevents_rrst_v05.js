// --------------------
// Fetch events from RaceResult API
// --------------------
async function fetchEvents({ server, user, year, month, country }) {
    const params = new URLSearchParams({ user, year, month, country });
    const url = `${server}/RREvents/list?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);

    const data = await res.json(); // RaceResult returns array of arrays

    // Map array to objects with named keys for clarity
    return data.map(e => ({
        id: e[0],          // event ID
        icon: e[1],        // icon type
        name: e[2],        // event name
        start: e[3],       // start date
        end: e[4],         // end date
        city: e[5],        // city
        countryCode: e[6], // country code for flag
        lat: e[7],         // latitude
        lon: e[8],         // longitude
        country: e[9],     // country full name
        typeFull: e[10],   // type description
        extra: e[11]       // optional additional data
    }));
}


// --------------------
// Render event cards in a container
// --------------------
function renderEventCards(events, container) {
    container.innerHTML = ""; // clear previous content

    events.forEach(event => {
        const card = document.createElement("div");
        card.className = "EventCard";

        // Event card HTML structure
        card.innerHTML = `
            <div class="EventCardColumns">
                <!-- Left column: Logo -->
                <div class="EventCardLogo">
                    <img class="logo" src="https://my.raceresult.com/${event.id}/logo" alt="" onerror="this.style.display='none';">
                </div>

                <!-- Right column: Event information -->
                <div class="EventCardContent">
                    <div class="EventCardHeader">
                        ${event.countryCode ? `<img class="flag" src="https://my.raceresult.com/graphics/flags/${event.countryCode}.gif" alt="">` : ''}
                        <div class="EventCardDate">${event.start}</div>
                        <img class="icon" src="https://my.raceresult.com/RREvents/eventtypes/${event.icon}.png" alt="">
                    </div>
                    <div class="EventCardName">${event.name}</div>
                    <div class="EventCardCity">${event.city}</div>
                </div>
            </div>
        `;

        // Make the whole card clickable → open event page in new tab
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
            const url = `https://my.raceresult.com/${event.id}`;
            window.open(url, "_blank");
        });

        container.appendChild(card);
    });
}


// --------------------
// Normalize strings for accent-insensitive search
// --------------------
function normalizeString(str) {
    return str
        .normalize("NFD")                // decompose accented characters
        .replace(/[\u0300-\u036f]/g, "") // remove diacritics
        .toLowerCase();                  // convert to lowercase
}


// --------------------
// Setup search functionality
// --------------------
function setupEventSearch(allEvents) {
    const searchInput = document.getElementById("eventSearchInput");
    const searchContainer = document.getElementById("searchResultsContainer");
    const fullCalendar = document.getElementById("allEventsContainer");

    // Listen to user input in the search field
    searchInput.addEventListener("input", () => {
        const query = normalizeString(searchInput.value.trim());

        // If input is empty → show full calendar, hide search results
        if (query === "") {
            searchContainer.style.display = "none";
            searchContainer.innerHTML = "";
            fullCalendar.style.display = "block";
            return;
        }

        // Hide full calendar and show search results container
        fullCalendar.style.display = "none";
        searchContainer.style.display = "block";
        searchContainer.innerHTML = "";

        // Filter events by name or city (accent-insensitive)
        const filtered = allEvents.filter(e =>
            normalizeString(e.name).includes(query) ||
            normalizeString(e.city).includes(query)
        );

        // If no events found → display message
        if (!filtered.length) {
            searchContainer.innerHTML = `<p>No events found.</p>`;
            return;
        }

        // --------------------
        // Group events by month-year for display
        // --------------------
        const grouped = {};

        filtered.forEach(event => {
            let date;

            // Handle different date formats from RaceResult
            if (event.start.includes(".")) {
                // Format: DD.MM.YYYY
                const [day, month, year] = event.start.split(".");
                date = new Date(`${year}-${month}-${day}T00:00:00`);
            } else if (event.start.includes("-")) {
                // Format: YYYY-MM-DD
                date = new Date(event.start + "T00:00:00");
            } else return; // skip unknown format

            const key = `${date.getMonth() + 1}-${date.getFullYear()}`;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(event);
        });

        // Sort month-year groups newest first
        const sortedKeys = Object.keys(grouped).sort((a, b) => {
            const [mA, yA] = a.split("-").map(Number);
            const [mB, yB] = b.split("-").map(Number);
            return yB - yA || mB - mA;
        });

        // Render grouped search results
        sortedKeys.forEach(key => {
            const [m, y] = key.split("-").map(Number);

            // Month-Year header
            const title = document.createElement("h2");
            title.textContent = formatMonthYear(m, y);
            searchContainer.appendChild(title);

            // Container for this month's event cards
            const monthDiv = document.createElement("div");
            monthDiv.className = "EventCardsContainer";

            renderEventCards(grouped[key], monthDiv);
            searchContainer.appendChild(monthDiv);
        });
    });
}


// --------------------
// Load all events from startYear to endYear
// --------------------
let allEvents = []; // global array to store events for search

async function loadAllEventCards(startYear, endYear) {
    const container = document.getElementById("allEventsContainer");
    container.innerHTML = "";
    allEvents = []; // reset global array

    // Loop from newest year/month to oldest
    for (let year = endYear; year >= startYear; year--) {
        for (let month = 12; month >= 1; month--) {

            const today = new Date();
            // Skip future months
            if (year === today.getFullYear() && month > today.getMonth() + 1) continue;

            // Month-Year header
            const monthTitle = document.createElement("h2");
            monthTitle.textContent = formatMonthYear(month, year);
            monthTitle.style.marginTop = "32px";
            container.appendChild(monthTitle);

            // Container for this month's event cards
            const monthContainer = document.createElement("div");
            monthContainer.className = "EventCardsContainer";
            container.appendChild(monthContainer);

            try {
                const events = await fetchEvents({
                    server: "https://my.raceresult.com",
                    user: 846,
                    year,
                    month
                });

                // Store for search
                allEvents.push(...events);

                // Render cards
                renderEventCards(events, monthContainer);
            } catch (err) {
                console.error(err);
                monthContainer.innerHTML = `<div class="Error">Failed to load events</div>`;
            }
        }
    }

    // Activate search after all events loaded
    setupEventSearch(allEvents);
}


// --------------------
// Month names helper
// --------------------
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function formatMonthYear(month, year) {
    return `${monthNames[month - 1]} ${year}`;
}
