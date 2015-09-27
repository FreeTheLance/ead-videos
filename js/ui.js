/**
 * Initialize UI handlers.
 */

var $body = $('body');
var $videos = $('video');
var $hooks = $('.hook');

$videos.on('in.ead out.ead', videoStateToggle);
$hooks.on('in.ead out.ead', hookStateToggle);

/**
 * Active video state toggler listener.
 */
function videoStateToggle(e) {
  var $video = $(this);
  var $state = $video.closest('[data-state-name]');
  var state = $state.data('state-name');

  // Set body state.
  if (state) $body.attr('data-state-name', state);

  // Toggle element class state.
  $video.toggleClass('active', e.type == 'in');
}

/**
 * Active hook state toggler listener.
 */
function hookStateToggle(e) {
   $(this).toggleClass('active', e.type == 'in');
}
