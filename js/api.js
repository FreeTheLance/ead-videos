/**
 * Initialize data and api.
 */

// Initiate globals.
window.EADVideos = jQuery.extend(true, window.EADVideos || {}, {
  ids: [],
  videos: {},
  current: null,
  destination: null,
  goTo: goTo,
  finish: finish
});

/*
 * API Methods.
 */

/**
 * Go to a previously defined destination, or finish the application.
 */
function finish() {
  // Go to currently defined destination, when available.
  if (this.destination) {
    goTo(this.destination.id, this.destination.time);
    this.destination = null;
    return;
  }

  // Finish program.
  // go home?
}

/**
 * Go to a video.
 * @param {string} id ID of the video to go to.
 * @param {time} time Optional time (milliseconds) to start the video.
 * @param {boolean} start Wheter the video should automatically start playing.
 */
function goTo(id, time, start, hold) {
  time = time || 0;
  start = start || false;
  hold = hold || 1000;

  // Pause current video, if available.
  if (EADVideos.current) {
    EADVideos.current.api.pause();
    EADVideos.current.$element.trigger('out.ead');
  }

  setTimeout(function () {
    // Go to video.
    EADVideos.current = EADVideos.videos[id];
    EADVideos.current.api.currentTime(time);
    EADVideos.current.$element.trigger('in.ead');

    // Initiate video, if required to do so.
    if (start) EADVideos.current.api.play();
  }, hold);
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
    EADVideos[video.next ? 'goTo' : 'finish'](video.next, 0);
  });

  // Save data to the API.
  EADVideos.ids.push(id);
  EADVideos.videos[id] = video;

  // Setup poster.
  video.api.currentTime(0.1).capture().currentTime(0);
}














jQuery(function () {

  // Hide thumbnails

  var $thumbnailContainer = $('#thumbnail-container');
  var $tutorialLink = $('#tutorial-link');
  var $mainLink = $('#main-link');

  $tutorialLink.on('click', function () {
    $thumbnailContainer.fadeOut(400);

    goTo('tut1')

  });

  $mainLink.on('click', function () {
    $thumbnailContainer.fadeOut(400);

    goTo('video1')

  });

});