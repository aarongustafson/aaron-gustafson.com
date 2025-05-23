import fs from "fs";
import gulp from "gulp";
import autoprefixer from "gulp-autoprefixer";
import clean from "gulp-clean-css";
import rename from "gulp-rename";
import gulpSass from 'gulp-sass';
import * as sass from "sass";
import stream from "stream";
import config from "./config.js";
const {dest, src} = gulp;
const sassProcessor = gulpSass(sass);
const { Transform } = stream;

const destination = `${config.static}/c`;
const dist = `${config.destination}/c`;
const isWatch = process.argv.includes('watch');

// Update SW
const sw_data_file = `${config.source}/_data/sw.json`;
const sw_data = JSON.parse(fs.readFileSync(sw_data_file));
const updateServiceWorker = () => {
  let stream = new Transform({
    objectMode: true,
    transform: (file, encoding, next) => {
      return next(null, file);
    },
    flush: (next) => {
			if ( isWatch ) {
				sw_data.version = new Date().getTime();
				fs.writeFileSync(sw_data_file, JSON.stringify(sw_data, null, '  '));
			}
      return next();
    }
  });
  return stream;
};

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
		.pipe( updateServiceWorker() )
    .on('done', cb);
};

export default styles;
