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

function setupEventSearch(events) {
    const searchInput = document.getElementById("eventSearchInput");
    const allContainer = document.getElementById("allEventsContainer");
    const searchContainer = document.getElementById("searchResultsContainer");

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();

        if (query === "") {
            // Show full calendar again
            searchContainer.style.display = "none";
            allContainer.style.display = "block";
            return;
        }

        const filteredEvents = events.filter(event =>
            event[2].toLowerCase().includes(query) ||   // name
            event[5].toLowerCase().includes(query) ||   // city
            (event[10] && event[10].toLowerCase().includes(query))
        );

        // Show search results container
        allContainer.style.display = "none";
        searchContainer.style.display = "block";

        // Use same layout wrapper for spacing!
        const tempWrapper = document.createElement("div");
        tempWrapper.className = "EventCardsContainer";

        renderEventCards(filteredEvents, tempWrapper);

        searchContainer.innerHTML = "";
        searchContainer.appendChild(tempWrapper);
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

