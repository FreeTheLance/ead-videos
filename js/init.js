/**
 * Setup initial listeners.
 */

;(function () {
  var $tutorialLink = $('#tutorial-link');
  var $mainLink = $('#main-link');

  $tutorialLink.on('click', function () {
    goTo('tut1', 0, false);

  });

  $mainLink.on('click', function () {
    goTo('video1', 0, false)
  });
})();
