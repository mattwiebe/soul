'use strict';
var Backbone = window.Backbone = require( 'backbone' ),
	Models = require( './models' ),
	Collections = require( './collections' ),
	Views = require( './views' ),
	_ = require( 'underscore' ),
	timefix = require( './timefix' ),
	settings = window._Soul,
	App;

// help backbone not choke
window.$ = Backbone.$ = window.jQuery;

App = _.extend({
	internalRE: new RegExp( '^' + settings.home ),
	model: null,
	collection: null,
	view: null,
	settings: settings,
	router: require( './router' ),
	bus: require( './bus' ),
	events: {
		'nav:posts': 'posts',
		'nav:post' : 'post'
	},
	initialize: function() {
		this.listenTo( this.bus, 'all', this.dispatch );
	},
	dispatch: function( event ) {
		if ( this.events[ event ] ) {
			this[ this.events[ event ] ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		}
	},
	posts: function( args ) {
		this.cleanup();
		this.collection = new Collections.Posts( args );
		this.view = new Views.Posts({ collection: this.collection });
		this.collection.fetch();
	},
	post: function( args ) {
		this.cleanup();
		this.model = new Models.Post({ ID: args.ID });
		this.view = new Views.Single({ model: this.model });
		this.model.fetch();
	},
	cleanup: function() {
		if ( this.view ) {
			this.view.remove();
			this.view = null;
		}
		if ( this.collection ) {
			this.collection.reset();
			this.collection = null;
		}
	},
	start: function() {
		Backbone.history.start( {
			pushState: true,
			root: this.settings.root,
			//silent: true
		});

		// listen for links
		$( '#page' ).on( 'click.soul', 'a', _.bind( this.maybeInternal, this ) );
	},
	currentPath: function() {
		var toReplace = new RegExp( '^' + this.settings.root );
		return location.pathname.replace( toReplace, '' );
	},
	maybeInternal: function( event ) {
		event.preventDefault();
		var url = $( event.target ).attr( 'href' );
		if ( this.internalRE.test( url ) && this.router.isRoute( url ) ) {
			this.router.navigate( url.replace( this.internalRE, '' ), { trigger: true, foo: 'bar' } );
		} else {
			window.location = url;
		}
	}
}, Backbone.Events );

App.initialize();

jQuery( document ).ready( _.bind( App.start, App ) );

// expose the App globally
window.Soul = App;