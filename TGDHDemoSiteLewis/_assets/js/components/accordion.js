var Accordion = (function ($) {
	'use strict';

	var _accord = function() {
		$('.js-accordion__item__header').on('click', function(){
			$(this).parent('.js-accordion__item').toggleClass('is-active');
		});
	};

	return {
		init: _accord
	};

})(jQuery);
