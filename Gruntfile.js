'use strict';
var _ = require( 'underscore' );
module.exports = function( grunt ) {

	var config = {
		pkg: grunt.file.readJSON( 'package.json' )
	};

	// load all grunt tasks matching the `grunt-*` pattern
	require( 'load-grunt-tasks' )( grunt );

	config.sass = {
		dev: {
			files: {
				'css/soul.css': 'sass/soul.scss'
			},
			options: {
				sourceComments: 'map'
			}
		},
		dist: {
			files: {
				'css/soul.min.css': 'sass/soul.scss'
			}
		}
	};

	config.cssmin = {
		dist: {
			files: {
				'css/soul.min.css': ['css/soul.min.css'],
			},
			options: {
				report: 'min'
			}
		}
	};

	config.browserify = {
		dist: {
			src: [ 'app/app.js' ],
			dest: 'js/soul.js',
			options: {
				external: [ 'jQuery' ],
				debug: false
			}
		}
	};
	config.browserify.dev = _.clone( config.browserify.dist );
	config.browserify.dev.options = {
		external: [ 'jQuery' ],
		debug: true
	};

	config.hogan = {
		publish: {
			options: {
				prettify: true,
				defaultName: function( file ) {
					return file.replace( /^templates\//, '' ).replace( /\.mustache$/, '' ).toLowerCase();
				},
				commonJsWrapper: true
			},
			files:{
				'app/compiled-templates.js': [ 'templates/**/*.mustache' ]
			}
		}
	};

	config.uglify = {
		dist: {
			options: {
				mangle: true,
				report: 'min'
			},
			files: {
				'js/soul.min.js': [ 'js/soul.js' ]
			}
		}
	};

	config.jshint = {
		options: grunt.file.readJSON( '.jshintrc' ),
		grunt: {
			src: [ 'Gruntfile.js' ]
		},
		dev: {
			src: [ 'app/**/*.js', '!app/compiled-templates.js', '!app/date-parse.js' ]
		}
	};

	config.watch = {
		sass: {
			files: [ 'sass/**/*.scss' ],
			tasks: [ 'sass:dev' ]
		},
		jshint: {
			files: config.jshint.dev.src,
			tasks: [ 'jshint:dev' ]
		},
		templates: {
			files: [ 'templates/**/*.mustache' ],
			tasks: [ 'hogan', 'browserify:dev' ]
		},
		browserify: {
			files: [ 'app/**/*.js' ],
			tasks: [ 'browserify:dev' ]
		},
		// We livereload here but not in sass so that a hard refresh doesn't happen
		css: {
			options: { livereload: true },
			files: [ 'css/**/*.css' ],
			tasks: []
		},
		js: {
			options: { livereload: true },
			files: [ 'js/**/*.js' ],
			tasks: []
		},
		php: {
			options: { livereload: true },
			files: [ '**/*.php' ]
		}
	};

	config.notify_hooks = {
		options: {
			max_jshint_notifications: 5
		}
	};

	grunt.initConfig( config );

	grunt.registerTask( 'default', [ 'jshint', 'sass:dist', 'cssmin:dist', 'hogan', 'browserify:dist', 'uglify' ] );
	grunt.registerTask( 'init', [ 'composer:install', 'jshint', 'sass', 'hogan', 'browserify', 'uglify' ] );
	grunt.registerTask( 'css', [ 'sass', 'cssmin' ] );

};