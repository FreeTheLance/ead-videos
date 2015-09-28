/**
 * Setup initial listeners.
 */

(function () {

  var video;

  // Empty hash for Gods sake!
  if (location.hash) {
    location.hash = '';
  }

  $(document).on('keydown', function (e) {
    if (e.keyCode == 32) toggleCurrentVideoState();
  });

  $('video').on('click', toggleCurrentVideoState);

  function toggleCurrentVideoState() {
    if (video = EADVideos.current && EADVideos.current.api) {
      video[video.paused() ? 'play' : 'pause']();
    }
  }
})();
