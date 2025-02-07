/* jshint node: true */
import gulp from "gulp";
const {dest, src} = gulp;
import config from "./config.js";
import path from "path";
import concat from "gulp-concat";
import rename from "gulp-rename";
import composer from "gulp-uglify/composer.js";
import uglify from "uglify-es";
const minify = composer(uglify, console);
import replace from "gulp-replace";
import fs from "fs";

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

export default sw;
