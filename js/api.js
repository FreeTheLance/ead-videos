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
  remember: {},
  checkPredefinedDestination: checkPredefinedDestination
});

/*
 * API Methods.
 */

/**
 * Go to a previously defined destination, or finish the application.
 */
function finish(gohome) {
  gohome = typeof gohome == 'undefined' ? true : gohome;

  // Go to predefined destination, when available.
  if (EADVideos.checkPredefinedDestination()) return;

  // Pause current video, if available.
  if (EADVideos.current) {
    EADVideos.current.api.pause();

    if (gohome) {
      EADVideos.current.$element.trigger('out.ead');
      EADVideos.current = null;
    }
  }

  if (gohome) {
    // Update hash, if not done yet.
    location.hash = '';

    // @todo: any other finishing state?
    $body.attr('data-state-name', 'home').removeClass('finished');
    // Finish program.
    // go home?
  } else {
    $body.addClass('finished');
  }
}

function getRemember(prop, otherwise) {
  var result = otherwise;

  if (EADVideos.remember[prop] !== undefined) {
    result = EADVideos.remember[prop];
    delete EADVideos.remember[prop];
  }

  return result;
}

/**
 * Go to a video.
 * @param {string} id ID of the video to go to.
 * @param {time} time Optional time (milliseconds) to start the video.
 * @param {boolean} start Wheter the video should automatically start playing.
 */
function goTo(id, time, start, animate) {
  animate = typeof animate == 'undefined' ? getRemember('animate', true) : animate;

  var target = EADVideos.videos[id];

  // Early return on no video found. @todo: should create an error.
  if (!target) return;

  // Preload next video, if any.
  if (target.next) {
    var nextInfo = EADVideos.parseHash(target.next);
    EADVideos.videos[nextInfo.id] && EADVideos.videos[nextInfo.id].api.preload('auto');
  }

  time = time || 0;
  start = typeof start === 'undefined' ? getRemember('start', !target.$element.filter('[data-manual-start]').length) : start;

  // Pause current video, if available.
  if (EADVideos.current) {
    EADVideos.current.api.pause();
    EADVideos.current.$element.trigger('out.ead', animate);
  }

  // Go to video.
  target.api.load();
  target.api.currentTime(time);
  target.$element.trigger('in.ead', animate);

  EADVideos.current = target;

  if (EADVideos.forceStart) {
    EADVideos.forceStart = false;
    start = true;
  }

  // Initiate video, if required to do so.
  if (start) EADVideos.current.api.play();

  $body.removeClass('finished');
}

/**
 * Go to the predefined destination, when available.
 */
function checkPredefinedDestination() {
  if (this.destination) {
    EADVideos.forceStart = true;

    location.hash = this.destination.id + '&' + (this.destination.time || 0);
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

  if (!parsed || !parsed[1]) {
    console.log('Not found hash: "' + hash + '"');
  }

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
      EADVideos.remember.start = true;
      EADVideos.remember.animate = false;
      
      window.location.hash = video.next;
    } else {
      EADVideos.finish(false);
    }
  });

  // Save data to the API.
  EADVideos.ids.push(id);
  EADVideos.videos[id] = video;

  // Setup poster.
  // video.api.currentTime(0.1).capture().currentTime(0);
}
