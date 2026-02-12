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



  /* LED Details Popup Link Styling */
  .led-details-link {
   display: block;          /* Changed from inline-block */
   margin: 10px auto;       /* Changed from margin-left: 8px */
   padding: 4px 12px;
   background-color: #C41011;
   color: white !important;
   text-decoration: none;
   border-radius: 4px;
   font-size: 0.9em;
   font-weight: bold;
   transition: background-color 0.2s ease, transform 0.1s ease;
   max-width: 150px;        /* Added: prevents button from being too wide */
   text-align: center;      /* Added: centers text in button */
 }


    .led-details-link:hover {
      background-color: #a81815;
      transform: translateY(-1px);
      color: white !important;
    }

    .led-details-link:visited {
      color: white !important;
    }

    /* LED Details Popup Content Styling */
    .led-details-popup-content {
      background: white;
      padding: 0;
      max-width: 700px;
      max-height: 85vh;
      margin: 20px auto;
      border-radius: 8px;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .led-details-inner {
      padding: 30px 40px;
      color: #3b3b3b;
    }

    .led-details-inner h2 {
      color: #C41011;
      font-size: 1.5em;
      margin-top: 0;
      margin-bottom: 20px;
      border-bottom: 2px solid #C41011;
      padding-bottom: 10px;
    }

    .led-details-inner h3 {
      color: #C41011;
      font-size: 1.1em;
      margin-top: 30px;
      margin-bottom: 15px;
    }

    .led-details-inner h4 {
      color: #3b3b3b;
      font-size: 1em;
      margin-top: 20px;
      margin-bottom: 10px;
      font-weight: bold;
    }

    .led-details-inner p {
      color: #3b3b3b;
      line-height: 1.7;
      margin-bottom: 15px;
      font-size: 0.8em;
    }

    .led-details-inner ul {
      margin: 15px 0;
      padding-left: 25px;
    }

    .led-details-inner li {
      color: #3b3b3b;
      margin-bottom: 8px;
      line-height: 1.6;
      font-size: 0.8em;
    }

    /* Responsive styling for mobile */
    @media (max-width: 768px) {
      .led-details-popup-content {
        max-width: 95%;
        max-height: 90vh;
        margin: 10px auto;
      }

      .led-details-inner {
        padding: 20px 20px;
      }

      .led-details-inner h2 {
        font-size: 1.1em;
      }

      .led-details-inner h3 {
        font-size: 0.9em;
      }

      .led-details-link {
        display: block;
        margin-left: 0;
        margin-top: 10px;
        text-align: center;
      }
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

LED panels use high-frequency refresh. When photographed with certain camera settings, banding or moiré can appear due to synchronization between camera shutter and LED refresh. This does not indicate a defect. Using 60fps (or 120 fps) and 1/60 (or 1/120) shutter eliminates it in most cases.
<a href="#led-details-popup" class="led-details-link">More Details</a>

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
