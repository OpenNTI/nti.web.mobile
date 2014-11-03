'use strict';

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

	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-symlink');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-react');
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.registerTask('docs',['react','jsdoc']);

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

	grunt.registerTask('build', ['clean', 'sass', 'copy', 'symlink', 'webpack:dist']);

	grunt.registerTask('default', ['serve']);

};
