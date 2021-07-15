const {dest, src} = require('gulp');
const config = require("./config.js");
const sassProcessor = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-minify-css');
const rename = require("gulp-rename");

const destination = `${config.destination}/static/c`;

const styles = cb => {
  return src(`${config.source}/_styles/**/*.scss`)
    .pipe(
      sassProcessor({
        outputStyle: 'compressed'
      })
      .on('error', sassProcessor.logError)
    )
    .pipe( autoprefixer(
        'last 2 version',
        'safari 5',
        'ie 8', 'ie 9',
        'opera 12.1',
        'ios 6', 'android 4'
      )
    )
    .pipe( dest(destination) )
    .pipe( rename({suffix: '.min'}) )
    .pipe( minifycss() )
    .pipe( dest( destination ) )
    .on('done', cb);
};

module.exports = styles;
