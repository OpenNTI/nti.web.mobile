'use strict';

var webpackDistConfig = require('./webpack.dist.config.js');
var webpackDevConfig = require('./webpack.config.js');

module.exports = function(grunt) {
	// Let *load-grunt-tasks* require everything
	require('load-grunt-tasks')(grunt);

	var pkgConfig = grunt.file.readJSON('package.json');

	grunt.initConfig({

		pkg: pkgConfig,

		webpack: {
			dist: webpackDistConfig,
            dev: webpackDevConfig
		},

		express: {
            options: {
                // Override defaults here
                port: 9000,
                background: false,
                script: '<%= pkg.dist %>/server/index.js'
            },
            dev: {
                options: {
                    debug: true,
					script: '<%= pkg.src %>/../server/index.js',
                    node_env: 'development'
                }
            },
            dist: {
                options: {
                    debug: false,
                    node_env: 'production'
                }
            }
        },

		// open: {
		// 	options: {
		// 		delay: 500
		// 	},
		// 	dev: {
		// 		path: 'http://localhost:<%= express.options.port %>/mobile/'
		// 	},
		// 	dist: {
		// 		path: 'http://localhost:<%= express.options.port %>/mobile/'
		// 	}
		// },

		karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },

		copy: {
			dist: {
				files: [
				// includes files within path
					{
						flatten: true,
						expand: true,
						src: ['<%= pkg.src %>/*'],
						dest: '<%= pkg.dist %>/client/',
						filter: 'isFile'
					},
					// {
					// 	cwd: '<%= pkg.src %>/resources/',
					// 	expand: true,
					// 	src: [
					// 		'**/*.js',
					// 		'**/*.css',
					// 		'**/*.map'
					// 	],
					// 	dest: '<%= pkg.dist %>/client/resources/',
					// 	filter: 'isFile'
					// },
					{
						cwd: '<%= pkg.src %>/resources/images/',
						expand: true,
						filter: 'isFile',
						src: ['**'],
						dest: '<%= pkg.dist %>/client/resources/images/'
					},
					{
	                    // flatten: true,
	                    cwd: '<%= pkg.src %>/../server/',
	                    expand: true,
	                    filter: 'isFile',
	                    src: ['**'],
	                    dest: '<%= pkg.dist %>/server/'
	                }
				]
			}
		},

		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
					'<%= pkg.dist %>'
					]
				}]
			}
		},

		sass: {
			options: {
				includePaths: ['src/main/resources/vendor/foundation/scss']
			},
			dist: {
				options: {
					outputStyle: 'compressed'
				},
				files: {
					'src/main/resources/css/app.css': 'src/main/resources/scss/app.scss'
				}
			}
		},

		reactjsx: {
			docs: {
				files: [{
					expand: true,
					src: [
						'<%= pkg.src %>/js/**/*.jsx',
						'<%= pkg.src %>/js/**/*.js'
					],
					dest: '<%= pkg.jsDocSrc %>',
					ext: '.js'
				}]
			},
		},

		jsdoc: {
			dist: {
				src: ['<%= pkg.jsDocSrc %>/src/main/js/**/*.js'],
				dest: '<%= pkg.jsDocDest %>/jsdoc'
			}
		},

		yuidoc: {
			compile: {
				name: '<%= pkg.name %>',
				description: '<%= pkg.description %>',
				version: '<%= pkg.version %>',
				// url: '<%= pkg.homepage %>',
				options: {
					paths: '<%= pkg.jsDocSrc %>/src/main/js/',
					themedir: 'node_modules/yuidoc-bootstrap-theme/',
					helpers: ['node_modules/yuidoc-bootstrap-theme/helpers/helpers.js'],
					outdir: '<%= pkg.jsDocDest %>/yuidoc/',
					extension: '.js,.jsx'
				}
			}
		},

		watch: {
			grunt: { files: ['Gruntfile.js'] },

			sass: {
				files: 'src/main/resources/**/*.scss',
				tasks: ['sass']
			},

			reactjsx: {
				files: ['<%= pkg.src %>/js/**/*.js','<%= pkg.src %>/js/**/*.jsx'],
				tasks: ['reactjsx:docs']
			},

			docs: {
				files: ['<%= pkg.jsDocSrc %>/src/main/js/**/*.js'],
				tasks: ['jsdoc:dist']
			}
		}
	});

	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-reactjsx');
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.registerTask('docs',['reactjsx','jsdoc']);

	grunt.registerTask('serve', function(target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'express:dist']);
		}

		grunt.task.run([
			//'build',
			'sass',
			//'yuidoc',
			'express:dev'
		]);
	});

	grunt.registerTask('test', ['karma']);

	grunt.registerTask('build', ['clean', 'sass', 'copy', 'webpack:dist']);

	grunt.registerTask('default', ['serve']);

};
