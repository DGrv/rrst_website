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



function renderEvents(events, container) {
    // Clear container and add header row
    container.innerHTML = `
        <div>
            <div></div>
            <div></div>
            <div>City</div>
            <div>Event</div>
            <div>Date</div>
        </div>
    `;

    events.forEach(event => {
        const row = document.createElement("div");
        row.className = "EventRow";

        row.innerHTML = `
            <div><img src="${"https://my.raceresult.com/RREvents/eventtypes/" + event[1] + ".png"|| ''}" alt=""></div>
            <div><img src="${"https://my.raceresult.com/graphics/flags/" + event[6] + ".gif"|| ''}" alt=""></div>
            <div>${event[5]}</div>
            <div>${event[2]}</div>
            <div>${event[3]}</div>
        `;
        // 0	ID
        // 1	icon
        // 2	Name
        // 3	Start
        // 4	End
        // 5	City
        // 6	CountryCode
        // 7	lat
        // 8	lon
        // 9	Country
        // 10	TypeFull
        // 11	?

        container.appendChild(row);
    });
}


async function loadMyEvents(year, month) {
    const container = document.getElementById("tEventTable");
    const mapContainer = null; // or your Google Map instance

    try {
        const events = await fetchEvents({
            server: "https://my.raceresult.com",
            user: 846,
            year: year,   // use the parameter
            month: month  // use the parameter
        });

        renderEvents(events, container);

        if (mapContainer) renderEventsOnMap(events, mapContainer);

    } catch (err) {
        console.error(err);
        container.innerHTML = `<div class="Error">Failed to load events</div>`;
    }
}


