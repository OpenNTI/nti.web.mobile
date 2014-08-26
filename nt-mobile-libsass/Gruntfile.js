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

		open: {
			options: {
				delay: 500
			},
			dev: {
				path: 'http://localhost:<%= connect.options.port %>/'
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
						src: ['<%= pkg.src %>/*'],
						dest: '<%= pkg.dist %>/',
						filter: 'isFile'
					},
					{
						flatten: true,
						expand: true,
						src: ['<%= pkg.src %>/images/*'],
						dest: '<%= pkg.dist %>/images/'
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

	grunt.registerTask('build', ['sass','yuidoc']);
	grunt.registerTask('default', ['build', 'watch']);
	grunt.registerTask('docs',['reactjsx','jsdoc'])

	grunt.registerTask('serve', function(target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'open:dist', 'express:dist']);
		}

		grunt.task.run([
			'build',
			'sass',
			'yuidoc',
			'open:dev',
			//'webpack-dev-server'
			'express:dev'
		]);
	});

	grunt.registerTask('test', ['karma']);

	grunt.registerTask('build', ['clean', 'sass', 'copy', 'webpack']);

	grunt.registerTask('default', []);

};
