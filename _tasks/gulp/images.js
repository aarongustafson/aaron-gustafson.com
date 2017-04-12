var gulp     = require('gulp'),
	changed  = require('gulp-changed'),
	imagemin = require('gulp-imagemin'),
	webp     = require('gulp-webp'),
	debug    = require('gulp-debug');

gulp.task('images', function() {
	var destination = './i';

	gulp.src('./_images/**/*.{jpg,png,svg,gif}')
		.pipe(changed(destination)) // Ignore unchanged files
		.pipe(imagemin()) // Optimize
		// Publish
		.pipe(gulp.dest(destination));

	gulp.src('./_images/**/*.{jpg,png}')
		.pipe(changed(destination)) // Ignore unchanged files
		.pipe(webp())
		// Publish
		.pipe(gulp.dest(destination));

	return true;
});