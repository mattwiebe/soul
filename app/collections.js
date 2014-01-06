'use strict';
var Backbone = require( 'Backbone' ),
	settings = window._Soul,
	Models = require( './models' ),
	bus = require( './bus' );

exports.Posts = Backbone.Collection.extend({
	page: 1,
	url: function() {
		return settings.urlRoot + '/posts?page=' + this.page;
	},
	initialize: function( args ) {
		if ( args.page ) {
			this.page = args.page;
		}
		this.on( 'sync', this.onSync, this );
	},
	onSync: function( collection, data, BBXhr ) {
		var totalPages = parseInt( BBXhr.xhr.getResponseHeader( 'X-WP-TotalPages' ), 10 );
		bus.trigger( 'totalPages', totalPages );
	}
});

exports.Single = Backbone.Collection.extend({
	url: settings.urlRoot + '/posts',
	model: Models.Post
});

exports.Comments = Backbone.Collection.extend({
	initialize: function( models, options ) {
		this.post = options.post;
	},
	url: function() {
		return settings.urlRoot + '/posts/' + this.post + '/comments';
	},
	model: Models.Comment
});