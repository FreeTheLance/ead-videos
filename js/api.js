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
 */
function goTo(id, time) {
  time = time || 0;

  // Pause current video, if available.
  if (EADVideos.current) {
    EADVideos.current.api.pause();
    EADVideos.current.$element.removeClass('active');
  }

  // Go to video.
  EADVideos.current = EADVideos.videos[id];
  EADVideos.current.api.currentTime(time);
  EADVideos.current.api.play();
  EADVideos.current.$element.addClass('active');
}


/*
 * Register listeners.
 */

$('video').each(initializeVideos);
$('.hook').each(initializeHooks);

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
}

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
