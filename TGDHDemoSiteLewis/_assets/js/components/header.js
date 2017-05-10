var Header = (function ($) {
	'use strict';

	var _header = function() {
		$(window).scroll(function(){
			var wScroll = $(this).scrollTop();
			if(wScroll > 500){
				$('.c-header').addClass('js-sticky');
				$('.c-search').addClass('js-small');
			}else{
				$('.c-header').removeClass('js-sticky');
				$('.c-search').removeClass('js-small');
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
