var changed    = require('gulp-changed');
var gulp       = require('gulp');
var imagemin   = require('gulp-imagemin');

gulp.task('images', function() {
	var dest = './i';

	return gulp.src('./source/i/**')
		.pipe(changed(dest)) // Ignore unchanged files
		.pipe(imagemin()) // Optimize
		.pipe(gulp.dest(dest));
});