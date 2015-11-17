var gulp = require('gulp'),
    path = require('path'),
    folder = require('gulp-folders'),
    gulpIf = require('gulp-if'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    //handleErrors = require('handleErrors'),
    source_folder = 'source/_javascript',
    destination_root = 'source',
    destination_folder = destination_root + '/j',
    public_root = 'public'
    public_folder = public_root + '/j',
    rename_serviceworker = rename({
        dirname: "../"
    });

gulp.task('scripts', folder(source_folder, function(folder){
    return gulp.src(path.join(source_folder, folder, '*.js'))
        .pipe(concat(folder + '.js'))
        .pipe(gulp.dest(destination_folder))
        .pipe(gulp.dest(public_folder))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulpIf(folder=='serviceworker',rename_serviceworker))
        .pipe(gulp.dest(destination_folder))
        .pipe(gulp.dest(public_folder))
        .pipe(notify({ message: 'Scripts task complete' }));
        //.on('error', handleErrors);
}));