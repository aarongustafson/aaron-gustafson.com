import fs from "fs";
import gulp from "gulp";
import autoprefixer from "gulp-autoprefixer";
import clean from "gulp-clean-css";
import newer from "gulp-newer";
import rename from "gulp-rename";
import gulpSass from "gulp-sass";
import * as sass from "sass";
import stream from "stream";
import config from "./config.js";

const { dest, src } = gulp;
const sassProcessor = gulpSass(sass);
const { Transform } = stream;

const destination = `${config.static}/c`;
const dist = `${config.destination}/c`;
const isWatch = process.argv.includes("watch");

// Debounced SW update
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

const styles = (cb) => {
	const mainScss = `${config.source}/_styles/advanced.scss`;
	const outputCss = `${destination}/advanced.css`;

	const stream = src(`${config.source}/_styles/**/*.scss`)
		// Only process if SCSS files are newer than CSS output
		.pipe(newer(outputCss))

		.pipe(
			sassProcessor({
				outputStyle: "expanded", // Keep readable for development
				includePaths: ["node_modules"], // Allow imports from node_modules
				quietDeps: true, // Reduce deprecation warnings
			}).on("error", sassProcessor.logError),
		)

		.pipe(
			autoprefixer({
				overrideBrowserslist: [
					"last 2 versions",
					"safari >= 5",
					"ie >= 8",
					"opera >= 12.1",
					"ios >= 6",
					"android >= 4",
				],
				cascade: false, // Faster processing
			}),
		)

		// Save expanded version
		.pipe(dest(destination))
		.pipe(dest(dist))

		// Create minified version
		.pipe(rename({ suffix: ".min" }))
		.pipe(
			clean({
				level: 2, // More aggressive optimization
				compatibility: "ie8",
			}),
		)
		.pipe(dest(destination))
		.pipe(dest(dist))
		.pipe(updateServiceWorker());

	if (cb && typeof cb === "function") {
		stream.on("end", cb);
	}

	return stream;
};

export default styles;
