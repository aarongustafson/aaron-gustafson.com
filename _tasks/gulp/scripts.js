/* jshint node: true */
var gulp = require("gulp"),
    path = require("path"),
    folder = require("gulp-folders"),
    gulpIf = require("gulp-if"),
    concat = require("gulp-concat"),
    notify = require("gulp-notify"),
    rename = require("gulp-rename"),
    uglifyes = require("uglify-es"),
    composer = require("gulp-uglify/composer"),
    minify = composer(uglifyes, console),
    //handleErrors = require("handleErrors"),
    source_folder = "_javascript",
    destination_folder = "j",
    public_folder = "_site/j",
    rename_serviceworker = rename({
        dirname: "../"
    });

gulp.task("scripts", folder(source_folder, function(the_folder){
    return gulp.src(path.join(source_folder, the_folder, "*.js"))
        .pipe(concat(the_folder + ".js"))
        .pipe(gulpIf(the_folder=="serviceworker",rename_serviceworker))
        .pipe(gulp.dest(destination_folder))
        .pipe(gulp.dest(public_folder))
        .pipe(rename({suffix: ".min"}))
        .pipe(minify())
        .pipe(gulp.dest(destination_folder))
        .pipe(gulp.dest(public_folder))
        .pipe(notify({ message: "Scripts task complete" }));
        //.on("error", handleErrors);
}));