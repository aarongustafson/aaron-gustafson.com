var gulp = require('gulp');

gulp.task('watch', ['setWatch'], function() {
	gulp.watch('_styles/**', ['styles']);
	gulp.watch('_javascript/**', ['scripts']);
	gulp.watch('i/**', ['images']);
});