'use strict';
var	bus = require( './bus' ),
	homeRe = new RegExp( '^' + window._Soul.home );

module.exports = new ( Backbone.Router.extend({
	routes: {
		'': 'index',
		'page/:page/': 'index',
		'search/:query/': 'search',
		':ID/:slug/': 'single',
	},
	index: function( page ) {
		page = page || 1;
		bus.trigger( 'nav:posts', {
			page: page
		});
	},
	single: function( ID, slug ) {
		bus.trigger( 'nav:post', {
			ID: ID,
			slug: slug
		} );
	},
	/**
	 * Check if a URL matches one of our routes.
	 * @param  {[type]} url [description]
	 * @return {[type]}     [description]
	 */
	isRoute: function( url ) {
		var route = url.replace( homeRe, '' );
		return _.any( Backbone.history.handlers, function( handler ){
			if ( handler.route.test( route ) ) {
				return true;
			}
		});
	}
}) )();