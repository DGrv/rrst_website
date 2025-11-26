async function fetchEvents({ server, user, year, month, country }) {
    const params = new URLSearchParams({
        user,
        year,
        month,
        country
    });

    const url = `${server}/RREvents/list?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
    const data = await res.json(); // RaceResult returns JSON
    return data; // array of events
}



function renderEventCards(events, container) {
    container.innerHTML = "";

    events.forEach(event => {
        const card = document.createElement("div");
        card.className = "EventCard";

        card.innerHTML = `
            <div class="EventCardColumns">
                <!-- Linke Spalte: Logo -->
                <div class="EventCardLogo">
                    <img class="logo" src="https://my.raceresult.com/${event[0]}/logo" alt="" onerror="this.style.display='none';">
                </div>

                <!-- Rechte Spalte: alle anderen Infos -->
                <div class="EventCardContent">
                    <div class="EventCardHeader">
                        ${event[6] ? `<img class="flag" src="https://my.raceresult.com/graphics/flags/${event[6]}.gif" alt="">` : ''}
                        <div class="EventCardDate">${event[3]}</div>
                        <img class="icon" src="https://my.raceresult.com/RREvents/eventtypes/${event[1]}.png" alt="">
                    </div>
                    <div class="EventCardName">${event[2]}</div>
                    <div class="EventCardCity">${event[5]}</div>
                </div>
            </div>
            </div>
        `;

        // Make card clickable
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
            const url = `https://my.raceresult.com/${event[0]}`;
            window.open(url, "_blank"); // open in new tab
        });

        container.appendChild(card);
    });
}



function setupEventSearch(allEvents) {
    const searchInput = document.getElementById("eventSearchInput");
    const searchContainer = document.getElementById("searchResultsContainer");
    const fullCalendar = document.getElementById("allEventsContainer");

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();

        // Reset → show full calendar, hide search
        if (query === "") {
            searchContainer.style.display = "none";
            searchContainer.innerHTML = "";
            fullCalendar.style.display = "block";
            return;
        }

        // When searching
        fullCalendar.style.display = "none";
        searchContainer.style.display = "block";
        searchContainer.innerHTML = "";

        // Filter events
        const filtered = allEvents.filter(e =>
            e[2].toLowerCase().includes(query) ||
            e[5].toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            searchContainer.innerHTML = `<p>No events found.</p>`;
            return;
        }

        // Group by month-year
        const grouped = {};

        filtered.forEach(event => {
            let date;

            if (event[3].includes(".")) {
                // Format: DD.MM.YYYY
                const [day, month, year] = event[3].split(".");
                date = new Date(`${year}-${month}-${day}T00:00:00`);
            } else if (event[3].includes("-")) {
                // Format: YYYY-MM-DD
                date = new Date(event[3] + "T00:00:00");
            } else {
                console.warn("Unknown date format:", event[3]);
                return; // skip event
            }


            const m = date.getMonth() + 1;
            const y = date.getFullYear();
            const key = `${m}-${y}`;

            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(event);
        });

        // Sort groups newest first
        const sortedKeys = Object.keys(grouped).sort((a, b) => {
            const [mA, yA] = a.split("-").map(Number);
            const [mB, yB] = b.split("-").map(Number);
            return yB - yA || mB - mA;
        });

        // Render results
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
}






let allEvents = []; // global

async function loadAllEventCards(startYear, endYear) {
    const container = document.getElementById("allEventsContainer");
    container.innerHTML = "";

    allEvents = []; // reset

    for (let year = endYear; year >= startYear; year--) {
        for (let month = 12; month >= 1; month--) {

            const today = new Date();
            if (year === today.getFullYear() && month > today.getMonth() + 1) continue;

            const monthTitle = document.createElement("h2");
            monthTitle.textContent = formatMonthYear(month, year);
            monthTitle.style.marginTop = "32px";
            container.appendChild(monthTitle);

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

                allEvents.push(...events);  // IMPORTANT: collect for search
                renderEventCards(events, monthContainer);

            } catch (err) {
                console.error(err);
                monthContainer.innerHTML = `<div class="Error">Failed to load events</div>`;
            }
        }
    }

    // AFTER all data is loaded → activate search
    setupEventSearch(allEvents);
}




const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function formatMonthYear(month, year) {
    return `${monthNames[month - 1]} ${year}`;
}

