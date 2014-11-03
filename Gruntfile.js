'use strict';
/* jshint -W101 */

var webpackDistConfig = require('./webpack.dist.config.js');
var webpackDevConfig = require('./webpack.config.js');

var path = require('path');

module.exports = function(grunt) {
	// Let *load-grunt-tasks* require everything
	require('load-grunt-tasks')(grunt);

	var pkgConfig = grunt.file.readJSON('package.json');

	pkgConfig.distSiteCSS = path.join(pkgConfig.dist, '/client/resources/css/sites/');

	grunt.initConfig({

		pkg: pkgConfig,

		webpack: {
			dist: webpackDistConfig,
            dev: webpackDevConfig
		},

		env: {
			dist: {
				NODE_ENV: 'production'
			}
		},

		execute: {
            dev: {
				src: '<%= pkg.src %>/../server/index.js',
            },
            dist: {

                src: '<%= pkg.dist %>/server/index.js'
            }
        },


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
					{
						cwd: '<%= pkg.src %>/resources/css/sites/',
						expand: true,
						filter: 'isFile',
						src: ['**'],
						dest: '<%= pkg.distSiteCSS %>'
					},
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
					//'src/main/resources/css/app.css': 'src/main/resources/scss/app.scss',
					'src/main/resources/css/sites/platform.ou.edu/site.css': 'src/main/resources/scss/sites/platform.ou.edu/site.scss'
				}
			}
		},

		react: {
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
		},

		jshint: {
	        options: {
				force: true,
				jshintrc: true,
	            reporter: require('jshint-log-reporter')
	            //reporterOutput: 'lint.log'
			},
	        files: [
				'<%= pkg.src %>/js/**/*.js',
				'<%= pkg.src %>/js/**/*.jsx',
				'<%= pkg.src %>/../server/**/*.js'
			]
	    },

		symlink: {
			explicit: {
				files: [
			        {src: '<%= pkg.distSiteCSS %>/platform.ou.edu', dest: '<%= pkg.distSiteCSS %>/ou-alpha.nextthought.com'},
			        {src: '<%= pkg.distSiteCSS %>/platform.ou.edu', dest: '<%= pkg.distSiteCSS %>/ou-test.nextthought.com'},
			        {src: '<%= pkg.distSiteCSS %>/platform.ou.edu', dest: '<%= pkg.distSiteCSS %>/janux.ou.edu'}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-symlink');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-execute');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-jsxhint');
	grunt.loadNpmTasks('grunt-react');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('docs',['react','jsdoc']);

	grunt.registerTask('serve', function(target) {
		if (target === 'dist') {
			return grunt.task.run([
				'build',
				'env:dist',
				'execute:dist'
			]);
		}

		grunt.task.run([
			'sass',
			'jshint',
			'execute:dev'
		]);
	});

	grunt.registerTask('test', ['karma']);

	grunt.registerTask('build', ['clean', 'sass', 'copy', 'symlink', 'webpack:dist']);

	grunt.registerTask('default', ['serve']);

};
