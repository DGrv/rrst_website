---
permalink: /services/led/
layout: single
sidebar:
  nav: navtools
author_profile: false
header:
  image: "/assets/images/header/led.jpg"
---


<h1>Beispielen von LED Balken Design</h1>

Designed and used by us with the help of dbnetsoft softwares: [ScreenPro](https://www.dbnetsoft.com/turnkeysoftware/screens/) and [RaceResultExchange](https://www.dbnetsoft.com/turnkeysoftware/raceresultexchange/).





![dbnetsoft logo]({{ "/assets/images/logo/dbnetsoft_logo.png" | relative_url }})

<br>
<br>
<br>
<br>

<style>
  #led {
    display: block;
    margin: 0 auto; /* centers horizontally */
    max-width:1000px;
    max-height:100px;
    width: auto;
    height: auto;
  }
</style>

{% assign images = site.static_files
   | where_exp: "f", "f.path contains '/assets/images/services/led/'"
   | sort: "name" %}

<div class="image-grid">
  {% for img in images %}
    <img id="led" src="{{ img.path | relative_url }}" alt="">
    <br>
  {% endfor %}
</div>
