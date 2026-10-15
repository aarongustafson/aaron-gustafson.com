/* jshint node: true */
import crypto from "crypto";
import fs from "fs";
import gulp from "gulp";
const { dest, src } = gulp;
import config from "./config.js";
import path from "path";
import concat from "gulp-concat";
import rename from "gulp-rename";
import composer from "gulp-uglify/composer.js";
import uglify from "uglify-es";
const minify = composer(uglify, console);
import replace from "gulp-replace";

const source_folder = `${config.source}/_javascript/serviceworker`;
const destination_folder = `${config.static}`;
const dist = `${config.destination}/`;

const hashDirectory = (hash, directory, extensions) => {
	const entries = fs
		.readdirSync(directory, { withFileTypes: true })
		.sort((a, b) => a.name.localeCompare(b.name));

	for (const entry of entries) {
		const entryPath = path.join(directory, entry.name);

		if (entry.isDirectory()) {
			hashDirectory(hash, entryPath, extensions);
		} else if (extensions.includes(path.extname(entry.name))) {
			hash.update(entryPath);
			hash.update(fs.readFileSync(entryPath));
		}
	}
};

const getAssetVersion = () => {
	const hash = crypto.createHash("sha256");

	hashDirectory(hash, source_folder, [".js"]);
	hashDirectory(hash, path.join(config.static, "c"), [".css"]);
	hashDirectory(hash, path.join(config.static, "j"), [".js"]);

	return hash.digest("hex").slice(0, 16);
};

const sw = () => {
	const version = getAssetVersion();

	return (
		src(path.join(source_folder, "*.js"))
			// make a file from the folder
			.pipe(concat("serviceworker.js"))
			.pipe(replace("{{ VERSION }}", version))
			.pipe(dest(destination_folder))
			.pipe(dest(dist))
			// make & write minified version
			.pipe(rename({ suffix: ".min" }))
			.pipe(minify())
			.pipe(dest(destination_folder))
			.pipe(dest(dist))
	);
};

export default sw;
