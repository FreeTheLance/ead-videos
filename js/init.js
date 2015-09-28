/**
 * Setup initial listeners.
 */

// Empty hash for Gods sake!
if (location.hash) {
  location.hash = '';
}

$(document).on('keydown', function (e) {
  if (e.keyCode == 32 && EADVideos.current) {
    var api = EADVideos.current.api;
    api[api.paused() ? 'play' : 'pause']();
  }
});
