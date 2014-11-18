var gulp = require('gulp');

gulp.task('watch', ['setWatch'], function() {
	gulp.watch('source/_styles/**', ['styles']);
	gulp.watch('source/_javascript/**', ['scripts']);
	gulp.watch('source/i/**', ['images']);
});