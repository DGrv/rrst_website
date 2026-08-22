---
permalink: /services/led/
layout: single
sidebar:
  nav: navtools
author_profile: false
header:
  image: "/assets/images/header/led.jpg"
---



<h1>LED Gallery</h1>

  <div class="led-gallery-container">
    <div class="led-gallery">
      {% assign gallery_images = site.static_files
         | where_exp: "f", "f.path contains '/assets/images/services/led/pictures/'"
         | sort: "name" %}
      {% for img in gallery_images %}
        {% assign ext = img.path | downcase %}

        {% if ext contains '.mp4' %}
          <!-- Video thumbnail with play button -->
          <a href="#video-{{ forloop.index }}" class="video-popup-link">
            <div class="video-thumbnail">
              <video preload="metadata">
                <source src="{{ img.path | relative_url }}#t=0.1" type="video/mp4">
              </video>
              <div class="play-button-overlay">
                <span class="play-icon">▶</span>
              </div>
            </div>
          </a>
          <!-- Hidden video popup content -->
          <div id="video-{{ forloop.index }}" class="video-popup-content mfp-hide">
            <video controls autoplay>
              <source src="{{ img.path | relative_url }}" type="video/mp4">
            </video>
          </div>
        {% elsif ext contains '.jpg' or ext contains '.jpeg' or ext contains '.png' or ext contains '.gif' or ext contains '.webp' %}
          <!-- Lightbox for images -->
          <a href="{{ img.path | relative_url }}" class="image-popup">
            <img src="{{ img.path | relative_url }}" alt="LED Design {{ forloop.index }}">
          </a>
        {% endif %}
      {% endfor %}
    </div>

  </div>

<br>
<h3>🔧 Technische Details unseres LED-Bogens:</h3>
<ul>
  <li>Besteht aus zwei Einheiten mit jeweils 8 Panels</li>
  <li>Pro Panel: 📺 Auflösung: <b>128 × 128 Pixel</b>📏 Größe: <b>50 × 50 cm</b></li>
</ul>

<h3>📍 Einsatz & Maße:</h3>

<ul>
  <li>🏁 Standardmäßig an der Start- bzw. Ziellinie positioniert</li>
  <li>↔️ Gesamtbreite: <b>4 Meter</b> (Auflösung: <b>1024 × 128 px</b>)</li>
  <li>🧩 Modularer Aufbau ermöglicht flexible Anpassung</li>
  <li>📐 Reduzierbar auf <b>3 Meter Breite</b>, falls erforderlich</li>
</ul>

<h3>📸 Hinweis zur Darstellung bei Kameraaufnahmen:</h3>

<ul>
  <li>⚡ Die LED-Panels arbeiten mit hoher Bildwiederholfrequenz</li>
  <li>📷 Bei bestimmten Kameraeinstellungen können Streifen (Banding) oder Moiré-Effekte auftreten</li>
  <li>ℹ️ Dies ist kein Defekt, sondern technisch bedingt</li>
  <li>✅ Empfohlene Einstellungen: <b>60 fps</b> mit <b>1/60</b> Verschlusszeit oder <b>120 fps</b> mit <b>1/120</b> Verschlusszeit  </li>
</ul>

<a href="#led-details-popup" class="led-details-link">More Details</a>

<p>
<h3>Was wir von euch brauchen:</h3>
<ul>
  <li>Schriftart (für die Zeitanzeige benötigen wir eine <b>Monospace-Schrift</b>)</li>
  <li>Hauptfarben im Hex-Format (z. B. #869304)</li>
  <li>Sponsorenlogos als <b>PNG</b> (mit transparentem Hintergrund), idealerweise in gleicher oder höherer Auflösung als die LED-Anzeige</li>
  <li><b>GIFs</b> und <b>MP4-Dateien</b> sind möglich; GIFs bitte, wenn möglich, mit transparentem Hintergrund</li>
  <li>Zeitplan / Ablaufplan, was wann angezeigt werden soll</li>
</ul>
</p>

<br>



<!-- Hidden popup content for LED display details -->
  <div id="led-details-popup" class="led-details-popup-content mfp-hide">
    <div class="led-details-inner">

        <h2>LED Display Appearance in Photos and Videos</h2>

        <p>Our LED finish arch panels operate at a <strong>60 Hz frame rate</strong> and a <strong>3840 Hz refresh rate</strong>. This specification is considered a high-quality standard for professional event LED
        systems and ensures stable, flicker-free performance to the human eye under normal viewing conditions.</p>

        <p>However, when photographed or filmed, horizontal bands or wave-like patterns may occasionally appear. These effects are not defects of the LED panel. They are caused by technical interactions between:</p>

        <ul>
          <li>The LED screen's refresh rate (3840 Hz)</li>
          <li>The camera's shutter speed and frame rate</li>
          <li>The pixel grid of the display and the camera sensor</li>
        </ul>

        <h3>Why This Happens</h3>

        <p><strong>1. Flicker Banding</strong><br>
        Cameras capture images line by line. If the camera's shutter speed is not synchronized with the LED refresh cycle, visible light or dark bands may appear in photos or videos. This is a common effect when
        filming or photographing LED screens of any brand.</p>

        <p><strong>2. Moiré Patterns</strong><br>
        When the pixel grid of the LED panel interacts with the pixel grid of the camera sensor—especially at close distances—wave-like or grid interference patterns can occur. This is a normal optical phenomenon
        and does not indicate a quality issue.</p>

        <h3>How to Minimize the Effect</h3>

        <p>For professional photography or videography, the effect can typically be reduced or eliminated by:</p>

        <ul>
          <li>Using manual camera settings</li>
          <li>Setting frame rate to <strong>60 fps or 120 fps</strong></li>
          <li>Using shutter speeds such as <strong>1/60 or 1/120</strong></li>
          <li>Avoiding extreme close-up shots</li>
        </ul>

        <p>Professional photographers covering sporting events are familiar with these adjustments and can easily optimize camera settings accordingly.</p>

        <h3>Important Note</h3>

        <p>Any visible banding or moiré patterns in photos or videos are caused by camera synchronization and optical physics—not by a malfunction or deficiency of the LED display.</p>

        <p>Under normal viewing conditions, our 60 Hz / 3840 Hz LED panels operate reliably and meet professional event display standards.</p>


    </div>
  </div>

<h3>Beispielen von LED Balken Design</h3>

Designed and used by us with the help of dbnetsoft softwares: <a href="https://www.dbnetsoft.com/turnkeysoftware/screens/" target="_blank">ScreenPro</a> and <a haref="https://www.dbnetsoft.com/turnkeysoftware/raceresultexchange/" tagert="_blank">RaceResultExchange</a>.

<img src="{{"/assets/images/logo/dbnetsoft_logo.png" | relative_url }}"/>

<br>
<br>
<br>

{% include image-grid.html folder="/assets/images/services/led/design/" alt="LED design" %}

<script>
  // Wait for document ready AND ensure jQuery is loaded
  (function() {
    function initVideoPopup() {
      if (typeof jQuery === 'undefined') {
        setTimeout(initVideoPopup, 100);
        return;
      }

      jQuery(document).ready(function($) {
        $('.video-popup-link').magnificPopup({
          type: 'inline',
          midClick: true,
          callbacks: {
            open: function() {
              var video = this.content.find('video')[0];
              if (video) video.play();
            },
            close: function() {
              var video = this.content.find('video')[0];
              if (video) {
                video.pause();
                video.currentTime = 0;
              }
            }
          }
        });
      });
    }

    initVideoPopup();
  })();


  // LED Details text popup initialization
   (function() {
     function initDetailsPopup() {
       if (typeof jQuery === 'undefined') {
         setTimeout(initDetailsPopup, 100);
         return;
       }

       jQuery(document).ready(function($) {
         $('.led-details-link').magnificPopup({
           type: 'inline',
           midClick: true,
           fixedContentPos: true,
           fixedBgPos: true,
           overflowY: 'auto',
           closeBtnInside: true,
           preloader: false,
           removalDelay: 300,
           mainClass: 'mfp-fade',
         });
       });
     }

     initDetailsPopup();
   })();


  </script>
