'use strict';
var settings = window._Soul,
	bus = require( './bus' ),
	moment = require( 'moment' ),
	timeFix = function(){
		$('.post_date').each(function(a){
			var t = moment( $(this).text() );
			$(this).text( t.calendar() );
		});
	};

bus.on('after_render', timeFix);
