


const assetsPath = "/rrst_website/assets"



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
                    <img class="logo" src="${assetsPath}/images/logo/events/logo_${event.id}.png" alt="" onerror="if (!this.dataset.tried) { this.src='https://my.raceresult.com/${event.id}/logo'; this.dataset.tried='true'; } else { this.style.display='none'; }">
                </div>

                <!-- Right column: Event information -->
                <div class="EventCardContent">
                    <div class="EventCardHeader">
                    ${event.countryCode ? `<img class="flag" src="${assetsPath}/images/flags/${event.countryCode}_black.png" alt="">` : ''}
                    <div class="EventCardDate">${event.start}</div>
                    <img class="icon" src="${assetsPath}/images/logo/eventtypes/${event.icon}.png" alt="">
                    </div>
                    <div class="EventCardName">${event.name}</div>
                    <div class="EventCardCity">${event.city}</div>
                    </div>
                    </div>
                    `;
                    // <img class="icon" src="https://my.raceresult.com/RREvents/eventtypes/${event.icon}.png" alt="">
                    //${event.countryCode ? `<img class="flag" src="https://my.raceresult.com/graphics/flags/${event.countryCode}.gif" alt="">` : ''}
                    
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
let allEvents = []; // global for search

async function loadAllEventCards(startYear, endYear) {
    const container = document.getElementById("allEventsContainer");
    container.innerHTML = "";
    allEvents = [];

    // load server + custom
    const serverEvents = await loadServerEvents(startYear, endYear);
    const customEvents = await loadCustomEvents();

    allEvents.push(...serverEvents, ...customEvents);

    // Remove duplicates
    allEvents = allEvents.filter((event, index, self) =>
        index === self.findIndex(e => e.id === event.id)
    );

    // now render
    renderEventsByMonth(allEvents, container);

    setupEventSearch(allEvents);
}




async function loadServerEvents(startYear, endYear) {
    const temp = [];
    const today = new Date();

    for (let year = endYear; year >= startYear; year--) {

        try {
            const events = await fetchEvents({
                server: "https://my.raceresult.com",
                user: 846,
                year
            });

            temp.push(...events);

        } catch (e) {
            console.warn("Failed server events", month, year);
        }
    }

    return temp;
}


// --------------------
// Load local json
// --------------------

async function loadCustomEvents() {
    const folder = '/rrst_website/assets/data/events/';

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

    const temp = [];

    for (const file of files) {
        try {
            const resp = await fetch(folder + file);
            if (!resp.ok) continue;

            const data = await resp.json();

            // Map array to objects with named keys for clarity
            const data2 = data.map(e => ({
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

            temp.push(...data2);

        } catch (err) {
            console.error("Failed custom JSON:", file);
        }
    }

    return temp;
}



function renderEventsByMonth(events, container) {

    if (events.length === 0) return;

    // extract all dates
    events.forEach(e => {
        const d = new Date(e.start);
        if (isNaN(d)) {
            console.warn("Invalid date detected:", e);
            console.warn("Start value:", e.start);
        }
    });
    const dates = events.map(e => new Date(e.start));

    // compute min + max year
    const minYear = Math.min(...dates.map(d => d.getFullYear()));
    const maxYear = Math.max(...dates.map(d => d.getFullYear()));

    const today = new Date();

    for (let year = maxYear; year >= minYear; year--) {
        for (let month = 12; month >= 1; month--) {

            // skip future
            if (year === today.getFullYear() && month > today.getMonth() + 1) continue;

            // filter events belonging to this month/year
            const monthEvents = events.filter(ev => {
                const d = new Date(ev.start);
                return d.getFullYear() === year && d.getMonth() + 1 === month;
            });

            if (monthEvents.length === 0) continue; // skip empty month

            // create title and container
            const title = document.createElement("h2");
            title.textContent = formatMonthYear(month, year);
            title.style.marginTop = "32px";
            container.appendChild(title);

            const monthContainer = document.createElement("div");
            monthContainer.className = "EventCardsContainer";
            container.appendChild(monthContainer);

            renderEventCards(monthEvents, monthContainer);
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
        img.src = `${assetsPath}/images/logo/eventtypes/${uniqueTypes[type]}.png`;
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




// --------------------
// Render year filter buttons
// --------------------
function renderYearFilters(allEvents) {
    const container = document.getElementById("eventYearFilterContainer");
    container.innerHTML = ""; // clear existing

    // Extract unique years
    const uniqueYears = [...new Set(allEvents.map(e => {
        const d = new Date(e.start);
        return !isNaN(d) ? d.getFullYear() : null;
    }).filter(y => y !== null))];

    // Sort descending
    uniqueYears.sort((a, b) => b - a);

    // Create button for each year
    uniqueYears.forEach(year => {
        const btn = document.createElement("button");
        btn.textContent = year;
        btn.className = "year-filter-btn";

        btn.addEventListener("click", () => {
            const searchContainer = document.getElementById("searchResultsContainer");
            const fullCalendar = document.getElementById("allEventsContainer");

            // Hide full calendar
            fullCalendar.style.display = "none";
            searchContainer.style.display = "block";
            searchContainer.innerHTML = "";

            // Filter allEvents by selected year
            const filtered = allEvents.filter(e => {
                const d = new Date(e.start);
                return !isNaN(d) && d.getFullYear() === year;
            });

            if (filtered.length === 0) {
                searchContainer.innerHTML = `<p>No events found for ${year}.</p>`;
                return;
            }

            // Use your existing renderEventsByMonth logic
            renderEventsByMonth(filtered, searchContainer);
        });

        container.appendChild(btn);
    });
}
