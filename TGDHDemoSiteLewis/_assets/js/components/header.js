var Header = (function ($) {
	'use strict';

	var _header = function() {
		$(window).scroll(function(){
			var wScroll = $(this).scrollTop();
			if(wScroll > 500){
				$('.c-header').addClass('js-sticky');
			}else{
				$('.c-header').removeClass('js-sticky');
			}
		});
		$(document).ready(function(){
			$('.js-underline').html(function(index, curHTML) {
		       var text = curHTML.split(/[\s-]/),
		           newtext = '<span>' + text.pop() + '</span>';
		       return text.join(' ').concat(' ' + newtext);
	     	});
		});
	};

	return {
		init: _header
	};

})(jQuery);
