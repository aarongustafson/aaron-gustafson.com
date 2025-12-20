/* jshint node: true */
import fs from "fs";
import gulp from "gulp";
import concat from "gulp-concat";
import newer from "gulp-newer";
import rename from "gulp-rename";
import composer from "gulp-uglify/composer.js";
import merge from "merge-stream";
import path from "path";
import stream from "stream";
import uglify from "uglify-es";
import config from "./config.js";
const { dest, src } = gulp;
const { Transform } = stream;

let minify = composer(uglify, console);

const source_folder = `${config.source}/_javascript`;
const destination_folder = `${config.static}/j`;
const dist = `${config.destination}/j`;
const isWatch = process.argv.includes("watch");

function getFolders(dir) {
	return fs.readdirSync(dir).filter(function (file) {
		return fs.statSync(path.join(dir, file)).isDirectory();
	});
}

// Update SW with debouncing
let swUpdateTimeout;
const sw_data_file = `${config.source}/_data/sw.json`;
const sw_data = JSON.parse(fs.readFileSync(sw_data_file));

const updateServiceWorker = () => {
	let stream = new Transform({
		objectMode: true,
		transform: (file, encoding, next) => {
			return next(null, file);
		},
		flush: (next) => {
			if (isWatch) {
				// Debounce SW updates
				clearTimeout(swUpdateTimeout);
				swUpdateTimeout = setTimeout(() => {
					sw_data.version = new Date().getTime();
					fs.writeFileSync(sw_data_file, JSON.stringify(sw_data, null, 2));
				}, 1000);
			}
			return next();
		},
	});
	return stream;
};

// Optimized scripts function with better caching
const scripts = (cb) => {
	const folders = getFolders(source_folder);

	const tasks = folders
		// Exclude serviceworker folder as it has its own dedicated task
		.filter((folder) => folder !== "serviceworker")
		.map((folder) => {
			const folderPath = path.join(source_folder, folder);
			const outputFile = folder + ".js";
			const outputMin = folder + ".min.js";

			// Check if any source files are newer than output
			const destPath = path.join(destination_folder, outputFile);

			return (
				src(path.join(folderPath, "*.js"))
					// Only process if source files are newer than destination
					.pipe(newer(destPath))

					// Concatenate files
					.pipe(concat(outputFile))

					// Write expanded version
					.pipe(dest(destination_folder))
					.pipe(dest(dist))

					// Create minified version
					.pipe(rename({ suffix: ".min" }))
					.pipe(
						minify({
							compress: {
								drop_console: !isWatch, // Remove console.log in production
							},
						}),
					)
					.pipe(dest(destination_folder))
					.pipe(dest(dist))
					.pipe(updateServiceWorker())
			);
		});

	const mergedTasks = merge(tasks);

	if (cb) {
		mergedTasks.on("end", cb);
	}

	return mergedTasks;
};

export default scripts;
