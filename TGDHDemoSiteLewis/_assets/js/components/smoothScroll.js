var SmoothScroll = (function ($) {
	'use strict';
	console.log("first");
	var _smoothScroll = function() {
		console.log('second');
		$(document).ready(function(){
			console.log('third');
			$('a[href*="#"]:not([href="#"])').click(function() {
				console.log('fourth');
			  if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				if (target.length) {
				  $('html, body').animate({
					scrollTop: target.offset().top
				  }, 750);
				  return false;
				}
			  }
			});
		});
	};

	return {
		init: _smoothScroll
	};

})(jQuery);
