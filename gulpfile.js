var gulp = require('gulp');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('css', function() {
	return gulp.src('src/main/resources/scss/app.scss')
		.pipe(sourcemaps.init()) // init sourcemaps before invoking sass
		.pipe(sass({ // compile scscc to css
			includePaths: ['src/main/resources/vendor/foundation/scss/']
		}).on('error', sass.logError))
		.pipe(autoprefixer()) // add browser-specific prefixes (e.g. -webkit)
		.pipe(sourcemaps.write('./')) // write sourcemaps to the same directory as the output.
		.pipe(gulp.dest('src/main/resources/css'))
});
