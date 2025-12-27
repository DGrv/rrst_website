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

    // Create cluster group
const markers = L.markerClusterGroup();

    events.forEach(event => {
        if (!event.lat || !event.lon) return;

        const lat = parseFloat(event.lat);
        const lon = parseFloat(event.lon);
        if (isNaN(lat) || isNaN(lon)) return;

        hasMarkers = true;

        // const marker = L.marker([lat, lon]).addTo(map);
        const MAIN_COLOR = '#c41011';

        const marker = L.circleMarker([lat, lon], {
            radius: 7,
            color: MAIN_COLOR,
            fillColor: MAIN_COLOR,
            fillOpacity: 0.85
        }).addTo(map);


        marker.bindPopup(`
        <img class="logo" src="${base}/assets/images/logo/events/logo_${event.id}.png" alt="" onerror="if (!this.dataset.tried) { this.src='https://my.raceresult.com/${event.id}/logo'; this.dataset.tried='true'; } else { this.style.display='none'; }" style="height: 40px;"><br>
        <strong>${event.name}</strong><br>
        ${event.city ? event.city + "<br>" : ""}
        ${event.start}<br>
        <a href="https://my.raceresult.com/${event.id}" target="_blank">
            View event →
        </a>
        `);
        markers.addLayer(marker);
        bounds.extend([lat, lon]);
    });

    markers.addTo(map);

    // Fit map to markers
    if (hasMarkers) {
        map.fitBounds(bounds, { padding: [40, 40] });
    } else {
        // fallback center (Europe)
        map.setView([48.0, 10.0], 4);
    }

    return map;
}
