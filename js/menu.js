
jQuery(function () {

	var $navMenu = $('#nav-menu');
	var $navMenuButton = $('#nav-menu-button');


	$navMenuButton.on('click', function () {
		$navMenu.toggleClass('active');

		$navMenuButton.toggleClass


		// @todo: what the fuck! Why wont you focus when clicked?
		// $navMenuButton.focus();
	});

	$navMenu.on('focusout', closeMenu);
	
	function closeMenu() {
		$navMenu.removeClass('active')
	}


;});