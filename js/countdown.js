/**
 * Countdown handler.
 */

;(function () {

  var $hooks     = $('.hook');
  var $countdown = $('#countdown-container');
  var element    = $countdown.get(0);
  var countdown  = null;
  var interval   = null;
  var defaults   = {
    duration: 1000,
    color: "#A1DD10",
    trailColor: "#fff",
    strokeWidth: 10,
    trailWidth: 3
  };

  var source, start, end, currentTime, fulfilled, duration, walked, $hook;

  /*
  * Register listeners.
  */

  $hooks.on('in.ead', hookIn);
  $hooks.on('out.ead', hookOut);
  $(window).on('hashchange', hashChange);

  /**
   * Listener for hook in events.
   */
  function hookIn() {
    // Destroy previous, if any.
    if (countdown || interval) destroy();

    $hook = $(this);

    source = EADVideos.videos[$hook.data('video-source')].api;
    start  = $hook.data('hook-start');
    end    = $hook.data('hook-end') || start + 10;
    duration = end - start;

    // Initiate countdown.
    countdown = new ProgressBar.Circle(element, defaults);
    $countdown.fadeIn(500);

    // Start listening.
    source.on('timeupdate', updateCountdown);

    // First step.
    updateCountdown(false);
  }

  /**
   * Listener for hook out events.
   */
  function hookOut() {
    destroy(true);
  }

  /**
   * Listen to hash changing events.
   */
  function hashChange() {
    if ($hook) $hook.trigger('out.ead');
  }

  /**
   * Destroy current countdown.
   */
  function destroy(animate) {

    // Make sure we stop timer.
    if (interval) clearInterval(interval);

    // Disable listeners.
    if (source) source.off('timeupdate', updateCountdown);

    // Reset variables.
    interval = source = $hook = null;

    // @todo: Ugly!
    if (animate) {
      $countdown.fadeOut(500, function () {
        countdown && countdown.destroy();
        countdown = null;
      });
    } else {
      countdown && countdown.destroy();
      countdown = null;
    }
  }

  /**
   * Update countdown.
   */
  function updateCountdown(animate) {
    // @todo: should check start/end too.
    if (!source || !countdown) return destroy();

    animate = typeof animate == 'undefined' ? true : animate;
    currentTime = source.currentTime();
    walked = currentTime - start;
    fulfilled = (duration - walked) / duration;

    // Initiate state.
    countdown.setText(Math.floor(duration - walked));
    if (animate) countdown.animate(fulfilled);
    else countdown.set(fulfilled);
  }

})();
