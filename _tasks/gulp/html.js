var gulp = require('gulp'),
	htmlmin = require('gulp-htmlmin');

gulp.task('html', function() {
	var source = './_deploy/**/*.html',
		destination = './_deploy',
		htmlmin_config = {
			removeComments: true,
			collapseWhitespace: true
		};

	return gulp.src(source)
		.pipe(htmlmin(htmlmin_config))
		.pipe(gulp.dest(destination));
});