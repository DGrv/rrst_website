---
permalink: /services/led/
layout: single
sidebar:
  nav: navtools
author_profile: false
header:
  image: "/assets/images/header/led.jpg"
---

<style>
  #led {
    display: block;
    margin: 0 auto; /* centers horizontally */
    max-width:1000px;
    max-height:100px;
    width: auto;
    height: auto;
  }








  /* Horizontal scrollable gallery container */
  .led-gallery-container {
    margin: 30px 0;
    width: 100%;
    overflow: hidden;
  }

  .led-gallery {
    display: flex;
    gap: 15px;
    overflow-x: auto;
    padding: 10px 0;
    scroll-behavior: smooth;
  }

  /* Scrollbar styling */
  .led-gallery::-webkit-scrollbar {
    height: 8px;
  }

  .led-gallery::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  .led-gallery::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  .led-gallery::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* Gallery image styling */
  .led-gallery a {
    flex-shrink: 0;
    cursor: pointer;
    transition: transform 0.2s ease;
    position: relative;
  }

  .led-gallery a:hover {
    transform: scale(1.05);
  }

  .led-gallery img {
    height: 150px;
    width: auto;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  /* Video thumbnail styling */
  .video-thumbnail {
    position: relative;
    height: 150px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  .video-thumbnail video {
    height: 150px;
    width: auto;
    object-fit: cover;
    display: block;
  }

  /* Play button overlay */
  .play-button-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    pointer-events: none;
  }

  .play-icon {
    font-size: 48px;
    color: white;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 5px; /* Offset for play triangle */
  }

  .video-popup-link:hover .play-button-overlay {
    background: rgba(0, 0, 0, 0.5);
  }

 /* Hidden video popup content */
  .video-popup-content {
    background: #000;
    padding: 0;
    max-width: 800px;
    max-height: 80vh;
    margin: 20px auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .video-popup-content video {
    width: 100%;
    max-width: 800px;
    max-height: 70vh;
    height: auto;
    display: block;
    object-fit: contain;
  }
  /* Hide the popup content initially */
  .mfp-hide {
    display: none;
  }

  /* Responsive: smaller on mobile */
  @media (max-width: 768px) {
    .led-gallery img,
    .video-thumbnail,
    .video-thumbnail video {
      height: 100px;
    }

    .play-icon {
      font-size: 32px;
      width: 50px;
      height: 50px;
    }
  }

  /* Existing #led styles */
  #led {
    display: block;
    margin: 0 auto;
    max-width: 1000px;
    max-height: 100px;
    width: auto;
    height: auto;
  }

</style>

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
<h1>Beispielen von LED Balken Design</h1>

Designed and used by us with the help of dbnetsoft softwares: [ScreenPro](https://www.dbnetsoft.com/turnkeysoftware/screens/) and [RaceResultExchange](https://www.dbnetsoft.com/turnkeysoftware/raceresultexchange/).

![dbnetsoft logo]({{ "/assets/images/logo/dbnetsoft_logo.png" | relative_url }})

<br>

{% assign images = site.static_files
   | where_exp: "f", "f.path contains '/assets/images/services/led/design/'"
   | sort: "name" %}

<div class="image-grid">
  {% for img in images %}
    <img id="led" src="{{ img.path | relative_url }}" alt="">
    <br>
  {% endfor %}
</div>

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
  </script>