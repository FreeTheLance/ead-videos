var element = document.getElementById('countdown-container');

var countdown = new ProgressBar.Circle(element, {
    duration: 1000,
    color: "#A1DD10",
    trailColor: "#fff",
    strokeWidth: 10,
    trailWidth: 3
});

countdown.set(1);

var duration = 4;

countdown.setText(duration);

var count = 0;

var interval = setInterval(function () {
	count = count + 1;

	if (count == duration + 1) {
		clearInterval(interval);
		$(element).fadeOut();

		return;
	}

	countdown.setText(duration - count);

    countdown.animate(1 - count / duration);
}, 1000);
