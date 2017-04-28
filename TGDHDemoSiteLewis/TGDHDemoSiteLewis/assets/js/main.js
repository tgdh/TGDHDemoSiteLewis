// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "tabs",
			defaults = {
				contentClass: 'c-tabs__content'
			};

		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.element = $(element);
			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
			init: function () {
				this._activeTab		= ( this.getUrlHash() !== "" ? $('#' + this.getUrlHash() ).index() : 0 );
				this.$nav 			= this.element.find('nav');
				this.$navList		= this.$nav.find('ul');
				this.$navItems		= this.$navList.find('li');
				this.$navLinks		= this.$navItems.find('a');
				this.$content 		= this.element.find('.c-tabs__content');
				this.$contentTabs	= this.$content.children();
				this._tabLength		= this.$navItems.length;
				this._resizeTimer	= 0;

				this.element.addClass('js-tabs--loaded');

				// Place initialization logic here
				// You already have access to the DOM element and
				// the options via the instance, e.g. this.element
				// and this.settings
				// you can add more functions like the one below and
				// call them like the example bellow
//				this.setTabIndexes();
				this.setEventHandlers();
				// @todo get hash fragment or first
				this.setActiveTab( this._activeTab );
				this.resizeHandler();
				this.addNav();

			},
			getUrlHash: function() {
//				return document.URL.substr(document.URL.indexOf('#')+1);
				return location.hash.match(/^#?(.*)$/)[1];
			},
			setEventHandlers: function() {
				var $self = this;

				$self.$navList.find('li').on('click', function( e ){
					var $this = $(this);

					if( !$this.hasClass('is-active') ) {
						$self.setActiveTab( $this.index() );
						$self.setActiveHash( $this.find('a').attr('href') );
					}
					e.preventDefault();
				});
			},
			setActiveHash: function( urlHash ) {
				if( Modernizr.history ) {
					history.pushState( null, null, urlHash );
				}
				/*
				else {
					location.hash = urlHash;
				}
				*/
			},
			setTabIndexes: function() {
				for( var i = 0; i < this._tabLength; i++ ) {
					this.$navItems.eq( i ).attr('data-index', i);
					this.$contentTabs.eq( i ).attr('data-index', i);
				}
			},
			setActiveTab: function( i ) {
				this._activeTab = i;

				var $activeNavItem 		= this.$navList.children('li').eq( this._activeTab ),
					$activeContentTab 	= this.$content.children('section').eq( this._activeTab );

				this.$navList.find('.is-active').removeClass('is-active');
				this.$content.find('.is-active').removeClass('is-active');

				$activeNavItem.addClass('is-active');
				$activeContentTab.addClass('is-active');

				this.animateContentHeight( $activeContentTab );
			},
			addNav: function() {
				var delta = 40,
					$self = this,
					$prevButton = $('<button>', {
						'class': 'c-tabs__page c-tabs__page--prev js-tabs-page-prev',
						'text': 'prev'
					}),
					$nextButton = $('<button>', {
						'class': 'c-tabs__page c-tabs__page--next js-tabs-page-next',
						'text': 'next'
					});

				this.$nav.prepend( $prevButton );
				this.$nav.append( $nextButton );

				this.$navList.on('scroll', function() {
					$self.updateScrollIndicator( $prevButton, $nextButton );
				} );
				this.updateScrollIndicator( $prevButton, $nextButton );

				$nextButton.on('click', function() {
					$self.scrollMenuBar( delta );
				});

				$nextButton.on('tap', function() {
					$self.scrollMenuBar( delta );
				});
				$prevButton.on('click', function() {
					$self.scrollMenuBar( -delta );
				});
				$prevButton.on('tap', function() {
					$self.scrollMenuBar( -delta );
				});
			},
			updateScrollIndicator: function( $leftScroll, $rightScroll) {
				var $self = this,
					$menuBar = $self.$navList.get(0);

				$leftScroll.removeClass('is-disabled');
				$rightScroll.removeClass('is-disabled');
				
				if( $menuBar.scrollLeft <= 0 ) {
					$leftScroll.addClass('is-disabled');
				}

				// 5px tolerance because browsers!
				if( $menuBar.scrollLeft + $self.$navList.innerWidth() + 5 >= $menuBar.scrollWidth ) {
					$rightScroll.addClass('is-disabled');
				}
			},
			scrollMenuBar: function( delta ) {
				var $menuBar = this.$navList.get(0);
				$menuBar.scrollLeft += delta;
			},
			animateContentHeight: function( el ) {
				this.$content.css({
					'height': el.innerHeight()
				});
			},
			resizeHandler: function() {
				var $activeContentTab = this.$content.children('section').eq( this._activeTab ),
					$self = this;

				// On resize, run the function and reset the timeout
				// 250 is the delay in milliseconds. Change as you see fit.
				$(window).resize(function() {
					clearTimeout( this._resizeTimer );
					this._resizeTimer = setTimeout( $self.animateContentHeight( $activeContentTab ), 250 );
				});
			}
				
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
			return this.each(function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
						$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
				}
			});
		};

})( jQuery, window, document );
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcXVlcnkudGFicy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0aGUgc2VtaS1jb2xvbiBiZWZvcmUgZnVuY3Rpb24gaW52b2NhdGlvbiBpcyBhIHNhZmV0eSBuZXQgYWdhaW5zdCBjb25jYXRlbmF0ZWRcclxuLy8gc2NyaXB0cyBhbmQvb3Igb3RoZXIgcGx1Z2lucyB3aGljaCBtYXkgbm90IGJlIGNsb3NlZCBwcm9wZXJseS5cclxuOyhmdW5jdGlvbiAoICQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCApIHtcclxuXHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdFx0Ly8gdW5kZWZpbmVkIGlzIHVzZWQgaGVyZSBhcyB0aGUgdW5kZWZpbmVkIGdsb2JhbCB2YXJpYWJsZSBpbiBFQ01BU2NyaXB0IDMgaXNcclxuXHRcdC8vIG11dGFibGUgKGllLiBpdCBjYW4gYmUgY2hhbmdlZCBieSBzb21lb25lIGVsc2UpLiB1bmRlZmluZWQgaXNuJ3QgcmVhbGx5IGJlaW5nXHJcblx0XHQvLyBwYXNzZWQgaW4gc28gd2UgY2FuIGVuc3VyZSB0aGUgdmFsdWUgb2YgaXQgaXMgdHJ1bHkgdW5kZWZpbmVkLiBJbiBFUzUsIHVuZGVmaW5lZFxyXG5cdFx0Ly8gY2FuIG5vIGxvbmdlciBiZSBtb2RpZmllZC5cclxuXHJcblx0XHQvLyB3aW5kb3cgYW5kIGRvY3VtZW50IGFyZSBwYXNzZWQgdGhyb3VnaCBhcyBsb2NhbCB2YXJpYWJsZSByYXRoZXIgdGhhbiBnbG9iYWxcclxuXHRcdC8vIGFzIHRoaXMgKHNsaWdodGx5KSBxdWlja2VucyB0aGUgcmVzb2x1dGlvbiBwcm9jZXNzIGFuZCBjYW4gYmUgbW9yZSBlZmZpY2llbnRseVxyXG5cdFx0Ly8gbWluaWZpZWQgKGVzcGVjaWFsbHkgd2hlbiBib3RoIGFyZSByZWd1bGFybHkgcmVmZXJlbmNlZCBpbiB5b3VyIHBsdWdpbikuXHJcblxyXG5cdFx0Ly8gQ3JlYXRlIHRoZSBkZWZhdWx0cyBvbmNlXHJcblx0XHR2YXIgcGx1Z2luTmFtZSA9IFwidGFic1wiLFxyXG5cdFx0XHRkZWZhdWx0cyA9IHtcclxuXHRcdFx0XHRjb250ZW50Q2xhc3M6ICdjLXRhYnNfX2NvbnRlbnQnXHJcblx0XHRcdH07XHJcblxyXG5cdFx0Ly8gVGhlIGFjdHVhbCBwbHVnaW4gY29uc3RydWN0b3JcclxuXHRcdGZ1bmN0aW9uIFBsdWdpbiAoIGVsZW1lbnQsIG9wdGlvbnMgKSB7XHJcblx0XHRcdHRoaXMuZWxlbWVudCA9ICQoZWxlbWVudCk7XHJcblx0XHRcdC8vIGpRdWVyeSBoYXMgYW4gZXh0ZW5kIG1ldGhvZCB3aGljaCBtZXJnZXMgdGhlIGNvbnRlbnRzIG9mIHR3byBvclxyXG5cdFx0XHQvLyBtb3JlIG9iamVjdHMsIHN0b3JpbmcgdGhlIHJlc3VsdCBpbiB0aGUgZmlyc3Qgb2JqZWN0LiBUaGUgZmlyc3Qgb2JqZWN0XHJcblx0XHRcdC8vIGlzIGdlbmVyYWxseSBlbXB0eSBhcyB3ZSBkb24ndCB3YW50IHRvIGFsdGVyIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yXHJcblx0XHRcdC8vIGZ1dHVyZSBpbnN0YW5jZXMgb2YgdGhlIHBsdWdpblxyXG5cdFx0XHR0aGlzLnNldHRpbmdzID0gJC5leHRlbmQoIHt9LCBkZWZhdWx0cywgb3B0aW9ucyApO1xyXG5cdFx0XHR0aGlzLl9kZWZhdWx0cyA9IGRlZmF1bHRzO1xyXG5cdFx0XHR0aGlzLl9uYW1lID0gcGx1Z2luTmFtZTtcclxuXHRcdFx0dGhpcy5pbml0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQXZvaWQgUGx1Z2luLnByb3RvdHlwZSBjb25mbGljdHNcclxuXHRcdCQuZXh0ZW5kKFBsdWdpbi5wcm90b3R5cGUsIHtcclxuXHRcdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMuX2FjdGl2ZVRhYlx0XHQ9ICggdGhpcy5nZXRVcmxIYXNoKCkgIT09IFwiXCIgPyAkKCcjJyArIHRoaXMuZ2V0VXJsSGFzaCgpICkuaW5kZXgoKSA6IDAgKTtcclxuXHRcdFx0XHR0aGlzLiRuYXYgXHRcdFx0PSB0aGlzLmVsZW1lbnQuZmluZCgnbmF2Jyk7XHJcblx0XHRcdFx0dGhpcy4kbmF2TGlzdFx0XHQ9IHRoaXMuJG5hdi5maW5kKCd1bCcpO1xyXG5cdFx0XHRcdHRoaXMuJG5hdkl0ZW1zXHRcdD0gdGhpcy4kbmF2TGlzdC5maW5kKCdsaScpO1xyXG5cdFx0XHRcdHRoaXMuJG5hdkxpbmtzXHRcdD0gdGhpcy4kbmF2SXRlbXMuZmluZCgnYScpO1xyXG5cdFx0XHRcdHRoaXMuJGNvbnRlbnQgXHRcdD0gdGhpcy5lbGVtZW50LmZpbmQoJy5jLXRhYnNfX2NvbnRlbnQnKTtcclxuXHRcdFx0XHR0aGlzLiRjb250ZW50VGFic1x0PSB0aGlzLiRjb250ZW50LmNoaWxkcmVuKCk7XHJcblx0XHRcdFx0dGhpcy5fdGFiTGVuZ3RoXHRcdD0gdGhpcy4kbmF2SXRlbXMubGVuZ3RoO1xyXG5cdFx0XHRcdHRoaXMuX3Jlc2l6ZVRpbWVyXHQ9IDA7XHJcblxyXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5hZGRDbGFzcygnanMtdGFicy0tbG9hZGVkJyk7XHJcblxyXG5cdFx0XHRcdC8vIFBsYWNlIGluaXRpYWxpemF0aW9uIGxvZ2ljIGhlcmVcclxuXHRcdFx0XHQvLyBZb3UgYWxyZWFkeSBoYXZlIGFjY2VzcyB0byB0aGUgRE9NIGVsZW1lbnQgYW5kXHJcblx0XHRcdFx0Ly8gdGhlIG9wdGlvbnMgdmlhIHRoZSBpbnN0YW5jZSwgZS5nLiB0aGlzLmVsZW1lbnRcclxuXHRcdFx0XHQvLyBhbmQgdGhpcy5zZXR0aW5nc1xyXG5cdFx0XHRcdC8vIHlvdSBjYW4gYWRkIG1vcmUgZnVuY3Rpb25zIGxpa2UgdGhlIG9uZSBiZWxvdyBhbmRcclxuXHRcdFx0XHQvLyBjYWxsIHRoZW0gbGlrZSB0aGUgZXhhbXBsZSBiZWxsb3dcclxuLy9cdFx0XHRcdHRoaXMuc2V0VGFiSW5kZXhlcygpO1xyXG5cdFx0XHRcdHRoaXMuc2V0RXZlbnRIYW5kbGVycygpO1xyXG5cdFx0XHRcdC8vIEB0b2RvIGdldCBoYXNoIGZyYWdtZW50IG9yIGZpcnN0XHJcblx0XHRcdFx0dGhpcy5zZXRBY3RpdmVUYWIoIHRoaXMuX2FjdGl2ZVRhYiApO1xyXG5cdFx0XHRcdHRoaXMucmVzaXplSGFuZGxlcigpO1xyXG5cdFx0XHRcdHRoaXMuYWRkTmF2KCk7XHJcblxyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXRVcmxIYXNoOiBmdW5jdGlvbigpIHtcclxuLy9cdFx0XHRcdHJldHVybiBkb2N1bWVudC5VUkwuc3Vic3RyKGRvY3VtZW50LlVSTC5pbmRleE9mKCcjJykrMSk7XHJcblx0XHRcdFx0cmV0dXJuIGxvY2F0aW9uLmhhc2gubWF0Y2goL14jPyguKikkLylbMV07XHJcblx0XHRcdH0sXHJcblx0XHRcdHNldEV2ZW50SGFuZGxlcnM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciAkc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRcdCRzZWxmLiRuYXZMaXN0LmZpbmQoJ2xpJykub24oJ2NsaWNrJywgZnVuY3Rpb24oIGUgKXtcclxuXHRcdFx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRcdFx0aWYoICEkdGhpcy5oYXNDbGFzcygnaXMtYWN0aXZlJykgKSB7XHJcblx0XHRcdFx0XHRcdCRzZWxmLnNldEFjdGl2ZVRhYiggJHRoaXMuaW5kZXgoKSApO1xyXG5cdFx0XHRcdFx0XHQkc2VsZi5zZXRBY3RpdmVIYXNoKCAkdGhpcy5maW5kKCdhJykuYXR0cignaHJlZicpICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHNldEFjdGl2ZUhhc2g6IGZ1bmN0aW9uKCB1cmxIYXNoICkge1xyXG5cdFx0XHRcdGlmKCBNb2Rlcm5penIuaGlzdG9yeSApIHtcclxuXHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCBudWxsLCBudWxsLCB1cmxIYXNoICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8qXHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gdXJsSGFzaDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ki9cclxuXHRcdFx0fSxcclxuXHRcdFx0c2V0VGFiSW5kZXhlczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Zm9yKCB2YXIgaSA9IDA7IGkgPCB0aGlzLl90YWJMZW5ndGg7IGkrKyApIHtcclxuXHRcdFx0XHRcdHRoaXMuJG5hdkl0ZW1zLmVxKCBpICkuYXR0cignZGF0YS1pbmRleCcsIGkpO1xyXG5cdFx0XHRcdFx0dGhpcy4kY29udGVudFRhYnMuZXEoIGkgKS5hdHRyKCdkYXRhLWluZGV4JywgaSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRzZXRBY3RpdmVUYWI6IGZ1bmN0aW9uKCBpICkge1xyXG5cdFx0XHRcdHRoaXMuX2FjdGl2ZVRhYiA9IGk7XHJcblxyXG5cdFx0XHRcdHZhciAkYWN0aXZlTmF2SXRlbSBcdFx0PSB0aGlzLiRuYXZMaXN0LmNoaWxkcmVuKCdsaScpLmVxKCB0aGlzLl9hY3RpdmVUYWIgKSxcclxuXHRcdFx0XHRcdCRhY3RpdmVDb250ZW50VGFiIFx0PSB0aGlzLiRjb250ZW50LmNoaWxkcmVuKCdzZWN0aW9uJykuZXEoIHRoaXMuX2FjdGl2ZVRhYiApO1xyXG5cclxuXHRcdFx0XHR0aGlzLiRuYXZMaXN0LmZpbmQoJy5pcy1hY3RpdmUnKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XHJcblx0XHRcdFx0dGhpcy4kY29udGVudC5maW5kKCcuaXMtYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG5cclxuXHRcdFx0XHQkYWN0aXZlTmF2SXRlbS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XHJcblx0XHRcdFx0JGFjdGl2ZUNvbnRlbnRUYWIuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG5cclxuXHRcdFx0XHR0aGlzLmFuaW1hdGVDb250ZW50SGVpZ2h0KCAkYWN0aXZlQ29udGVudFRhYiApO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRhZGROYXY6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBkZWx0YSA9IDQwLFxyXG5cdFx0XHRcdFx0JHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRcdFx0JHByZXZCdXR0b24gPSAkKCc8YnV0dG9uPicsIHtcclxuXHRcdFx0XHRcdFx0J2NsYXNzJzogJ2MtdGFic19fcGFnZSBjLXRhYnNfX3BhZ2UtLXByZXYganMtdGFicy1wYWdlLXByZXYnLFxyXG5cdFx0XHRcdFx0XHQndGV4dCc6ICdwcmV2J1xyXG5cdFx0XHRcdFx0fSksXHJcblx0XHRcdFx0XHQkbmV4dEJ1dHRvbiA9ICQoJzxidXR0b24+Jywge1xyXG5cdFx0XHRcdFx0XHQnY2xhc3MnOiAnYy10YWJzX19wYWdlIGMtdGFic19fcGFnZS0tbmV4dCBqcy10YWJzLXBhZ2UtbmV4dCcsXHJcblx0XHRcdFx0XHRcdCd0ZXh0JzogJ25leHQnXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0dGhpcy4kbmF2LnByZXBlbmQoICRwcmV2QnV0dG9uICk7XHJcblx0XHRcdFx0dGhpcy4kbmF2LmFwcGVuZCggJG5leHRCdXR0b24gKTtcclxuXHJcblx0XHRcdFx0dGhpcy4kbmF2TGlzdC5vbignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHQkc2VsZi51cGRhdGVTY3JvbGxJbmRpY2F0b3IoICRwcmV2QnV0dG9uLCAkbmV4dEJ1dHRvbiApO1xyXG5cdFx0XHRcdH0gKTtcclxuXHRcdFx0XHR0aGlzLnVwZGF0ZVNjcm9sbEluZGljYXRvciggJHByZXZCdXR0b24sICRuZXh0QnV0dG9uICk7XHJcblxyXG5cdFx0XHRcdCRuZXh0QnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0JHNlbGYuc2Nyb2xsTWVudUJhciggZGVsdGEgKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0JG5leHRCdXR0b24ub24oJ3RhcCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0JHNlbGYuc2Nyb2xsTWVudUJhciggZGVsdGEgKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQkcHJldkJ1dHRvbi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdCRzZWxmLnNjcm9sbE1lbnVCYXIoIC1kZWx0YSApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdCRwcmV2QnV0dG9uLm9uKCd0YXAnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdCRzZWxmLnNjcm9sbE1lbnVCYXIoIC1kZWx0YSApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR1cGRhdGVTY3JvbGxJbmRpY2F0b3I6IGZ1bmN0aW9uKCAkbGVmdFNjcm9sbCwgJHJpZ2h0U2Nyb2xsKSB7XHJcblx0XHRcdFx0dmFyICRzZWxmID0gdGhpcyxcclxuXHRcdFx0XHRcdCRtZW51QmFyID0gJHNlbGYuJG5hdkxpc3QuZ2V0KDApO1xyXG5cclxuXHRcdFx0XHQkbGVmdFNjcm9sbC5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcclxuXHRcdFx0XHQkcmlnaHRTY3JvbGwucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoICRtZW51QmFyLnNjcm9sbExlZnQgPD0gMCApIHtcclxuXHRcdFx0XHRcdCRsZWZ0U2Nyb2xsLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gNXB4IHRvbGVyYW5jZSBiZWNhdXNlIGJyb3dzZXJzIVxyXG5cdFx0XHRcdGlmKCAkbWVudUJhci5zY3JvbGxMZWZ0ICsgJHNlbGYuJG5hdkxpc3QuaW5uZXJXaWR0aCgpICsgNSA+PSAkbWVudUJhci5zY3JvbGxXaWR0aCApIHtcclxuXHRcdFx0XHRcdCRyaWdodFNjcm9sbC5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHNjcm9sbE1lbnVCYXI6IGZ1bmN0aW9uKCBkZWx0YSApIHtcclxuXHRcdFx0XHR2YXIgJG1lbnVCYXIgPSB0aGlzLiRuYXZMaXN0LmdldCgwKTtcclxuXHRcdFx0XHQkbWVudUJhci5zY3JvbGxMZWZ0ICs9IGRlbHRhO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRhbmltYXRlQ29udGVudEhlaWdodDogZnVuY3Rpb24oIGVsICkge1xyXG5cdFx0XHRcdHRoaXMuJGNvbnRlbnQuY3NzKHtcclxuXHRcdFx0XHRcdCdoZWlnaHQnOiBlbC5pbm5lckhlaWdodCgpXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHJlc2l6ZUhhbmRsZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciAkYWN0aXZlQ29udGVudFRhYiA9IHRoaXMuJGNvbnRlbnQuY2hpbGRyZW4oJ3NlY3Rpb24nKS5lcSggdGhpcy5fYWN0aXZlVGFiICksXHJcblx0XHRcdFx0XHQkc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRcdC8vIE9uIHJlc2l6ZSwgcnVuIHRoZSBmdW5jdGlvbiBhbmQgcmVzZXQgdGhlIHRpbWVvdXRcclxuXHRcdFx0XHQvLyAyNTAgaXMgdGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kcy4gQ2hhbmdlIGFzIHlvdSBzZWUgZml0LlxyXG5cdFx0XHRcdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoIHRoaXMuX3Jlc2l6ZVRpbWVyICk7XHJcblx0XHRcdFx0XHR0aGlzLl9yZXNpemVUaW1lciA9IHNldFRpbWVvdXQoICRzZWxmLmFuaW1hdGVDb250ZW50SGVpZ2h0KCAkYWN0aXZlQ29udGVudFRhYiApLCAyNTAgKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gQSByZWFsbHkgbGlnaHR3ZWlnaHQgcGx1Z2luIHdyYXBwZXIgYXJvdW5kIHRoZSBjb25zdHJ1Y3RvcixcclxuXHRcdC8vIHByZXZlbnRpbmcgYWdhaW5zdCBtdWx0aXBsZSBpbnN0YW50aWF0aW9uc1xyXG5cdFx0JC5mblsgcGx1Z2luTmFtZSBdID0gZnVuY3Rpb24gKCBvcHRpb25zICkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmICggISQuZGF0YSggdGhpcywgXCJwbHVnaW5fXCIgKyBwbHVnaW5OYW1lICkgKSB7XHJcblx0XHRcdFx0XHRcdCQuZGF0YSggdGhpcywgXCJwbHVnaW5fXCIgKyBwbHVnaW5OYW1lLCBuZXcgUGx1Z2luKCB0aGlzLCBvcHRpb25zICkgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcbn0pKCBqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQgKTsiXSwiZmlsZSI6ImpxdWVyeS50YWJzLmpzIn0=

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJoZWFkZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIEhlYWRlciA9IChmdW5jdGlvbiAoJCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9oZWFkZXIgPSBmdW5jdGlvbigpIHtcblx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgd1Njcm9sbCA9ICQodGhpcykuc2Nyb2xsVG9wKCk7XG5cdFx0XHRpZih3U2Nyb2xsID4gNTAwKXtcblx0XHRcdFx0JCgnLmMtaGVhZGVyJykuYWRkQ2xhc3MoJ2pzLXN0aWNreScpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdCQoJy5jLWhlYWRlcicpLnJlbW92ZUNsYXNzKCdqcy1zdGlja3knKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXHRcdFx0JCgnLmpzLXVuZGVybGluZScpLmh0bWwoZnVuY3Rpb24oaW5kZXgsIGN1ckhUTUwpIHtcblx0XHQgICAgICAgdmFyIHRleHQgPSBjdXJIVE1MLnNwbGl0KC9bXFxzLV0vKSxcblx0XHQgICAgICAgICAgIG5ld3RleHQgPSAnPHNwYW4+JyArIHRleHQucG9wKCkgKyAnPC9zcGFuPic7XG5cdFx0ICAgICAgIHJldHVybiB0ZXh0LmpvaW4oJyAnKS5jb25jYXQoJyAnICsgbmV3dGV4dCk7XG5cdCAgICAgXHR9KTtcblx0XHR9KTtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IF9oZWFkZXJcblx0fTtcblxufSkoalF1ZXJ5KTtcbiJdLCJmaWxlIjoiaGVhZGVyLmpzIn0=

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtZW51LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBNZW51ID0gKGZ1bmN0aW9uICgkKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX21lbnUgPSBmdW5jdGlvbigpIHtcblx0XHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXHRcdFx0JCgnLmpzLW1lbnUnKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdFx0XHQkKHRoaXMpLnRvZ2dsZUNsYXNzKCdqcy1hY3RpdmUnKTtcblx0XHRcdFx0JCgnLmpzLW5hdicpLnRvZ2dsZUNsYXNzKCdqcy1hY3RpdmUnKTtcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdCQoJy5qcy1uYXYgLmMtbmF2X19saXN0IC5jLW5hdl9faXRlbScpLmVhY2goZnVuY3Rpb24oaSl7XG5cdFx0XHRcdCAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0ICAgICAgICAkKCcuanMtbmF2IC5jLW5hdl9fbGlzdCAuYy1uYXZfX2l0ZW0nKS5lcShpKS50b2dnbGVDbGFzcygnanMtYWN0aXZlJyk7XG5cdFx0XHRcdCAgICAgIH0sICg3MDAgKiAoTWF0aC5leHAoaSAqIDAuMTQpKSkgLSA3MDApO1xuXHRcdFx0XHQgICAgfSk7XG5cdFx0XHRcdH0sMzUwKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogX21lbnVcblx0fTtcblxufSkoalF1ZXJ5KTtcbiJdLCJmaWxlIjoibWVudS5qcyJ9

var Search = (function ($) {
	'use strict';

	var _search = function() {
		$(document).ready(function(){
			$('.js-search').click(function(){
				$(this).toggleClass('js-active');
			});
		});
	};

	return {
		init: _search
	};

})(jQuery);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzZWFyY2guanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIFNlYXJjaCA9IChmdW5jdGlvbiAoJCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9zZWFyY2ggPSBmdW5jdGlvbigpIHtcblx0XHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXHRcdFx0JCgnLmpzLXNlYXJjaCcpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCQodGhpcykudG9nZ2xlQ2xhc3MoJ2pzLWFjdGl2ZScpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBfc2VhcmNoXG5cdH07XG5cbn0pKGpRdWVyeSk7XG4iXSwiZmlsZSI6InNlYXJjaC5qcyJ9

var SmoothScroll = (function ($) {
	'use strict';

	var _smoothScroll = function() {
		$(document).ready(function(){
			$('a[href*="#"]:not([href="#"])').click(function() {
			  if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				if (target.length) {
				  $('html, body').animate({
					scrollTop: target.offset().top
				  }, 750);
				  return false;
				}
			  }
			});
		});
	};

	return {
		init: _smoothScroll
	};

})(jQuery);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzbW9vdGhTY3JvbGwuanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIFNtb290aFNjcm9sbCA9IChmdW5jdGlvbiAoJCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9zbW9vdGhTY3JvbGwgPSBmdW5jdGlvbigpIHtcblx0XHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXHRcdFx0JCgnYVtocmVmKj1cIiNcIl06bm90KFtocmVmPVwiI1wiXSknKS5jbGljayhmdW5jdGlvbigpIHtcblx0XHRcdCAgaWYgKGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCcnKSA9PSB0aGlzLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCcnKSAmJiBsb2NhdGlvbi5ob3N0bmFtZSA9PSB0aGlzLmhvc3RuYW1lKSB7XG5cdFx0XHRcdHZhciB0YXJnZXQgPSAkKHRoaXMuaGFzaCk7XG5cdFx0XHRcdHRhcmdldCA9IHRhcmdldC5sZW5ndGggPyB0YXJnZXQgOiAkKCdbbmFtZT0nICsgdGhpcy5oYXNoLnNsaWNlKDEpICsnXScpO1xuXHRcdFx0XHRpZiAodGFyZ2V0Lmxlbmd0aCkge1xuXHRcdFx0XHQgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcblx0XHRcdFx0XHRzY3JvbGxUb3A6IHRhcmdldC5vZmZzZXQoKS50b3Bcblx0XHRcdFx0ICB9LCA3NTApO1xuXHRcdFx0XHQgIHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0ICB9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IF9zbW9vdGhTY3JvbGxcblx0fTtcblxufSkoalF1ZXJ5KTtcbiJdLCJmaWxlIjoic21vb3RoU2Nyb2xsLmpzIn0=

/*
(function($){
	'use strict';
	
	var $window = window,
		$selector = $('.js-tabs');

	$selector.each(function(){
		var $tabs 		= $(this),
			$nav 		= $tabs.find('nav'),
			$navList	= $nav.find('ul'),
			$navItems	= $navList.find('li'),
			$navLinks	= $navItems.find('a'),
			$content 	= $tabs.find('.c-tabs__content'),
			$contentTabs	= $content.children(),
			tabLength	= $navItems.length;

		$navList.find('li').on('click', function( e ){
			e.preventDefault();
			var $this = $(this);

			if( !$this.hasClass('is-active') ) {
				_setActiveTab( $this.data('index') );
			}

		});

		var _setActiveTab = function( i ) {
			var $activeNavItem 		= $navList.find('[data-index="'+ i +'"]'),
				$activeContentTab 	= $content.find('[data-index="' + i + '"]');

			$navList.find('.is-active').removeClass('is-active');
			$content.find('.is-active').removeClass('is-active');

			$activeNavItem.addClass('is-active');
			$activeContentTab.addClass('is-active');

			_animateContentHeight( $activeContentTab );
		};

		// @todo pass active content element to helper
		var _animateContentHeight = function( el ) {

			$content.animate({
				'height': el.innerHeight()
			}, 200);

		};

		var _setupTabIndexes = function() {

			for( var i = 0; i < tabLength; i++ ) {
				$navItems.eq( i ).attr('data-index', i);
				$contentTabs.eq( i ).attr('data-index', i);
			}
		};

		var _init = function() {
			_setupTabIndexes();

			$navItems.first().addClass('is-active');
			$contentTabs.first().addClass('is-active');
		};
		_init();
	});	
*/	

/* ===========================================================
	# Init
=========================================================== 
	if( $window.IsModern ){

	}

})(jQuery);

/*
jQuery(document).ready(function($){
	var $tabsHandle = $('.js-tabs');
	
	$tabsHandle.each(function(){
		var $tabs = $(this),
			tabItems = $tabs.find('nav'),
			tabContentWrapper = $tabs.find('.js-tabs-content'),
			tabNavigation = $tabs.find('.c-tabs__nav');

		tabItems.on('click', 'a', function(event){
			event.preventDefault();
			var selectedItem = $(this);
			if( !selectedItem.hasClass('selected') ) {
				var selectedTab = selectedItem.data('content'),
					selectedContent = tabContentWrapper.find('li[data-content="'+selectedTab+'"]'),
					slectedContentHeight = selectedContent.innerHeight();
				
				tabItems.find('a.selected').removeClass('selected');
				selectedItem.addClass('selected');
				selectedContent.addClass('selected').siblings('li').removeClass('selected');
				//animate tabContentWrapper height when content changes 
				tabContentWrapper.animate({
					'height': slectedContentHeight
				}, 200);
			}
		});

		//hide the .cd-tabs::after element when tabbed navigation has scrolled to the end (mobile version)
		checkScrolling(tabNavigation);
		tabNavigation.on('scroll', function(){ 
			checkScrolling($(this));
		});
	});
	
	$(window).on('resize', function(){
		$tabsHandle.each(function(){
			var $tabs = $(this);
			checkScrolling( $tabs.find('nav') );
			$tabs.find('.cd-tabs-content').css('height', 'auto');
		});
	});

	function checkScrolling($tabs){
		var totalTabWidth = parseInt($tabs.children('.cd-tabs-navigation').width()),
		 	$tabsViewport = parseInt($tabs.width());
		if( $tabs.scrollLeft() >= totalTabWidth - $tabsViewport) {
			$tabs.parent('.cd-tabs').addClass('is-ended');
		} else {
			$tabs.parent('.cd-tabs').removeClass('is-ended');
		}
	}
});
*/
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ0YWJzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbihmdW5jdGlvbigkKXtcclxuXHQndXNlIHN0cmljdCc7XHJcblx0XHJcblx0dmFyICR3aW5kb3cgPSB3aW5kb3csXHJcblx0XHQkc2VsZWN0b3IgPSAkKCcuanMtdGFicycpO1xyXG5cclxuXHQkc2VsZWN0b3IuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0dmFyICR0YWJzIFx0XHQ9ICQodGhpcyksXHJcblx0XHRcdCRuYXYgXHRcdD0gJHRhYnMuZmluZCgnbmF2JyksXHJcblx0XHRcdCRuYXZMaXN0XHQ9ICRuYXYuZmluZCgndWwnKSxcclxuXHRcdFx0JG5hdkl0ZW1zXHQ9ICRuYXZMaXN0LmZpbmQoJ2xpJyksXHJcblx0XHRcdCRuYXZMaW5rc1x0PSAkbmF2SXRlbXMuZmluZCgnYScpLFxyXG5cdFx0XHQkY29udGVudCBcdD0gJHRhYnMuZmluZCgnLmMtdGFic19fY29udGVudCcpLFxyXG5cdFx0XHQkY29udGVudFRhYnNcdD0gJGNvbnRlbnQuY2hpbGRyZW4oKSxcclxuXHRcdFx0dGFiTGVuZ3RoXHQ9ICRuYXZJdGVtcy5sZW5ndGg7XHJcblxyXG5cdFx0JG5hdkxpc3QuZmluZCgnbGknKS5vbignY2xpY2snLCBmdW5jdGlvbiggZSApe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRpZiggISR0aGlzLmhhc0NsYXNzKCdpcy1hY3RpdmUnKSApIHtcclxuXHRcdFx0XHRfc2V0QWN0aXZlVGFiKCAkdGhpcy5kYXRhKCdpbmRleCcpICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHJcblx0XHR2YXIgX3NldEFjdGl2ZVRhYiA9IGZ1bmN0aW9uKCBpICkge1xyXG5cdFx0XHR2YXIgJGFjdGl2ZU5hdkl0ZW0gXHRcdD0gJG5hdkxpc3QuZmluZCgnW2RhdGEtaW5kZXg9XCInKyBpICsnXCJdJyksXHJcblx0XHRcdFx0JGFjdGl2ZUNvbnRlbnRUYWIgXHQ9ICRjb250ZW50LmZpbmQoJ1tkYXRhLWluZGV4PVwiJyArIGkgKyAnXCJdJyk7XHJcblxyXG5cdFx0XHQkbmF2TGlzdC5maW5kKCcuaXMtYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG5cdFx0XHQkY29udGVudC5maW5kKCcuaXMtYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG5cclxuXHRcdFx0JGFjdGl2ZU5hdkl0ZW0uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG5cdFx0XHQkYWN0aXZlQ29udGVudFRhYi5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRfYW5pbWF0ZUNvbnRlbnRIZWlnaHQoICRhY3RpdmVDb250ZW50VGFiICk7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIEB0b2RvIHBhc3MgYWN0aXZlIGNvbnRlbnQgZWxlbWVudCB0byBoZWxwZXJcclxuXHRcdHZhciBfYW5pbWF0ZUNvbnRlbnRIZWlnaHQgPSBmdW5jdGlvbiggZWwgKSB7XHJcblxyXG5cdFx0XHQkY29udGVudC5hbmltYXRlKHtcclxuXHRcdFx0XHQnaGVpZ2h0JzogZWwuaW5uZXJIZWlnaHQoKVxyXG5cdFx0XHR9LCAyMDApO1xyXG5cclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIF9zZXR1cFRhYkluZGV4ZXMgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdGZvciggdmFyIGkgPSAwOyBpIDwgdGFiTGVuZ3RoOyBpKysgKSB7XHJcblx0XHRcdFx0JG5hdkl0ZW1zLmVxKCBpICkuYXR0cignZGF0YS1pbmRleCcsIGkpO1xyXG5cdFx0XHRcdCRjb250ZW50VGFicy5lcSggaSApLmF0dHIoJ2RhdGEtaW5kZXgnLCBpKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgX2luaXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0X3NldHVwVGFiSW5kZXhlcygpO1xyXG5cclxuXHRcdFx0JG5hdkl0ZW1zLmZpcnN0KCkuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG5cdFx0XHQkY29udGVudFRhYnMuZmlyc3QoKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XHJcblx0XHR9O1xyXG5cdFx0X2luaXQoKTtcclxuXHR9KTtcdFxyXG4qL1x0XHJcblxyXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCMgSW5pdFxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSBcclxuXHRpZiggJHdpbmRvdy5Jc01vZGVybiApe1xyXG5cclxuXHR9XHJcblxyXG59KShqUXVlcnkpO1xyXG5cclxuLypcclxualF1ZXJ5KGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigkKXtcclxuXHR2YXIgJHRhYnNIYW5kbGUgPSAkKCcuanMtdGFicycpO1xyXG5cdFxyXG5cdCR0YWJzSGFuZGxlLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdHZhciAkdGFicyA9ICQodGhpcyksXHJcblx0XHRcdHRhYkl0ZW1zID0gJHRhYnMuZmluZCgnbmF2JyksXHJcblx0XHRcdHRhYkNvbnRlbnRXcmFwcGVyID0gJHRhYnMuZmluZCgnLmpzLXRhYnMtY29udGVudCcpLFxyXG5cdFx0XHR0YWJOYXZpZ2F0aW9uID0gJHRhYnMuZmluZCgnLmMtdGFic19fbmF2Jyk7XHJcblxyXG5cdFx0dGFiSXRlbXMub24oJ2NsaWNrJywgJ2EnLCBmdW5jdGlvbihldmVudCl7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHZhciBzZWxlY3RlZEl0ZW0gPSAkKHRoaXMpO1xyXG5cdFx0XHRpZiggIXNlbGVjdGVkSXRlbS5oYXNDbGFzcygnc2VsZWN0ZWQnKSApIHtcclxuXHRcdFx0XHR2YXIgc2VsZWN0ZWRUYWIgPSBzZWxlY3RlZEl0ZW0uZGF0YSgnY29udGVudCcpLFxyXG5cdFx0XHRcdFx0c2VsZWN0ZWRDb250ZW50ID0gdGFiQ29udGVudFdyYXBwZXIuZmluZCgnbGlbZGF0YS1jb250ZW50PVwiJytzZWxlY3RlZFRhYisnXCJdJyksXHJcblx0XHRcdFx0XHRzbGVjdGVkQ29udGVudEhlaWdodCA9IHNlbGVjdGVkQ29udGVudC5pbm5lckhlaWdodCgpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHRhYkl0ZW1zLmZpbmQoJ2Euc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHRcdFx0XHRzZWxlY3RlZEl0ZW0uYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblx0XHRcdFx0c2VsZWN0ZWRDb250ZW50LmFkZENsYXNzKCdzZWxlY3RlZCcpLnNpYmxpbmdzKCdsaScpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG5cdFx0XHRcdC8vYW5pbWF0ZSB0YWJDb250ZW50V3JhcHBlciBoZWlnaHQgd2hlbiBjb250ZW50IGNoYW5nZXMgXHJcblx0XHRcdFx0dGFiQ29udGVudFdyYXBwZXIuYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHQnaGVpZ2h0Jzogc2xlY3RlZENvbnRlbnRIZWlnaHRcclxuXHRcdFx0XHR9LCAyMDApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHQvL2hpZGUgdGhlIC5jZC10YWJzOjphZnRlciBlbGVtZW50IHdoZW4gdGFiYmVkIG5hdmlnYXRpb24gaGFzIHNjcm9sbGVkIHRvIHRoZSBlbmQgKG1vYmlsZSB2ZXJzaW9uKVxyXG5cdFx0Y2hlY2tTY3JvbGxpbmcodGFiTmF2aWdhdGlvbik7XHJcblx0XHR0YWJOYXZpZ2F0aW9uLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpeyBcclxuXHRcdFx0Y2hlY2tTY3JvbGxpbmcoJCh0aGlzKSk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHRcclxuXHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCl7XHJcblx0XHQkdGFic0hhbmRsZS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciAkdGFicyA9ICQodGhpcyk7XHJcblx0XHRcdGNoZWNrU2Nyb2xsaW5nKCAkdGFicy5maW5kKCduYXYnKSApO1xyXG5cdFx0XHQkdGFicy5maW5kKCcuY2QtdGFicy1jb250ZW50JykuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cdGZ1bmN0aW9uIGNoZWNrU2Nyb2xsaW5nKCR0YWJzKXtcclxuXHRcdHZhciB0b3RhbFRhYldpZHRoID0gcGFyc2VJbnQoJHRhYnMuY2hpbGRyZW4oJy5jZC10YWJzLW5hdmlnYXRpb24nKS53aWR0aCgpKSxcclxuXHRcdCBcdCR0YWJzVmlld3BvcnQgPSBwYXJzZUludCgkdGFicy53aWR0aCgpKTtcclxuXHRcdGlmKCAkdGFicy5zY3JvbGxMZWZ0KCkgPj0gdG90YWxUYWJXaWR0aCAtICR0YWJzVmlld3BvcnQpIHtcclxuXHRcdFx0JHRhYnMucGFyZW50KCcuY2QtdGFicycpLmFkZENsYXNzKCdpcy1lbmRlZCcpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JHRhYnMucGFyZW50KCcuY2QtdGFicycpLnJlbW92ZUNsYXNzKCdpcy1lbmRlZCcpO1xyXG5cdFx0fVxyXG5cdH1cclxufSk7XHJcbiovIl0sImZpbGUiOiJ0YWJzLmpzIn0=

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKXtcclxuXHQndXNlIHN0cmljdCc7XHJcblx0dmFyICR3aW5kb3cgPSB3aW5kb3csXHJcblx0XHQkaHRtbFx0PSAkKCdodG1sJyk7XHJcblxyXG5cdHZhciBlbmhhbmNlRWRnZUNhc2VCcm93c2VycyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdGlmKCAhTW9kZXJuaXpyLmNsYXNzbGlzdCApIHtcclxuXHRcdFx0JGh0bWwucmVtb3ZlQ2xhc3MoJ25vLWVuaGFuY2UnKS5hZGRDbGFzcygnZW5oYW5jZScpO1xyXG5cdFx0fVxyXG5cclxuXHR9O1xyXG5cclxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblx0IyBJbml0XHJcblxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG5cclxuXHRpZiggJHdpbmRvdy5Jc01vZGVybiApe1xyXG5cclxuXHRcdGVuaGFuY2VFZGdlQ2FzZUJyb3dzZXJzKCk7XHJcblx0XHQkd2luZG93LkhlYWRlci5pbml0KCk7XHJcblx0XHQkd2luZG93LlNtb290aFNjcm9sbC5pbml0KCk7XHJcblx0XHQkd2luZG93LlNlYXJjaC5pbml0KCk7XHJcblx0XHQkd2luZG93Lk1lbnUuaW5pdCgpO1xyXG5cdFx0JCgnLmpzLXRhYnMnKS50YWJzKCk7XHJcblxyXG5cdFx0Ly9NUS5pbml0KGJyZWFrcG9pbnRzKTtcclxuXHR9XHJcblxyXG59KShqUXVlcnkpO1xyXG4iXSwiZmlsZSI6Im1haW4uanMifQ==

//# sourceMappingURL=main.js.map
