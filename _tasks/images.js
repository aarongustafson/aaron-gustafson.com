/* jshint node: true */
const {dest, src} = require('gulp');
const config = require("./config.js");
const imagemin = require('gulp-imagemin');
const newer  = require("gulp-newer");
// const webp  = require("gulp-webp");

const destination = `${config.static}/i`;

// Grabs all images, runs them through imagemin
// and plops them in the dist folder
const images = cb => {

  return src(`${config.source}/_images/**/*.{jpg,png,svg,gif}`)
    // Only take new files
    .pipe( newer( destination ) )
    // Optimize
    .pipe(
      imagemin(
        [
          imagemin.mozjpeg({quality: 60, progressive: true}),
          imagemin.optipng({optimizationLevel: 5, interlaced: null})
        ],
        { silent: true }
      )
    )
    .pipe( dest( destination ) )
    //.pipe( gulpIf( /.*?\.(jpg|png)$/, webp() ) )
    //.pipe( dest(`${config.source}/static/i`) )
    .on('done', cb);
};

module.exports = images;
