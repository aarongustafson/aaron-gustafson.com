var gulp = require('gulp');

gulp.task('watch', ['setWatch'], function() {
	gulp.watch('source/_sass/**', ['sass']);
	gulp.watch('source/i/**', ['images']);
	
});