
jQuery(function () {

	var $navMenu = $('#nav-menu');
	var $anchors = $navMenu.find('a');
	var $navMenuButton = $('#nav-menu-button');

	$navMenu.on('focusout', closeMenu);
	$navMenuButton.on('click', openMenu);
	$anchors.on('click', saveDestination);

	function openMenu(e) {
		e.preventDefault()
		$navMenu.toggleClass('active');
	}

	function closeMenu(e) {
		$navMenu.removeClass('active')
	}

	function saveDestination() {
		if (EADVideos.current) {
			EADVideos.destination = {
				id: EADVideos.current.id,
				time: Math.max(EADVideos.current.api.currentTime() - 5, 0)
			};
		}
	}

;});
