var Search = (function ($) {
	'use strict';

	var _search = function() {
		$(document).ready(function(){
			$('.js-search').click(function(){
				$(this).toggleClass('js-active');
				$('.c-search').toggleClass('js-active');
			});
		});
	};

	return {
		init: _search
	};

})(jQuery);
