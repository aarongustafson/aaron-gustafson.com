/* jshint node: true */
const {dest, src} = require('gulp');
const config = require("./config.js");
const squoosh = require("gulp-squoosh");
const newer  = require("gulp-newer");

const destination = `${config.static}/i`;
const dist = `${config.destination}/i`;

// Grabs all images, runs them through imagemin
// and plops them in the dist folder
const images = cb => {

  return src(`${config.source}/_images/**/*.{jpg,png,svg,gif}`)
    // Only take new files
    .pipe( newer( destination ) )
    // Optimize
    .pipe( squoosh() )
    .pipe( dest( destination ) )
    .pipe( dest( dist ) )
    //.pipe( gulpIf( /.*?\.(jpg|png)$/, webp() ) )
    //.pipe( dest(`${config.source}/static/i`) )
    //.on('done', cb);

};

module.exports = images;
