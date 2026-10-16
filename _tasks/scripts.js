/* jshint node: true */
import fs from "fs";
import gulp from "gulp";
import concat from "gulp-concat";
import newer from "gulp-newer";
import rename from "gulp-rename";
import composer from "gulp-uglify/composer.js";
import path from "path";
import uglify from "uglify-es";
import config from "./config.js";
const { dest, src } = gulp;

let minify = composer(uglify, console);
const keepConsole = process.env.KEEP_CONSOLE === "true";
const shouldMinify = !keepConsole;

const source_folder = `${config.source}/_javascript`;
const destination_folder = `${config.static}/j`;
const dist = `${config.destination}/j`;
const isWatch = process.argv.includes("watch");
const form_saver_source = "node_modules/@aarongustafson/form-saver";

function getFolders(dir) {
	return fs.readdirSync(dir).filter(function (file) {
		return fs.statSync(path.join(dir, file)).isDirectory();
	});
}

const copyFormSaver = () =>
	new Promise((resolve, reject) => {
		src(
			[
				path.join(form_saver_source, "define.js"),
				path.join(form_saver_source, "form-saver.js"),
			],
			{ base: form_saver_source },
		)
			.pipe(dest(path.join(destination_folder, "form-saver")))
			.pipe(dest(path.join(dist, "form-saver")))
			.on("finish", resolve)
			.on("error", reject);
	});

// Optimized scripts function with better caching
const scripts = async () => {
	await copyFormSaver();

	const folders = getFolders(source_folder);

	for (const folder of folders
		// Exclude serviceworker folder as it has its own dedicated task
		.filter((folder) => folder !== "serviceworker")) {
		await new Promise((resolve, reject) => {
			const folderPath = path.join(source_folder, folder);
			const outputFile = folder + ".js";
			const outputMin = folder + ".min.js";

			// Check if any source files are newer than output
			const destPath = path.join(destination_folder, outputFile);

			let stream = src(path.join(folderPath, "*.js"))
				// Only process if source files are newer than destination
				.pipe(newer(destPath))

				// Concatenate files
				.pipe(concat(outputFile))

				// Write expanded version
				.pipe(dest(destination_folder))
				.pipe(dest(dist))

				// Prepare .min filename (contents may stay expanded for debugging)
				.pipe(rename({ suffix: ".min" }));

			if (shouldMinify) {
				stream = stream.pipe(
					minify({
						compress: {
							drop_console: keepConsole ? false : !isWatch, // Allow opting-in to console output for debugging
						},
					}),
				);
			}

			stream
				.pipe(dest(destination_folder))
				.pipe(dest(dist))
				.on("finish", resolve)
				.on("error", reject);
		});
	}
};

export default scripts;
