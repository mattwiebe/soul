'use strict';
var	dateParse = require( './date-parse' ),
	parseable_dates = [ 'date', 'modified' ],
	settings = window._Soul,
	Post, User;

exports.User = User = Backbone.Model.extend({
	urlRoot: settings.urlRoot + '/users',
	avatar: function ( size ) {
		size = size || 64;
		return this.get( 'avatar' ) + '&s=' + size;
	}
});

exports.Post = Post = Backbone.Model.extend({
	urlRoot: settings.urlRoot + '/posts',
	idAttribute: 'ID',
	parse: function( response ) {
		// Parse dates into native Date objects
		_.each( parseable_dates, function ( key ) {
			if ( ! ( key in response ) ) {
				return;
			}
			response[ key ] = new Date( dateParse( response[ key ] ) );
		});

		// Remove GMT dates in favour of our native Date objects
		delete response.date_gmt;
		delete response.modified_gmt;

		// Parse the author into a User object
		response.author = new User( response.author );

		return response;
	},

	toJSON: function () {
		var attributes = _.clone( this.attributes );
		// Serialize Date objects back into 8601 strings
		_.each( parseable_dates, function ( key ) {
			attributes[ key ] = attributes[ key ].toISOString();
		});

		return attributes;
	}
});


exports.Comment = Backbone.Model.extend({
	idAttribute: 'ID',
	url: function() {
		return settings.urlRoot + '/posts/' + this.get( 'post' ) + '/' + this.id;
	},
	parse: function( response ) {
		delete response.date_gmt;
		response.date = new Date( dateParse( response.date ) );
		return response;
	},
	toJSON: function() {
		var attributes = _.clone( this.attributes );
		attributes.date = attributes.date.toISOString();
		return attributes;
	}
});
