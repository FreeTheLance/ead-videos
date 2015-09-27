/**
 * Initialize UI handlers.
 */

var $body = $('body');
var $videos = $('video');

$videos.on('in.ead out.ead', stateToggle);

/**
 * Active state toggler listener.
 */
function stateToggle(e) {
  var $video = $(this);
  var $state = $video.closest('[data-state-name]');
  var state = $state.data('state-name');

  // Set body state.
  if (state) $body.attr('data-state-name', state);

  // Toggle element class state.
  $video.toggleClass('active', e.type == 'in');
}
