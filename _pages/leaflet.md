---
permalink: /leaflet/
layout: single
sidebar:
  nav: navtools
author_profile: false
---

<h1>Kommenden Veranstaltungen</h1>

<div id="eventsMap" style="width: 100%; height: 700px; margin: 10px 0;"></div>

<link  rel="stylesheet"  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css" />
<script src="https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js"></script>


<script src='{{ "/assets/js/RRevents_rrst.js" | relative_url }}'></script>
<script src='{{ "/assets/js/leaflet.js" | relative_url }}'></script>


<script type="text/javascript">
(async () => {

  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to midnight

    await loadExcludedEventIds(); // Always load this here is it used in other functions


  const actualYear = new Date().getFullYear();
  const actualEvents = await loadServerEvents(actualYear, actualYear + 1);

  const futureEvents = actualEvents.filter(e => {
    const d = new Date(e.start);
    return !isNaN(d) && d >= today;
  });

  renderEventsMap(futureEvents);

})();
</script>
