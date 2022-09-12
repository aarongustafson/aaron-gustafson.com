/* jshint node: true */
const {dest, src} = require('gulp');
const config = require("./config.js");
const squoosh = require("gulp-squoosh");
const svgo = require("gulp-svgo");
const filter = require("gulp-filter");
const gulpif = require("gulp-if");
const { Transform } = require("stream");
var path = require("path");
const fs = require("fs");

const destination = `${config.static}/i`;
const dist = `${config.destination}/i`;

// log
const cache_file = `${config.cache}/optimized-images.json`;
const optimized_images = JSON.parse(fs.readFileSync(cache_file));
const cacheFiles = () => {
  let stream = new Transform({
    objectMode: true,
    transform: (file, encoding, next) => {
      const file_path = path.relative(file.cwd, file.path);
      // skip the client images
      if ( file_path.indexOf( ".svg" ) < 0 ) {
        optimized_images.push(file_path);
      }
      return next(null, file);
    }
  });
  return stream;
};
const writeCache = () => {
  let stream = new Transform({
    objectMode: true,
    transform: (file, encoding, next) => {
      return next(null, file);
    },
    flush: (next) => {
      fs.writeFileSync(cache_file, JSON.stringify(optimized_images, null, '  '));
      return next();
    }
  });
  return stream;
};

const squoosh_opts = ({ width, height, size, filePath }) => ({
  encodeOptions: {
    ...(path.extname(filePath) === ".png"
      ? { oxipng: {} }
      : { mozjpeg: {} }),
  },
});
const svgo_opts = {
  plugins: [
      { removeViewBox: false }
  ]
};

// Grabs all images, runs them through imagemin
// and plops them in the dist folder
const images = () => {
  
  return src([`${config.source}/_images/**/*.{jpg,png,gif,svg}`, `!${config.source}/**/*.sketch/**`])
    // Only take new files
    .pipe(filter(function(file){
      return optimized_images.every(entry => !file.path.includes(entry));
    }))
    // Save the list of new files
    .pipe( cacheFiles() )
    // Optimize
    .pipe( gulpif( "*.svg", svgo( svgo_opts ), squoosh( squoosh_opts ) ) )
    // Save
    .pipe( dest( destination ) )
    .pipe( dest( dist ) )
    // Write the list of new files to disk
    .pipe( writeCache() );
    //.pipe( gulpIf( /.*?\.(jpg|png)$/, webp() ) )
    //.pipe( dest(`${config.source}/static/i`) )
    //.on('done', cb);

};

module.exports = images;
