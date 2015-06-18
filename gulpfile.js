var gulp = require('gulp');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('css', function() {
	return gulp.src('src/main/resources/scss/app.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: ['src/main/resources/vendor/foundation/scss/']
		}).on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('src/main/resources/css'))
});
