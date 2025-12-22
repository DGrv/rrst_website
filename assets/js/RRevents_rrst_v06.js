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

    // 1️⃣ Load RaceResult events
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


    // 2️⃣ Load custom events
    await loadCustomEvents(container);


    // Activate search after all events loaded
    setupEventSearch(allEvents);
}

// --------------------
// Load local json
// --------------------

async function loadCustomEvents() {
    const folder = "/assets/data/events/";

    // List of your JSON files
    const files = [
        "events_2024.json",
        "events_2023.json",
        "events_2022.json",
        "events_2021.json",
        "events_2020.json",
        "events_2019.json",
        "events_2018.json",
        "events_2017.json",
        "events_2016.json",
        "events_2015.json",
        "events_2014.json",
        "events_2013.json",
        "events_2012.json",
        "events_2011.json",
        "events_2010.json",
        "events_2009.json",
        "events_2008.json",
        "events_2007.json",
        "events_2006.json",
        "events_2005.json",
    ];

    for (const file of files) {
        try {
            const response = await fetch(folder + file);
            if (!response.ok) continue;

            const customData = await response.json();

            customData.forEach(event => {
                // push to global
                allEvents.push(event);

                // determine month + year from start date
                const date = new Date(event.start);
                const month = date.getMonth() + 1;
                const year = date.getFullYear();

                // find existing monthTitle
                let monthHeaders = container.querySelectorAll("h2");
                let monthHeader = null;
                let monthContainer = null;

                monthHeaders.forEach(h2 => {
                    if (h2.textContent === formatMonthYear(month, year)) {
                        monthHeader = h2;
                        monthContainer = h2.nextElementSibling;
                    }
                });

                // If no container for that month exists, create one
                if (!monthContainer) {
                    const monthTitle = document.createElement("h2");
                    monthTitle.textContent = formatMonthYear(month, year);
                    monthTitle.style.marginTop = "32px";
                    container.appendChild(monthTitle);

                    monthContainer = document.createElement("div");
                    monthContainer.className = "EventCardsContainer";
                    container.appendChild(monthContainer);
                }

                // Render card into correct month container
                renderEventCards([event], monthContainer);
            });

        } catch (err) {
            console.error("Failed custom JSON:", file);
        }
    }
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




// --------------------
// Render type filter icons
// --------------------
function renderTypeFilters(allEvents) {
    const container = document.getElementById("eventTypeFilterContainer");
    container.innerHTML = ""; // clear existing

    // Create a map of unique types → icon
    const uniqueTypes = {};
    allEvents.forEach(event => {
        if (event.typeFull && !uniqueTypes[event.typeFull]) {
            uniqueTypes[event.typeFull] = event.icon; // store icon per type
        }
    });

    Object.keys(uniqueTypes).forEach(type => {
        const img = document.createElement("img");
        img.src = `https://my.raceresult.com/RREvents/eventtypes/${uniqueTypes[type]}.png`;
        img.alt = type;
        img.title = type;
        img.className = "EventTypeIcon"; // you can style this via CSS
        img.style.cursor = "pointer";

        img.addEventListener("click", () => {
            const searchContainer = document.getElementById("searchResultsContainer");
            const fullCalendar = document.getElementById("allEventsContainer");

            // Hide full calendar and show search results
            fullCalendar.style.display = "none";
            searchContainer.style.display = "block";
            searchContainer.innerHTML = "";

            // Filter events by this typeFull
            const filtered = allEvents.filter(e => e.typeFull === type);

            if (filtered.length === 0) {
                searchContainer.innerHTML = `<p>No events found for this type.</p>`;
                return;
            }

            // Group by month-year (same as search input)
            const grouped = {};
            filtered.forEach(event => {
                let date;
                if (event.start.includes(".")) {
                    const [day, month, year] = event.start.split(".");
                    date = new Date(`${year}-${month}-${day}T00:00:00`);
                } else if (event.start.includes("-")) {
                    date = new Date(event.start + "T00:00:00");
                } else return;

                const m = date.getMonth() + 1;
                const y = date.getFullYear();
                const key = `${m}-${y}`;

                if (!grouped[key]) grouped[key] = [];
                grouped[key].push(event);
            });

            const sortedKeys = Object.keys(grouped).sort((a, b) => {
                const [mA, yA] = a.split("-").map(Number);
                const [mB, yB] = b.split("-").map(Number);
                return yB - yA || mB - mA;
            });

            // Render grouped events
            sortedKeys.forEach(key => {
                const [m, y] = key.split("-").map(Number);
                const title = document.createElement("h2");
                title.textContent = formatMonthYear(m, y);
                searchContainer.appendChild(title);

                const monthDiv = document.createElement("div");
                monthDiv.className = "EventCardsContainer";
                renderEventCards(grouped[key], monthDiv);
                searchContainer.appendChild(monthDiv);
            });
        });

        container.appendChild(img);
    });
}
