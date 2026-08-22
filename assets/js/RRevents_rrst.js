---
---

// ---
// ---
// Keep this from the yml to be sure that liquid is used
// it will transform : {{ "/assets/data/services.tsv" | relative_url }}

const base = "{{ site.baseurl }}";    // example: "/rrst_website" or ""

// --------------------
// Fetch events from RaceResult API
// --------------------
async function fetchEvents({ server, user, year, limit = 500 }) {
    const params = new URLSearchParams({ user, year, limit });
    const url = `${server}/RREvents/list?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);

    const data = await res.json(); // RaceResult returns array of group objects

    // The API caps the number of returned events; `limit` raises that cap.
    // If a group still reports HasMore, events are being silently dropped.
    if (Array.isArray(data) && data.some(group => group?.HasMore)) {
        console.warn(`fetchEvents: server still reports HasMore for year ${year} (limit=${limit}) — some events may be missing.`);
    }

    return extractEvents(data).map(mapEvent).filter(Boolean);
}


// --------------------
// Pull the event rows out of a RaceResult payload.
// The endpoint (and therefore the saved archives in assets/data/events/) wraps
// events in group objects: [{ Mode, Label, HasMore, Events: [...] }]. Older
// archives were saved as a bare flat array instead, so both are accepted.
// --------------------
function extractEvents(data) {
    if (!Array.isArray(data)) return [];

    if (data.length && data[0] && Array.isArray(data[0].Events)) {
        return data.flatMap(group => group.Events || []);
    }

    return data; // already a flat list of events
}


// --------------------
// Normalize a raw RaceResult event into our internal shape.
// Accepts both the current object format and the legacy positional-array
// format used by the oldest local JSON archives.
// --------------------
function mapEvent(e) {
    if (Array.isArray(e)) {
        if (e.length < 4) return null;
        return {
            id: e[0],          // event ID
            icon: e[1],        // icon type
            name: e[2],        // event name
            start: e[3],       // start date
            end: e[4],         // end date
            city: e[5],        // city
            countryCode: e[6]?.toLowerCase() || '', // safe country code
            lat: e[7],         // latitude
            lon: e[8],         // longitude
            country: e[9],     // country full name
            typeFull: e[10],   // type description
            extra: e[11],      // optional additional data
            year: e[3]?.split('-')[0] || '' // safe year extraction
        };
    }

    if (!e || typeof e !== 'object' || !e.dateFrom) return null;

    return {
        id: e.id,                    // event ID
        icon: e.eventType,           // numeric icon type
        name: e.name,                // event name
        start: e.dateFrom,           // start date (YYYY-MM-DD)
        end: e.dateTo,               // end date
        city: e.location,            // city
        countryCode: e.countryCode?.toLowerCase() || '', // safe country code
        lat: e.lat,                  // latitude
        lon: e.lng,                  // longitude
        country: e.countryName,      // country full name
        typeFull: e.eventTypeName,   // type description
        extra: e.distances,          // optional additional data
        year: e.dateFrom.split('-')[0] // safe year extraction
    };
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
            <div class="EventCardHeader">
                <div class="EventCardLogo">
                    <img class="logo" src="${base}/assets/images/logo/events/logo_${event.year}_${event.id}.png" alt="" onerror="if (!this.dataset.tried) { this.src='https://my.raceresult.com/${event.id}/logo'; this.dataset.tried='true'; } else { this.style.display='none'; }">
                </div>
                ${event.countryCode ? `<img class="flag" src="${base}/assets/images/flags/${event.countryCode}_black.png" alt="">` : ''}
                <div class="EventCardName">${event.name}</div>
                <div class="EventCardDate">${event.start}</div>
                <div class="EventCardCity">${event.city}</div>
                <img class="icon" src="${base}/assets/images/logo/eventtypes/${event.icon}.png" title="${event.id}" alt="">
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
    if (typeof str !== 'string') return '';
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
let excludedIds = []; // global for search


async function loadExcludedEventIds() {
    try {
        const res = await fetch(`${base}/exclude_events.txt`, { cache: "no-store" });
        if (!res.ok) throw new Error("exclude_events.txt not found");

        const text = await res.text();

        const temp = new Set(
            text
                .split("\n")
                .map(line => line.trim())
                .filter(Boolean)
        );
        excludedIds.push(...temp)

    } catch (err) {
        console.warn("No exclude_events.txt loaded", err);
        return new Set(); // fail-safe
    }
}


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


    // Render the current and previous year by default. The full archive going
    // back to 2005 is ~1500 cards, which is a lot to put on first paint; the
    // year filter buttons and the search box still cover every loaded year.
    const thisYear = new Date().getFullYear();
    const defaultEvents = allEvents.filter(e => {
        const d = new Date(e.start);
        if (isNaN(d)) return false;
        const y = d.getFullYear();
        return y === thisYear || y === thisYear - 1;
    });
    renderEventsByMonth(defaultEvents, container);

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
                year: year
            });

            temp.push(...events);

        } catch (e) {
            console.error("Failed server events", year, e); // Change warn to error
            console.error("Error message:", e.message); // Add this
            console.error("Stack trace:", e.stack); // Add this
        }
    }

    const temp2 = temp.filter(e => !excludedIds.includes(String(e.id)));

    return temp2;
}


// --------------------
// Load local json
// --------------------

async function loadCustomEvents() {
    const folder = `${base}/assets/data/events/`;

    // Built from whatever is actually in assets/data/events/ at build time, so
    // dropping in a new events_<year>.json is enough — no list to update here.
    const files = [
        {%- assign archives = site.static_files
             | where_exp: "f", "f.path contains '/assets/data/events/'"
             | where_exp: "f", "f.extname == '.json'"
             | sort: "name" | reverse -%}
        {%- for f in archives %}
        "{{ f.name }}",
        {%- endfor %}
    ];

    const temp = [];

    for (const file of files) {
        try {
            const resp = await fetch(folder + file);
            if (!resp.ok) continue;

            const data = await resp.json();

            // Archives are saved verbatim from the API, so they carry the same
            // group envelope the live endpoint returns — unwrap it the same way.
            const rows = extractEvents(data);
            if (!rows.length) console.warn("No events extracted from", file);

            temp.push(...rows.map(mapEvent).filter(Boolean));

        } catch (err) {
            console.error("Failed custom JSON:", file, err);
        }
    }

    const temp2 = temp.filter(e => !excludedIds.includes(String(e.id)));

    return temp2;
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
    const dates = events.map(e => new Date(e.start)).filter(d => !isNaN(d));

    if (dates.length === 0) return;

    // compute min + max year
    const minYear = Math.min(...dates.map(d => d.getFullYear()));
    const maxYear = Math.max(...dates.map(d => d.getFullYear()));

    for (let year = maxYear; year >= minYear; year--) {
        for (let month = 12; month >= 1; month--) {

            // filter events belonging to this month/year
            const monthEvents = events.filter(ev => {
                const d = new Date(ev.start);
                return d.getFullYear() === year && d.getMonth() + 1 === month;
            });

            if (monthEvents.length === 0) continue; // skip empty month

            monthEvents.sort((a, b) => new Date(a.start) - new Date(b.start));

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

    function makeTypeIcon(type) {
        const img = document.createElement("img");
        img.src = `${base}/assets/images/logo/eventtypes/${uniqueTypes[type]}.png`;
        img.alt = type;
        img.title = type;
        img.className = "EventTypeIcon";
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

        return img;
    }

    const allTypes = Object.keys(uniqueTypes);
    const recentTypes = allTypes.slice(0, 3);
    const olderTypes = allTypes.slice(3);

    recentTypes.forEach(type => container.appendChild(makeTypeIcon(type)));

    if (olderTypes.length > 0) {
        const extraDiv = document.createElement("div");
        extraDiv.className = "year-filter-extra";
        olderTypes.forEach(type => extraDiv.appendChild(makeTypeIcon(type)));

        const moreBtn = document.createElement("button");
        moreBtn.textContent = "··· More";
        moreBtn.className = "year-filter-more-btn";
        moreBtn.addEventListener("click", () => {
            const isOpen = extraDiv.classList.toggle("open");
            moreBtn.textContent = isOpen ? "▲ Less" : "··· More";
        });

        container.appendChild(moreBtn);
        container.appendChild(extraDiv);
    }

    if (allTypes.length > 0) {
        container.closest(".filter-row").style.display = "flex";
    }
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

    // Split into recent (first 3) and older years
    const recentYears = uniqueYears.slice(0, 3);
    const olderYears = uniqueYears.slice(3);

    function makeYearBtn(year) {
        const btn = document.createElement("button");
        btn.textContent = year;
        btn.className = "year-filter-btn";
        btn.addEventListener("click", () => {
            const searchContainer = document.getElementById("searchResultsContainer");
            const fullCalendar = document.getElementById("allEventsContainer");
            fullCalendar.style.display = "none";
            searchContainer.style.display = "block";
            searchContainer.innerHTML = "";
            const filtered = allEvents.filter(e => {
                const d = new Date(e.start);
                return !isNaN(d) && d.getFullYear() === year;
            });
            if (filtered.length === 0) {
                searchContainer.innerHTML = `<p>No events found for ${year}.</p>`;
                return;
            }
            renderEventsByMonth(filtered, searchContainer);
        });
        return btn;
    }

    // Render the 3 most recent year buttons
    recentYears.forEach(year => container.appendChild(makeYearBtn(year)));

    if (olderYears.length > 0) {
        // Hidden container for older years
        const extraDiv = document.createElement("div");
        extraDiv.className = "year-filter-extra";
        olderYears.forEach(year => extraDiv.appendChild(makeYearBtn(year)));

        // Toggle button
        const moreBtn = document.createElement("button");
        moreBtn.textContent = "··· More";
        moreBtn.className = "year-filter-more-btn";
        moreBtn.addEventListener("click", () => {
            const isOpen = extraDiv.classList.toggle("open");
            moreBtn.textContent = isOpen ? "▲ Less" : "··· More";
        });

        container.appendChild(moreBtn);
        container.appendChild(extraDiv);
    }
}
