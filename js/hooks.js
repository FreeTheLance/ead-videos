/**
 * Initialize hook system.
 */

/*
 * Register listeners.
 */

$('.hook').each(initializeHooks);

/**
 * Configure hooks.
 */
function initializeHooks() {
  var $element = $(this);
  var sourceId = $element.data('video-source');
  var time     = $element.data('video-time');
  var source   = EADVideos.videos[sourceId].api;

  // Listen to video time event.
  source.cue(time, function () {
    $element.addClass('active');
  });

  // Register hook click events.
  $element.on('click', function () {
    goTo(sourceId);
  });
}
