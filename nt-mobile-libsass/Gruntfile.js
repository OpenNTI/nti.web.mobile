'use strict';

var mountFolder = function(connect, dir) {
	return connect.static(require('path').resolve(dir));
};

var webpackDistConfig = require('./webpack.dist.config.js'),
		webpackDevConfig = require('./webpack.config.js');

module.exports = function(grunt) {

	// Let *load-grunt-tasks* require everything
	require('load-grunt-tasks')(grunt);

	var pkgConfig = grunt.file.readJSON('package.json');

	grunt.initConfig({

		pkg: pkgConfig,

		webpack: {
			options: webpackDistConfig,

			dist: {
				cache: false
			}
		},

		'webpack-dev-server': {
			options: {
				port: 9000,
				webpack: webpackDevConfig,
				publicPath: '/',
				contentBase: './<%= pkg.src %>/'
			},

			start: {
				keepAlive: true
			}
		},

		connect: {
			options: {
				port: 9000
			},

			dist: {
				options: {
					keepalive: true,
					middleware: function(connect) {
						return [
						mountFolder(connect, pkgConfig.dist)
						];
					}
				}
			}
		},

		open: {
			options: {
				delay: 500
			},
			dev: {
				path: 'http://localhost:<%= connect.options.port %>/webpack-dev-server/'
			},
			dist: {
				path: 'http://localhost:<%= connect.options.port %>/'
			}
		},

		copy: {
			dist: {
				files: [
				// includes files within path
					{
						flatten: true,
						expand: true,
						src: ['<%= pkgConfig.src %>/*'],
						dest: '<%= pkgConfig.dist %>/',
						filter: 'isFile'
					},
					{
						flatten: true,
						expand: true,
						src: ['<%= pkgConfig.src %>/images/*'],
						dest: '<%= pkgConfig.dist %>/images/'
					}
				]
			}
		},

		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
					'<%= pkgConfig.dist %>'
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

		yuidoc: {
			compile: {
				name: '<%= pkg.name %>',
				description: '<%= pkg.description %>',
				version: '<%= pkg.version %>',
				// url: '<%= pkg.homepage %>',
				options: {
					paths: 'src/main/js/',
					themedir: 'node_modules/yuidoc-bootstrap-theme/',
					helpers: ['node_modules/yuidoc-bootstrap-theme/helpers/helpers.js'],
					outdir: 'docs/',
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

			docs: {
				files: ['src/main/**/*.js','src/main/**/*.jsx'],
				tasks: ['yuidoc:compile']
			}
		}
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');

	grunt.registerTask('build', ['sass','yuidoc']);
	grunt.registerTask('default', ['build', 'watch']);

	grunt.registerTask('serve', function(target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'open:dist', 'connect:dist']);
		}

		grunt.task.run([
			'sass',
			'yuidoc',
			'open:dev',
			'webpack-dev-server'
		]);
	});

	grunt.registerTask('test', ['karma']);

	grunt.registerTask('build', ['clean', 'sass', 'copy', 'webpack']);

	grunt.registerTask('default', []);

};
