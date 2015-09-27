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
  var source   = EADVideos.videos[sourceId].api;
  var start    = parseInt($element.data('hook-start'));
  var end      = parseInt($element.data('hook-end'));
  var visible  = false;

  // Default end time.
  if (!end) end = start + 10;

  /*
   * Register listeners.
   */

  $element.on('click', activateHook);
  source.on('ended', hideHook);
  source.on('timeupdate', sourceTimeUpdate);

  /**
   * Show the hook on the screen.
   */
  function showHook() {
    if (!visible) $element.trigger('in.ead');
    visible = true;
  }

  /**
   * Hide the hook from the screen.
   */
  function hideHook() {
    if (visible) $element.trigger('out.ead');
    visible = false;
  }

  /**
   * Active hook.
   */
  function activateHook() {
    goTo(sourceId);
  }

  /**
   * Listen for time updates in the source.
   */
  function sourceTimeUpdate(e) {
    var currentTime = source.currentTime();
    currentTime >= start && currentTime <= end ? showHook() : hideHook();
  }
}
