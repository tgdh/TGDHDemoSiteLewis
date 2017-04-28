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
		$window.Header.init();
		$window.SmoothScroll.init();
		$window.Search.init();
		$window.Menu.init();
		$('.js-tabs').tabs();

		//MQ.init(breakpoints);
	}

})(jQuery);
