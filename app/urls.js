'use strict';
var settings = window._Soul,
	bus = require( './bus' ),
	homeRE = new RegExp( '^' + settings.home ),
	pageRE = /^page\/(\d+)\/?$/,
	maxPages = 1;

bus.on( 'totalPages', function( totalPages ){
	maxPages = totalPages;
});

module.exports = {
	currentPage: function() {
		var path = location.href.replace( homeRE, '' ),
			results = pageRE.exec( path );

		if ( results ) {
			return parseInt( results[1], 10 );
		}
		return 1;
	},
	paginationUrls: function() {
		return {
			'prevpage': this.prevPageUrl(),
			'nextpage': this.nextPageUrl()
		};
	},
	pageUrl: function( page, context ) {
		var url = this.homeUrl( context );
		if ( page === 1 ) {
			return url;
		}
		return url + 'page/' + page + '/';
	},
	prevPageUrl: function() {
		if ( this.currentPage() > 1 ) {
			return this.pageUrl( this.currentPage() - 1 );
		}
		return false;
	},
	nextPageUrl: function() {
		if ( this.currentPage() < maxPages ) { // todo figure max pages
			return this.pageUrl( this.currentPage() + 1 );
		}
		return false;
	},
	homeUrl: function( path ) {
		return settings.home + ( path || '' );
	}
};