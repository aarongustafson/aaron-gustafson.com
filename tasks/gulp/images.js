var gulp     = require('gulp'),
	changed  = require('gulp-changed'),
	imagemin = require('gulp-imagemin'),
	webp     = require('gulp-webp'),
	debug    = require('gulp-debug');

gulp.task('images', function() {
	var deploy_folder = './_deploy/i',
		public_folder = './public/i';

	gulp.src('./source/i/**/*.{jpg,png,svg,gif}')
		.pipe(changed(deploy_folder)) // Ignore unchanged files
		.pipe(imagemin()) // Optimize
		// Publish
		.pipe(gulp.dest(deploy_folder))
		.pipe(gulp.dest(public_folder));

	gulp.src('./source/i/**/*.{jpg,png}')
		.pipe(changed(deploy_folder)) // Ignore unchanged files
		.pipe(webp())
		// Publish
		.pipe(gulp.dest(deploy_folder))
		.pipe(gulp.dest(public_folder));

	return true;
});