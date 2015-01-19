var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    path = require('path'),
    handleErrors = require('../utils/handleErrors'),
    source_folder = 'source/_styles/*.scss',
    destination_folder = 'source/c',
    preview_folder = 'public/c';

gulp.task('styles', function() {
    return gulp.src(source_folder)
        .pipe(sass({
            style: 'expanded',
            loadPath: [ path.join( __dirname , '../../source/_styles') ]
         }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest(destination_folder))
        .pipe(gulp.dest(preview_folder))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(destination_folder))
        .pipe(gulp.dest(preview_folder))
        .pipe(notify({ message: 'Styles task complete' }))
        .on('error', handleErrors);;
});