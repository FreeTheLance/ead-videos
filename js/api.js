/**
 * Initialize data and api.
 */

var $body = $('body');

// Initiate globals.
window.EADVideos = jQuery.extend(true, window.EADVideos || {}, {
  ids: [],
  videos: {},
  current: null,
  destination: null,
  goTo: goTo,
  finish: finish,
  parseHash: parseHash,
  forceStart: false,
  checkPredefinedDestination: checkPredefinedDestination
});

/*
 * API Methods.
 */

/**
 * Go to a previously defined destination, or finish the application.
 */
function finish() {

  // Go to predefined destination, when available.
  if (EADVideos.checkPredefinedDestination()) return;

  // Pause current video, if available.
  if (EADVideos.current) {
    EADVideos.current.api.pause();
    EADVideos.current.$element.trigger('out.ead');
    EADVideos.current = null;
  }

  // Update hash, if not done yet.
  location.hash = '';

  // @todo: any other finishing state?
  $body.attr('data-state-name', 'home');
  // Finish program.
  // go home?
}

/**
 * Go to a video.
 * @param {string} id ID of the video to go to.
 * @param {time} time Optional time (milliseconds) to start the video.
 * @param {boolean} start Wheter the video should automatically start playing.
 */
function goTo(id, time, start) {
  var target = EADVideos.videos[id];

  // Early return on no video found. @todo: should create an error.
  if (!target) return;

  time = time || 0;
  start = typeof start === 'undefined' ? !target.$element.filter('[data-manual-start]').length : start;

  // Pause current video, if available.
  if (EADVideos.current) {
    EADVideos.current.api.pause();
    EADVideos.current.$element.trigger('out.ead');
  }

  // Go to video.
  target.api.load();
  target.api.currentTime(time);
  target.$element.trigger('in.ead');

  EADVideos.current = target;

  if (EADVideos.forceStart) {
    EADVideos.forceStart = false;
    start = true;
  }

  // Initiate video, if required to do so.
  if (start) EADVideos.current.api.play();
}

/**
 * Go to the predefined destination, when available.
 */
function checkPredefinedDestination() {
  if (this.destination) {
    EADVideos.forceStart = true;

    location.hash = this.destination.id + '&' + ((this.destination.time || 0) * 1000);
    this.destination = null;
    return true;
  }

  return false;
}

/**
 * Parse a hash string to find a video id and time.
 */
function parseHash(hash) {
  var parsed = (hash || '').match(/([a-z][a-z0-9_-]+)(?:&([0-9.]+))?/i);

  return parsed && parsed[1] ? {
    id: parsed[1],
    time: parsed[2] || 0
  } : null;
}


/*
 * Run initializers.
 */

$('video').each(initializeVideos);

/**
 * Register video to the global api.
 */
function initializeVideos() {
  var $element = $(this);
  var id       = $element.attr('id');
  var video    = {
    id: id,
    next: $element.data('video-next') || null,
    api: Popcorn('#' + id),
    $element: $element
  };

  // Listen for video ending event. Bind a goto if next is available. Otherwise,
  // just bind a finish program command.
  video.api.on('ended', function () {

    // Handle interruption of default timeline.
    if (EADVideos.checkPredefinedDestination()) return;

    if (video.next) {
      var targetInfo = EADVideos.parseHash(video.next);
      EADVideos.goTo(targetInfo.id, targetInfo.time, true);
    } else {
      EADVideos.finish();
    }
  });

  // Save data to the API.
  EADVideos.ids.push(id);
  EADVideos.videos[id] = video;

  // Setup poster.
  // video.api.currentTime(0.1).capture().currentTime(0);
}
