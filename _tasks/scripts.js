/* jshint node: true */
const {dest, src} = require('gulp');
const config = require("./config.js");
const fs = require('fs');
const path = require("path");
const merge = require("merge-stream");
const gulpIf = require("gulp-if");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const composer = require("gulp-uglify/composer");
const minify = composer(require("uglify-es"), console);

const source_folder = `${config.source}/_javascript`;
const destination_folder = `${config.static}/j`;

function getFolders( dir ) {
  return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

const scripts = cb => {
  const folders = getFolders( source_folder );

  const tasks = folders.map( folder => {
    return src( path.join( source_folder, folder, "*.js") )
    // make a file from the folder
    .pipe( concat(folder + ".js") )
    // service worker goes to a different destination
    .pipe(
      gulpIf(
        folder == "serviceworker",
        rename({ dirname: "../" })
      )
    )
    // write expanded version
    .pipe( dest(destination_folder) )
    // make & write minified version
    .pipe( rename({suffix: ".min"} ) )
    .pipe( minify() )
    .pipe( dest(destination_folder) );
  });

  return merge(tasks);

};

module.exports = scripts;
