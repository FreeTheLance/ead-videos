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
    var $element  = $(this);
    var sourceId  = $element.data('video-source');
    var source    = EADVideos.videos[sourceId];
    var targetId  = (this.hash || '').substr(1);
    var target    = EADVideos.videos[targetId].api;
    var start     = parseInt($element.data('hook-start'));
    var end       = parseInt($element.data('hook-end'));
    var visible   = false;

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
    if ((id = (location.hash || '').substr(1)) && EADVideos.ids.indexOf(id) > -1) {
      EADVideos.goTo(id);
    } else {
      EADVideos.finish();
    }
  }

})();
