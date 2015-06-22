/*eslint no-var: 0 strict: 0*/
'use strict';
var path = require('path');

var distWebPack = require('./webpack.dist.config.js');

var PROD = 'production';
var DEV = 'development';

module.exports = function(grunt) {
	// Let *load-grunt-tasks* require everything
	require('load-grunt-tasks')(grunt);

	var pkgConfig = grunt.file.readJSON('package.json');

	var env = /prod/i.test(grunt.option('environment')) ? PROD : DEV;
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
		distWebPack.forEach(function(e) { e.devtool = 'hidden-source-map'; });
		buildSteps.push('clean:maps');
	}

	pkgConfig.distSiteCSS = path.join(pkgConfig.dist, '/client/resources/css/sites/');

	grunt.initConfig({

		pkg: pkgConfig,

		webpack: {
			dist: distWebPack
		},

		execute: {
			dev: {
				src: '<%= pkg.src %>/../server/index.js'
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

			maps: ['<%= pkg.dist %>/**/*.map', '<%= pkg.dist %>/**/*.map.gz']
		},

		sass: {
			options: {
				sourceMap: true,
				outputStyle: 'compressed',
				includePaths: ['src/main/resources/vendor/foundation/scss']
			},
			dist: {
				files: {
					'src/main/resources/css/errorpage.css': 'src/main/resources/scss/errorpage.scss',
					'src/main/resources/css/app.css': 'src/main/resources/scss/app.scss',
					'src/main/resources/css/sites/platform.ou.edu/site.css': 'src/main/resources/scss/sites/platform.ou.edu/site.scss',
					'src/main/resources/css/sites/okstate.nextthought.com/site.css': 'src/main/resources/scss/sites/okstate.nextthought.com/site.scss'
				}
			}
		},


		eslint: {
			// options: {
			// 	quiet: true
			// },
			target: [
				'<%= pkg.src %>/js/**/*.js',
				'<%= pkg.src %>/js/**/*.jsx',
				'<%= pkg.src %>/../server/**/*.js',
				'<%= pkg.src %>/../test/**/*.js',
				'<%= pkg.src %>/../webpack-plugins/**/*.js',
				'*.js'
			]
		},

		symlink: {
			SiteCSSDirectories: {
				files: [
					{src: '<%= pkg.distSiteCSS %>/platform.ou.edu', dest: '<%= pkg.distSiteCSS %>/ou-alpha.nextthought.com'},
					{src: '<%= pkg.distSiteCSS %>/platform.ou.edu', dest: '<%= pkg.distSiteCSS %>/ou-test.nextthought.com'},
					{src: '<%= pkg.distSiteCSS %>/platform.ou.edu', dest: '<%= pkg.distSiteCSS %>/janux.ou.edu'},

					{src: '<%= pkg.distSiteCSS %>/okstate.nextthought.com', dest: '<%= pkg.distSiteCSS %>/okstate-alpha.nextthought.com'},
					{src: '<%= pkg.distSiteCSS %>/okstate.nextthought.com', dest: '<%= pkg.distSiteCSS %>/okstate-test.nextthought.com'},
					{src: '<%= pkg.distSiteCSS %>/okstate.nextthought.com', dest: '<%= pkg.distSiteCSS %>/learnonline.okstate.edu'}
				]
			}
		}
	});



	grunt.registerTask('docs', ['react', 'jsdoc']);
	grunt.registerTask('lint', ['eslint']);
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
			'eslint',
			'execute:dev'
		]);
	});
};
