/* jshint node: true */
const {dest, src} = require('gulp');
const config = require("./config.js");
const through2 = require("through2");
const sharp = require("sharp");
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
    .pipe(
			gulpif(
				"*.svg",
				svgo( svgo_opts ),
				through2.obj(function(file, _, cb){
					return sharp(file.contents)
									.jpeg({ progressive: true, force: false })
									.png({ progressive: true, force: false })
									.toBuffer()
									.then(function(buffer) {
										file.contents = buffer;
										return cb(null, file);
									})
									.catch(function(err) {
										console.error(err);
										return cb(null, file);
									});
				})
			) // gulpif
		) // pipe
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
