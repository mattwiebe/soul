'use strict';
var Templates = require( './templates' ),
	Collections = require( './collections' ),
	urls = require( './urls' ),
	Post, Posts, Comments, Comment, MasterView;

MasterView = Backbone.View.extend({
	parent: '#main',
	template: 'article',
	subviews: [],
	initialize: function() {
		if ( this.parent ) {
			$( this.parent ).empty().append( this.el );
		}
		if ( this.collection ) {
			this.listenTo( this.collection, 'sync', this.render );
		} else {
			this.listenTo( this.model, 'change', this.render );
		}
	},
	cleanup: function() {
		this.$el.empty();
		_.each( this.subviews, function( view ){
			view.remove();
		});
		this.subviews = [];
	},
	add: function( view ) {
		this.$el.append( view.el );
		this.subviews.push( view );
	},
	render: function() {
		//this.cleanup();
		if ( this.collection ) {
			this.renderCollection();
		} else {
			this.renderModel();
		}
		this.trigger( 'content_rendored' );

		return this;
	},
	renderCollection: function() {
		this.collection.each( function( model ){
			this.add( new this.SubView( { model: model } ).render() );
		}, this );
	},
	renderModel: function() {
		this.setElement( $( Templates[ this.template ].render( this.model.toJSON(), Templates ) ) );
		this.trigger( 'content_rendored' );
	},
	partial: function( name, data ) {
		data = data || {};
		$( Templates[ name ].render( data, Templates ) ).appendTo( this.el );
		this.trigger( 'content_rendored' );
	}
});

exports.Post = Post = MasterView.extend({
	parent: false,
	template: 'article'
});

exports.Posts = Posts = MasterView.extend({
	SubView: Post,
	render: function() {
		this.renderCollection();
		this.partial( 'nav', urls.paginationUrls() );
		return this;
	}
});

Comment = MasterView.extend({
	parent: false,
	template: 'comment'
});

Comments = MasterView.extend({
	id: 'comments',
	parent: false,
	SubView: Comment
});

exports.Single = MasterView.extend({
	initialize: function() {
		MasterView.prototype.initialize.apply( this );
		this.comments = new Collections.Comments( [], { post: this.model.id } );
		this.comments.fetch();
	},
	render: function(){
		this.add( new Post({ model: this.model }).render() );
		this.partial( 'comments/before' );
		this.add( new Comments({ collection: this.comments }).render() );
		return this;
	}
});



