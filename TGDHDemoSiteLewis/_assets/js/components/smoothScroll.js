var SmoothScroll = (function ($) {
	'use strict';

	var _smoothScroll = function() {
		$(document).ready(function(){
			$('a[href*="#"]:not([href="#"])').click(function() {
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
