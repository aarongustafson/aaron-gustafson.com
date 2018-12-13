var gulp = require('gulp'),
    path = require('path'),
    folder = require('gulp-folders'),
    gulpIf = require('gulp-if'),
    insert = require('gulp-insert'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    uglifyjs = require('uglify-es'),
    composer = require('gulp-uglify/composer'),
    minify = composer(uglifyjs, console);
    //handleErrors = require('handleErrors'),
    source_folder = '_javascript',
    destination_folder = 'j',
    public_folder = '_site/j',
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
        .pipe(minify({}))
        .pipe(gulpIf(folder=='serviceworker',rename_serviceworker))
        .pipe(gulp.dest(destination_folder))
        .pipe(gulp.dest(public_folder))
        .pipe(notify({ message: 'Scripts task complete' }));
        //.on('error', handleErrors);
}));