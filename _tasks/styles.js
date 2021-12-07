const {dest, src} = require('gulp');
const config = require("./config.js");
const sassProcessor = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean-css');
const rename = require("gulp-rename");

const destination = `${config.static}/c`;
const dist = `${config.destination}/c`;

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
    .pipe( dest(dist) )
    .pipe( rename({suffix: '.min'}) )
    .pipe( clean() )
    .pipe( dest( destination ) )
    .pipe( dest(dist) )
    .on('done', cb);
};

module.exports = styles;
