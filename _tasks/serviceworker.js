/* jshint node: true */
const {dest, src} = require('gulp');
const config = require("./config.js");
const path = require("path");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const composer = require("gulp-uglify/composer");
const minify = composer(require("uglify-es"), console);
const replace = require("gulp-replace");
const fs = require("fs");

const source_folder = `${config.source}/_javascript/serviceworker`;
const destination_folder = `${config.static}`;
const dist = `${config.destination}/`;

// Update SW
const sw_data_file = `${config.source}/_data/sw.json`;
const sw_data = JSON.parse(fs.readFileSync(sw_data_file));

const sw = () => {
  
	return src( path.join( source_folder, "*.js") )
    // make a file from the folder
    .pipe( concat('serviceworker.js') )
		.pipe( replace("{{ VERSION }}", sw_data.version) )
    .pipe( dest(destination_folder) )
    .pipe( dest(dist) )
    // make & write minified version
    .pipe( rename({suffix: ".min"} ) )
    .pipe( minify() )
    .pipe( dest(destination_folder) )
    .pipe( dest(dist) );

};

module.exports = sw;
