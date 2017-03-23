var gulp = require('gulp'),
	htmlmin = require('gulp-htmlmin');

gulp.task('html', function() {
	var source = './_site/**/*.html',
		destination = './_site',
		htmlmin_config = {
			removeComments: true,
			collapseWhitespace: true
		};

	return gulp.src(source)
		.pipe(htmlmin(htmlmin_config))
		.pipe(gulp.dest(destination));
});