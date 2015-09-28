/**
 * Setup initial listeners.
 */

(function () {

  var $body = $('body');
  var video;

  // Empty hash for Gods sake!
  if (location.hash) {
    location.hash = '';
  }

  $(document).on('keydown', function (e) {
    if (e.keyCode == 32) toggleCurrentVideoState();
  });

  $('video').on('click', toggleCurrentVideoState);
  $('video').on('pause play out.ead', videoStateChange);

  function toggleCurrentVideoState() {
    if (video = EADVideos.current && EADVideos.current.api) {
      video[video.paused() ? 'play' : 'pause']();
    }
  }

  function videoStateChange(e) {
    // Cleanup.
    $body
      .removeClass('playing')
      .removeClass('paused');

    if (e.type == 'pause') $body.addClass('paused');
    if (e.type == 'play') $body.addClass('playing');
  }
})();
