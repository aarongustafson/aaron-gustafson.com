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
const through2 = require("through2");
const { Transform } = require("stream");

const source_folder = `${config.source}/_javascript`;
const destination_folder = `${config.static}/j`;
const dist = `${config.destination}/j`;
const isWatch = process.argv.includes('watch');

function getFolders( dir ) {
  return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

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
        through2.obj((file, _, cb) => {
					cb();
					return;
				})
      )
    )
    // write expanded version
    .pipe( dest(destination_folder) )
    .pipe( dest(dist) )
    // make & write minified version
    .pipe( rename({suffix: ".min"} ) )
    .pipe( minify() )
    .pipe( dest(destination_folder) )
    .pipe( dest(dist) )
		.pipe( updateServiceWorker() )
    .on('done', cb);
  });

  return merge(tasks);

};

module.exports = scripts;
