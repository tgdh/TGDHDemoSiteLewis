(function($){
	'use strict';
	var $window = window,
		$html	= $('html');

	var enhanceEdgeCaseBrowsers = function() {

		if( !Modernizr.classlist ) {
			$html.removeClass('no-enhance').addClass('enhance');
		}

	};

/* ===========================================================

	# Init

=========================================================== */

	if( $window.IsModern ){

		enhanceEdgeCaseBrowsers();
		$('.js-tabs').tabs();
		$window.Header.init();
		$window.SmoothScroll.init();
		$window.Search.init();
		$window.Menu.init();
		$window.Carousel.init($('.js-carousel'));
		//MQ.init(breakpoints);
	}

})(jQuery);
