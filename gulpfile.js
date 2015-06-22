/* eslint no-var: 0 strict: 0*/
'use strict';
var gulp = require('gulp');
var merge = require('merge-stream');
var path = require('path');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
// var argv = require('yargs');
// var gulpif = require('gulp-if');
var symlink = require('gulp-symlink');
var pkgConfig = require('./package.json');
var del = require('del');
var eslint = require('gulp-eslint');

pkgConfig.distSiteCSS = path.join(pkgConfig.dist, '/client/resources/css/sites/');

gulp.task('css', function() {
	return gulp.src('src/main/resources/scss/app.scss')
		.pipe(sourcemaps.init()) // init sourcemaps before invoking sass
		.pipe(sass({ // compile scscc to css
			includePaths: ['src/main/resources/vendor/foundation/scss/'],
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer()) // add browser-specific prefixes (e.g. -webkit)
		.pipe(sourcemaps.write('./')) // write sourcemaps to the same directory as the output.
		.pipe(gulp.dest('src/main/resources/css'));
});

gulp.task('watch', function() {
	return gulp.watch('src/main/resources/scss/**/*.scss', ['css']);
});

gulp.task('clean:dist', function(cb) {
	if (pkgConfig && pkgConfig.dist) {
		del([pkgConfig.stage], cb);
	}
});

gulp.task('clean:stage', function(cb) {
	if (pkgConfig && pkgConfig.stage) {
		del([pkgConfig.stage], cb);
	}
});

gulp.task('clean:maps', function(cb) {
	if (pkgConfig && pkgConfig.dist) {
		del([pkgConfig.dist + '/**/*.{map,map.gz}'], cb);
	}
});

gulp.task('lint', function() {
	return gulp.src([
		pkgConfig.src + '/js/**/*.{js,jsx}',
		pkgConfig.src + '/../server/**/*.js',
		pkgConfig.src + '/../test/**/*.js',
		pkgConfig.src + '/../webpack-plugins/**/*.js'
	])
	.pipe(eslint())
	.pipe(eslint.format());
});

gulp.task('symlink', function() {
	console.log(pkgConfig.distSiteCSS);
	var ou = gulp.src(path.join(pkgConfig.distSiteCSS, 'platform.ou.edu'))
		.pipe(symlink(path.join(pkgConfig.distSiteCSS, 'ou-alpha.nextthought.com')))
		.pipe(symlink(path.join(pkgConfig.distSiteCSS, 'ou-test.nextthought.com')))
		.pipe(symlink(path.join(pkgConfig.distSiteCSS, 'janux.ou.edu')));

	var osu = gulp.src(path.join(pkgConfig.distSiteCSS, 'okstate.nextthought.com'))
		.pipe(symlink(path.join(pkgConfig.distSiteCSS, 'okstate-alpha.nextthought.com')))
		.pipe(symlink(path.join(pkgConfig.distSiteCSS, 'okstate-test.nextthought.com')))
		.pipe(symlink(path.join(pkgConfig.distSiteCSS, 'learnonline.okstate.edu')));

	return merge(ou, osu);
});
