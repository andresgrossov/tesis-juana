/*
	Helios by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var settings = {

		// Carousels
			carousels: {
				speed: 4,
				fadeIn: true,
				fadeDelay: 250
			},

	};

	skel.breakpoints({
		wide: '(max-width: 1680px)',
		normal: '(max-width: 1280px)',
		narrow: '(max-width: 960px)',
		narrower: '(max-width: 840px)',
		mobile: '(max-width: 736px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				$body.removeClass('is-loading');
			});

		// CSS polyfills (IE<9).
			if (skel.vars.IEVersion < 9)
				$(':last-child').addClass('last-child');

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on mobile.
			skel.on('+mobile -mobile', function() {
				$.prioritize(
					'.important\\28 mobile\\29',
					skel.breakpoint('mobile').active
				);
			});

		// Dropdowns.
			$('#nav > ul').dropotron({
				mode: 'fade',
				speed: 350,
				noOpenerFade: true,
				alignment: 'center'
			});

		// Scrolly links.
			$('.scrolly').scrolly();

		// Off-Canvas Navigation.

			// Navigation Button.
				$(
					'<div id="navButton">' +
						'<a href="#navPanel" class="toggle"></a>' +
					'</div>'
				)
					.appendTo($body);

			// Navigation Panel.
				$(
					'<div id="navPanel">' +
						'<nav>' +
							$('#nav').navList() +
						'</nav>' +
					'</div>'
				)
					.appendTo($body)
					.panel({
						delay: 500,
						hideOnClick: true,
						hideOnSwipe: true,
						resetScroll: true,
						resetForms: true,
						target: $body,
						visibleClass: 'navPanel-visible'
					});

			// Fix: Remove navPanel transitions on WP<10 (poor/buggy performance).
				if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
					$('#navButton, #navPanel, #page-wrapper')
						.css('transition', 'none');

		// Carousels.
			$('.carousel').each(function() {

				var	$t = $(this),
					$forward = $('<span class="forward"></span>'),
					$backward = $('<span class="backward"></span>'),
					$reel = $t.children('.reel'),
					$items = $reel.children('article');

				var	pos = 0,
					leftLimit,
					rightLimit,
					itemWidth,
					reelWidth,
					timerId;

				// Items.
					if (settings.carousels.fadeIn) {

						$items.addClass('loading');

						$t.onVisible(function() {
							var	timerId,
								limit = $items.length - Math.ceil($window.width() / itemWidth);

							timerId = window.setInterval(function() {
								var x = $items.filter('.loading'), xf = x.first();

								if (x.length <= limit) {

									window.clearInterval(timerId);
									$items.removeClass('loading');
									return;

								}

								if (skel.vars.IEVersion < 10) {

									xf.fadeTo(750, 1.0);
									window.setTimeout(function() {
										xf.removeClass('loading');
									}, 50);

								}
								else
									xf.removeClass('loading');

							}, settings.carousels.fadeDelay);
						}, 50);
					}

				// Main.
					$t._update = function() {
						pos = 0;
						rightLimit = (-1 * reelWidth) + $window.width();
						leftLimit = 0;
						$t._updatePos();
					};

					if (skel.vars.IEVersion < 9)
						$t._updatePos = function() { $reel.css('left', pos); };
					else
						$t._updatePos = function() { $reel.css('transform', 'translate(' + pos + 'px, 0)'); };

				// Forward.
					$forward
						.appendTo($t)
						.hide()
						.mouseenter(function(e) {
							timerId = window.setInterval(function() {
								pos -= settings.carousels.speed;

								if (pos <= rightLimit)
								{
									window.clearInterval(timerId);
									pos = rightLimit;
								}

								$t._updatePos();
							}, 10);
						})
						.mouseleave(function(e) {
							window.clearInterval(timerId);
						});

				// Backward.
					$backward
						.appendTo($t)
						.hide()
						.mouseenter(function(e) {
							timerId = window.setInterval(function() {
								pos += settings.carousels.speed;

								if (pos >= leftLimit) {

									window.clearInterval(timerId);
									pos = leftLimit;

								}

								$t._updatePos();
							}, 10);
						})
						.mouseleave(function(e) {
							window.clearInterval(timerId);
						});

				// Init.
					$window.load(function() {

						reelWidth = $reel[0].scrollWidth;

						skel.on('change', function() {

							if (skel.vars.touch) {

								$reel
									.css('overflow-y', 'hidden')
									.css('overflow-x', 'scroll')
									.scrollLeft(0);
								$forward.hide();
								$backward.hide();

							}
							else {

								$reel
									.css('overflow', 'visible')
									.scrollLeft(0);
								$forward.show();
								$backward.show();

							}

							$t._update();

						});

						// // Find all YouTube videos
						// var $allVideos = $("iframe[src^='http://www.youtube.com']"),
						//
						//     // The element that is fluid width
						//     $fluidEl = $("body");
						//
						// // Figure out and save aspect ratio for each video
						// $allVideos.each(function() {
						//
						//   $(this)
						//     .data('aspectRatio', this.height / this.width)
						//
						//     // and remove the hard coded width/height
						//     .removeAttr('height')
						//     .removeAttr('width');
						//
						// });

						$window.resize(function() {
							reelWidth = $reel[0].scrollWidth;
							$t._update();

							// var newWidth = $fluidEl.width();
							//
							// // Resize all videos according to their own aspect ratio
							// $allVideos.each(function() {
							//
							// 	var $el = $(this);
							// 	$el
							// 		.width(newWidth)
							// 		.height(newWidth * $el.data('aspectRatio'));
							//
							// });

						}).trigger('resize');

					});

			});

	});

})(jQuery);

var contactFrom = document.getElementById('contact-form');
var contactSuccess = document.getElementById('contact-success');
var contactError = document.getElementById('contact-error');
var sendBtn = document.getElementById('send-button');
var onMessageComplete = function(error) {
	sendBtn.disabled = false;
	if (error) {
		contactError.innerHTML = 'Lo sentimos, el mensaje no pudo ser enviado. Intenta nuevamente.';
	} else {
		contactSuccess.innerHTML = "Tu historia ha sido registrada exitosamente.";
		// hide the form
		contactFrom.style.display = 'none';
	}
};

function callFirebase(formObject) {
	var name = formObject.name.value;
	var country = formObject.country.value;
	var city = formObject.city.value;
	var message = formObject.message.value;
	var email = formObject.email.value;
	var userId = email.split('@')[0].replace('.', '');

	console.log(name + "-" + country + "-" + city + "-" + message + "-" + email + "-" + userId);

  firebase.database().ref('contactos/' + userId).set({
		nombre: name,
		pais: country,
		ciudad: city,
		historia: message,
		correo: email,
		llave: userId
  }, onMessageComplete);
	sendBtn.disabled = true;
	return false;
}

function addedContacto(contacto) {
	listaContactos.push(contacto.val());
  var template = $('#contactos-template').html();
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = Mustache.render(template, {contactos: listaContactos});
  $('#historias-contactos').html(rendered);
}

function removedContacto(contacto) {
	var indexOfContacto = findWithAttr(listaContactos, 'llave', contacto.key)
	listaContactos.splice(indexOfContacto, 1);
  var template = $('#contactos-template').html();
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = Mustache.render(template, {contactos: listaContactos});
  $('#historias-contactos').html(rendered);
}

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
}


var amountScrolled = 300;

$(window).scroll(function() {
	if ( $(window).scrollTop() > amountScrolled ) {
		$('a.back-to-top').fadeIn('slow');
	} else {
		$('a.back-to-top').fadeOut('slow');
	}
});

$('a.back-to-top').click(function() {
	$('html, body').animate({
		scrollTop: 0
	}, 700);
	return false;
});

//on click show the hider div and the message
function mostrarFormularioContacto () {
		$("#hider").fadeIn("slow");
		$('#popup_box').fadeIn("slow");
}

$(document).ready(function () {
//hide hider and popup_box
$("#hider").hide();
$("#popup_box").hide();

//on click hide the message and the
$("#buttonClose").click(function () {

		$("#hider").fadeOut("slow");
		$('#popup_box').fadeOut("slow");
});

});


// //Callback functions
// var error = function (err, response, body) {
// 		console.log('ERROR [%s]', err);
// };
// var success = function (data) {
// 		console.log('Data [%s]', data);
// };
//
// var Twitter = require('twitter-js-client').Twitter;
//
// //Get this data from your twitter apps dashboard
// var config = {
// 		"consumerKey": "OERelJeeYlijAaHqCcrVXJSzx",
// 		"consumerSecret": "	Ty5Bv1suapwGaz5swnqiE6DfXOVJm303ZDnH6KEwLjquMoWbLD",
// 		"accessToken": "384465876-QzPJVAhdchryl0kmEMMMlC4xhPBLe5T7AS2HBmlk",
// 		"accessTokenSecret": "RmgRcjx33kyco1sLCmmU3WOSFH1mKLNCvcHI246d3ddGR",
// 		"callBackUrl": ""
// }
//
// var twitter = new Twitter(config);
//
// var timeline = twitter.getUserTimeline({ screen_name: 'andresgrossov', count: '10'}, error, success);
// console.log("timeline: " + timeline);
