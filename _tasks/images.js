/* jshint node: true */
import gulp from "gulp";
const {dest, src} = gulp;
import config from "./config.js";
import through2 from "through2";
import sharp from "sharp";
import svgo from "gulp-svgo";
import filter from "gulp-filter";
import gulpif from "gulp-if";
import stream from "stream";
const { Transform } = stream;
import path from "path";
import fs from "fs";

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
  
	src([`${config.source}/_images/**/*.{mp4,mov,mp3,ogg}`])
		.pipe( dest( destination ) )
		.pipe( dest( dist ) );

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
									.jpeg({ progressive: true, force: false, mozjpeg: true })
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

export default images;
