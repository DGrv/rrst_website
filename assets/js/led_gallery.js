 // LED Gallery Video Popup Initialization
  $(document).ready(function() {
    if ($('.video-popup-link').length > 0) {
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
    }
  });