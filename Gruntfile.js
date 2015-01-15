'use strict';
/* jshint -W101 */

var path = require('path');

var PROD = 'production';
var DEV = 'development';

module.exports = function(grunt) {
	// Let *load-grunt-tasks* require everything
	require('load-grunt-tasks')(grunt);

	var pkgConfig = grunt.file.readJSON('package.json');

	var env = /prod|uat/i.test(grunt.option('environment')) ? PROD : DEV;
	process.env.NODE_ENV = env;

	var buildSteps = [
		'clean:stage',
		'sass',
		'copy:stage',
		'webpack:dist',
		'clean:dist',
		'rename:StageToDist',
		'symlink'
	];

	if (env === PROD) {
		buildSteps.push('clean:maps');
	}

	pkgConfig.distSiteCSS = path.join(pkgConfig.dist, '/client/resources/css/sites/');

	grunt.initConfig({

		pkg: pkgConfig,

		webpack: {
			dist: require('./webpack.dist.config.js')
		},

		'webpack-dev-server': {//not setup yet, ignore for now.
			options: {
				webpack: require('./webpack.config.js')[0],
				publicPath: '/mobile/'
			},
			start: {
				watch: true,
				keepAlive: true,
				port: 8084,
				inline: true,
				contentBase: '',//__dirname + '/src/main/',
				webpack: {
					debug: true,
					entry: './src/main/js/index.js',
					output: {
						path: '/',
						publicPath: 'http://localhost:8084/mobile/',
						//publicPath: '/mobile/',
						filename: 'js/main.js'
					}
				}
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
			stage: {
				files: [
				// includes files within path
					{
						flatten: true,
						expand: true,
						src: ['<%= pkg.src %>/*'],
						dest: '<%= pkg.stage %>/client/',
						filter: 'isFile'
					},
					{
						cwd: '<%= pkg.src %>/resources/css/sites/',
						expand: true,
						filter: 'isFile',
						src: ['**'],
						dest: '<%= pkg.stage %>/client/resources/css/sites/'
					},
					{
						cwd: '<%= pkg.src %>/resources/images/',
						expand: true,
						filter: 'isFile',
						src: ['**', '!**/icons/**'],
						dest: '<%= pkg.stage %>/client/resources/images/'
					},
					{
						// flatten: true,
						cwd: '<%= pkg.src %>/widgets/',
						expand: true,
						filter: 'isFile',
						src: ['**/*.html'],
						dest: '<%= pkg.stage %>/widgets/'
					},
					{
	                    // flatten: true,
	                    cwd: '<%= pkg.src %>/../server/',
	                    expand: true,
	                    filter: 'isFile',
	                    src: ['**'],
	                    dest: '<%= pkg.stage %>/server/'
	                }
				]
			}
		},

		rename: {
			StageToDist: {
				src: '<%= pkg.stage %>',
				dest: '<%= pkg.dist %>'
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
			},

			stage: {
				files: [{
					dot: true,
					src: [
					'<%= pkg.stage %>'
					]
				}]
			},

			maps: ["<%= pkg.dist %>/**/*.map","<%= pkg.dist %>/**/*.map.gz"]
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
					'src/main/resources/css/app.css': 'src/main/resources/scss/app.scss',
					'src/main/resources/css/sites/platform.ou.edu/site.css': 'src/main/resources/scss/sites/platform.ou.edu/site.scss'
				}
			}
		},

		jshint: {
	        options: {
				jshintrc: true,
	            //reporter: require('jshint-log-reporter')
	            //reporterOutput: 'lint.log'
			},
	        files: [
				'<%= pkg.src %>/js/**/*.js',
				'<%= pkg.src %>/js/**/*.jsx',
				'<%= pkg.src %>/../server/**/*.js'
			]
	    },

		symlink: {
			SiteCSSDirectories: {
				files: [
			        {src: '<%= pkg.distSiteCSS %>/platform.ou.edu', dest: '<%= pkg.distSiteCSS %>/ou-alpha.nextthought.com'},
			        {src: '<%= pkg.distSiteCSS %>/platform.ou.edu', dest: '<%= pkg.distSiteCSS %>/ou-test.nextthought.com'},
			        {src: '<%= pkg.distSiteCSS %>/platform.ou.edu', dest: '<%= pkg.distSiteCSS %>/janux.ou.edu'}
				]
			}
		}
	});



	grunt.registerTask('docs',['react','jsdoc']);
	grunt.registerTask('test', ['karma']);
	grunt.registerTask('build', buildSteps);
	grunt.registerTask('default', ['serve']);

	grunt.registerTask('serve', function(target) {
		if (target === 'dist') {
			return grunt.task.run([
				'build',
				'execute:dist'
			]);
		}

		grunt.task.run([
			'sass',
			'jshint',
			'execute:dev'
		]);
	});
};
