/* jshint node: true */
const {dest, src} = require('gulp');
const config = require("./config.js");
const squoosh = require("gulp-squoosh");
const filter = require("gulp-filter");
const through = require("through2");
var path = require('path');
const fs = require("fs");

const destination = `${config.static}/i`;
const dist = `${config.destination}/i`;

// log
const cache_file = `${config.cache}/optimized-images.json`;
const optimized_images = JSON.parse(fs.readFileSync(cache_file));
const cacheFiles = function(){
  return through.obj(
    function(file, enc, cb) {
      const file_path = path.relative(file.cwd, file.path);
      optimized_images.push(file_path);
      cb();
    },
    function(cb) {
      fs.writeFileSync(cache_file, JSON.stringify(optimized_images, null, '  '));
      cb();
    });
};

// Grabs all images, runs them through imagemin
// and plops them in the dist folder
const images = () => {

  return src(`${config.source}/_images/**/*.{jpg,png,svg,gif}`)
    // Only take new files
    .pipe(filter(function(file){
      return optimized_images.every(entry => !file.path.includes(entry));
    }))
    // Save the list of new files to disk
    .pipe( cacheFiles() )
    // Optimize
    .pipe( squoosh() )
    .pipe( dest( destination ) )
    .pipe( dest( dist ) )
    //.pipe( gulpIf( /.*?\.(jpg|png)$/, webp() ) )
    //.pipe( dest(`${config.source}/static/i`) )
    //.on('done', cb);

};

module.exports = images;
