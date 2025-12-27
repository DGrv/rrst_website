---
---

// ---
// ---
// Keep this from the yml to be sure that liquid is used
// it will transform : {{ "/assets/data/services.tsv" | relative_url }}


// --------------------
// Create Leaflet map for events
// --------------------
function renderEventsMap(events) {
    const mapContainer = document.getElementById("eventsMap");
    if (!mapContainer) return;

    // Initialize map
    const map = L.map("eventsMap", {
        scrollWheelZoom: true
    });

    // Nice clean tiles (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const bounds = L.latLngBounds();
    let hasMarkers = false;

    events.forEach(event => {
        if (!event.lat || !event.lon) return;

        const lat = parseFloat(event.lat);
        const lon = parseFloat(event.lon);
        if (isNaN(lat) || isNaN(lon)) return;

        hasMarkers = true;

        const marker = L.marker([lat, lon]).addTo(map);

        marker.bindPopup(`
            <strong>${event.name}</strong><br>
            ${event.city ? event.city + "<br>" : ""}
            ${event.start}<br>
            <a href="https://my.raceresult.com/${event.id}" target="_blank">
                View event →
            </a>
        `);

        bounds.extend([lat, lon]);
    });

    // Fit map to markers
    if (hasMarkers) {
        map.fitBounds(bounds, { padding: [40, 40] });
    } else {
        // fallback center (Europe)
        map.setView([48.0, 10.0], 4);
    }

    return map;
}
