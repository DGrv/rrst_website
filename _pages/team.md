---
permalink: /team/
layout: single
sidebar:
  nav: navtools
author_profile: false
---

<style>

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.team-card {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.team-card img {
  width: 200px;
  height: 200px;
  border-radius: 100%;
  object-fit: cover;
  margin-bottom: 15px;
}
</style>

<h1>Meet the Team</h1>

<div id="team-container" class="team-grid"></div>



<script type="text/javascript" src='{{ "/assets/js/team_rrst_v01.js" | relative_url}}'></script>

<script type="text/javascript">
loadTeam().then(renderTeam);
</script>
