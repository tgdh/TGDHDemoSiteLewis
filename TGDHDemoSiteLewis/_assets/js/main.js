(function($){
	'use strict';
	var $window = window,
		$html	= $('html');

	var enhanceEdgeCaseBrowsers = function() {

		if( !Modernizr.classlist ) {
			$html.removeClass('no-enhance').addClass('enhance');
		}

	};

	var responsiveTables = function() {
        var $tables = $('.s-free-content').find('table'),
            $tableWrap = $('<div>', {
                class: 'o-table o-table--scroll'
            });

        $tables.each(function() {
            $(this).wrap($tableWrap);
        });

    };

	var scrollTo = function(el) {

        el.on('click', function(event) {
            var $this = $(this),
                target = $($this.attr('href')),
                heightOffset = 0;

            if (target.length) {
                var ref = $this.data("ref");
                event.preventDefault();

                $('html, body').animate({
                    scrollTop: (target.offset().top - heightOffset)
                }, 500);

            }

        });
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
		$window.Accordion.init();
		$window.Carousel.init($('.js-carousel'));
		responsiveTables();
		scrollTo($('a[href^="#"]:not(".js-no-scroll")'));
		//MQ.init(breakpoints);

		/*
		BackgroundCheck.init({
			targets: '.js-background-check',
			images: '.js-background-check',
			classes: {
				dark: 'u-background--dark',
				light: 'u-background--light',
				complex: 'u-background--complex'
			}
		});
		*/
	}

})(jQuery);
