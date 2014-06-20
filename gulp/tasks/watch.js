var gulp = require('gulp');

gulp.task('watch', ['setWatch', 'browserSync'], function() {
	gulp.watch('source/_sass/**', ['sass']);
	gulp.watch('source/i/**', ['images']);
	// Note: The browserify task handles js recompiling with watchify
});