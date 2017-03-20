var gulp = require('gulp'),
    path = require('path'),
    folder = require('gulp-folders'),
    gulpIf = require('gulp-if'),
    insert = require('gulp-insert'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    //handleErrors = require('handleErrors'),
    source_folder = 'source/_javascript',
    destination_root = 'source',
    destination_folder = destination_root + '/j',
    public_root = '_deploy'
    public_folder = public_root + '/j',
    rename_serviceworker = rename({
        dirname: "../"
    });

gulp.task('scripts', folder(source_folder, function(folder){
    return gulp.src(path.join(source_folder, folder, '*.js'))
        .pipe(concat(folder + '.js'))
        .pipe(insert.transform(function(contents, file){
            // insert a build time variable
            var build_time = (new Date()).getTime() + '';
            return contents.replace( '{{BUILD_TIME}}', build_time );
         }))
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