var Menu = (function ($) {
	'use strict';

	var _menu = function() {
		$(document).ready(function(){
			$('.js-menu').click(function(){
				$(this).toggleClass('js-active');
				$('.js-nav').toggleClass('js-active');
				setTimeout(function(){
					$('.js-nav .c-nav__list .c-nav__item').each(function(i){
				      setTimeout(function(){
				        $('.js-nav .c-nav__list .c-nav__item').eq(i).toggleClass('js-active');
				      }, (700 * (Math.exp(i * 0.14))) - 700);
				    });
				},350);
			});
		});
	};

	return {
		init: _menu
	};

})(jQuery);
