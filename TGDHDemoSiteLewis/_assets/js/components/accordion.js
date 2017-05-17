var Accordion = (function ($) {
	'use strict';

	var _accord = function() {
		$(document).ready(function(){
			$('.c-accordion__header').click(function(){
                $(this).parent('.c-accordion_item').toggleClass('js-active');
            });
		});
	};

	return {
		init: _accord
	};

})(jQuery);
