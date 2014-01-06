'use strict';
var _ = require( 'underscore' );
module.exports = function( grunt ) {
	var config = {
		pkg: grunt.file.readJSON( 'package.json' )
	};

	config.sass = {
		dev: {
			files: {
				'css/soul.css': 'sass/soul.scss'
			},
			options: {
				style: 'expanded',
				sourcemap: true
			}
		},
		dist: {
			files: {
				'css/soul.min.css': 'sass/soul.scss'
			},
			options: {
				style: 'compressed',
				sourcemap: false
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
				report: 'gzip'
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

	// load all grunt tasks matching the `grunt-*` pattern
	require( 'load-grunt-tasks' )( grunt );

	grunt.registerTask( 'default', [ 'jshint', 'sass:dist', 'hogan', 'browserify:dist', 'uglify' ] );

};