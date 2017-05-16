var Search = (function ($) {
	'use strict';

	var _search = function() {
		$(document).ready(function(){
			$('.js-search').click(function(){
				$(this).toggleClass('js-active');
				$('.c-search').toggleClass('js-active');
				setTimeout(function(){
					$('.c-search__text').focus();
				},200);
			});
		});
	};

	return {
		init: _search
	};

})(jQuery);
