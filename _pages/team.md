---
permalink: /team/
layout: single
sidebar:
  nav: navtools
author_profile: false
header:
  image: /assets/images/header/team.jpg
---


<h1>Meet the Team</h1>

<div id="team-container" class="team-grid"></div>


<script src='{{ "/assets/js/RRevents_rrst.js" | relative_url }}'></script>
<script type="text/javascript" src='{{ "/assets/js/team_rrst.js" | relative_url}}'></script>

<script type="text/javascript">

  let localEvents; // declare in outer scope

  (async () => {
    await loadExcludedEventIds(); // Always load this here is it used in other functions
    localEvents = await loadCustomEvents();
  })();

  loadTeam().then(renderTeam);

</script>
