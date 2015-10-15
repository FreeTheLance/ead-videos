/**
 * Initialize hook system.
 */

;(function () {

  var hash;

  /*
   * Register listeners.
   */

  $('.hook').each(initializeHooks);
  $(window).on('hashchange', hashChange);

  /**
   * Configure hooks.
   */
  function initializeHooks() {
    var $element   = $(this);
    var sourceId   = $element.data('video-source');
    var source     = EADVideos.videos[sourceId];
    var targetInfo = EADVideos.parseHash(this.hash);
    var target     = EADVideos.videos[targetInfo.id].api;
    var start      = parseInt($element.data('hook-start'));
    var end        = parseInt($element.data('hook-end'));
    var visible    = false;

    // Early return in case n source/target is found.
    if (!source || !target) return;

    // Default end time.
    if (!end) end = start + 10;

    /*
     * Register listeners.
     */

    source.$element.on('in.ead', startListeners);
    source.$element.on('out.ead', stopListeners);

    /**
     * Initiate listeners.
     */
    function startListeners() {
      $element.on('click', activateHook);
      source.api.on('ended', hideHook);
      source.api.on('timeupdate', sourceTimeUpdate);
    }

    /**
     * Destroy listeners.
     */
    function stopListeners() {
      $element.off('click', activateHook);
      source.api.off('ended', hideHook);
      source.api.off('timeupdate', sourceTimeUpdate);
    }

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
      if (this.href == window.location.href) {
        $(window).trigger('hashchange');
      }

      hideHook();
    }

    /**
     * Listen for time updates in the source.
     */
    function sourceTimeUpdate(e) {
      var currentTime = source.api.currentTime();
      currentTime >= start && currentTime <= end ? showHook() : hideHook();
    }
  }

  /**
   * Change current video.
   */
  function hashChange() {
    var targetInfo = EADVideos.parseHash(location.hash);

    if (targetInfo && EADVideos.ids.indexOf(targetInfo.id) > -1) {
      EADVideos.goTo(targetInfo.id, targetInfo.time);
    } else {
      EADVideos.finish();
    }
  }

})();
