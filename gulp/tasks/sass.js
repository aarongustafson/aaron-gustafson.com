var gulp = require('gulp');
var sass = require('gulp-ruby-sass');

gulp.task('default', function () {
    return gulp.src('src/app.scss')
        .pipe(sass({sourcemap: true}))
        .pipe(gulp.dest('dist'));
});

var compass      = require('gulp-compass');
var gulp         = require('gulp');
var notify       = require('gulp-notify');
var handleErrors = require('../util/handleErrors');

gulp.task('compass', function() {
	return gulp.src('./src/sass/*.sass')
		.pipe(compass({
			config_file: 'compass.rb',
			css: 'build',
			sass: 'src/sass'
		}))
		.on('error', handleErrors);
});