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
    container.innerHTML = ""; // clear previous content

    events.forEach(event => {
        const card = document.createElement("div");
        card.className = "EventCard";

        card.innerHTML = `
            <div class="EventCardHeader">
                <img class="icon" src="https://my.raceresult.com/RREvents/eventtypes/${event[1]}.png" alt="">
                ${event[10] ? `<span>${event[10]}</span>` : ''}
            </div>
            <div class="EventCardCity">
                ${event[5]} 
                ${event[6] ? `<img class="flag" src="https://my.raceresult.com/graphics/flags/${event[6]}.gif" alt="">` : ''}
            </div>
            <div class="EventCardName">${event[2]}</div>
            <div class="EventCardDate">${event[3]}</div>
        `;

        container.appendChild(card);
    });
}

async function loadMyEventCards(year, month) {
    const container = document.getElementById("tEventCards");

    try {
        const events = await fetchEvents({
            server: "https://my.raceresult.com",
            user: 846,
            year,
            month
        });

        renderEventCards(events, container);

    } catch (err) {
        console.error(err);
        container.innerHTML = `<div class="Error">Failed to load events</div>`;
    }
}
