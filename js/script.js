
jQuery(function () {

  var videoIds = [
    'video1',
    'video1_1',
    'video2',
    'video2_1',
    'video3',
    'video4',
    'video4_1',
    'video5',
    'video5_1',
    'video6',
    'video6_1',
    'video7',
    'video7_1',
    'video8',
    'video8_1',
    'video9',
    'encerramento'
  ];

  var videos = {};

  videoIds.forEach(function (id) {
    videos[id] = {
      video: Popcorn('#' + id),
      $element: $('#' + id)
    };
  });

  var current = videos['video1'];

  var $hooks = $('.hook');

  // Build hooks.
  $hooks.each(function () {
    var $hook = $(this);
    var sourceId = $hook.data('video-source');
    var source = videos[sourceId].video;
    var time = $hook.data('video-time');

    source.cue(time, function () {
      $hook.addClass('active');
    });

    $hook.on('click', function () {
      changeVideo(sourceId);
    });
  });

  // Build timelines.
  $.each(videos, function (id) {
    var nextVideoId = this.$element.data('video-next');

    this.video.on('ended', function () {
      if (nextVideoId) {
        changeVideo(nextVideoId, 0);
      }
    });
  });

  /**
   * Show a video.
   */
  function changeVideo(id, time) {
    time = time || 0;

    // Pause current video.
    current.video.pause();
    current.$element.removeClass('active');

    current = videos[id];
    current.video.currentTime(time);
    current.video.play();
    current.$element.addClass('active');
  }

  window.changeVideo = changeVideo;

  // Hide thumbnails

  var $thumbnailContainer = $('#thumbnail-container');
  var $tutorialLink = $('#tutorial-link');
  var $mainLink = $('#main-link');

  $tutorialLink.on('click', function () {
    $thumbnailContainer.fadeOut(400);

    changeVideo('tut1')

  });

  $mainLink.on('click', function () {
    $thumbnailContainer.fadeOut(400);

    changeVideo('video1')

  });

});
