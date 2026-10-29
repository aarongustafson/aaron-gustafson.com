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

const assetFiles = (directory, extensions, root = directory) => {
	const entries = fs
		.readdirSync(directory, { withFileTypes: true })
		.sort((a, b) => a.name.localeCompare(b.name));

	return entries.flatMap((entry) => {
		const entryPath = path.join(directory, entry.name);

		if (entry.isDirectory()) {
			return assetFiles(entryPath, extensions, root);
		} else if (extensions.includes(path.extname(entry.name))) {
			return [path.relative(root, entryPath).split(path.sep).join("/")];
		}
		return [];
	});
};

export const getPreinstallAssets = (assets = config.static) =>
	["c", "j"].flatMap((directory) =>
		assetFiles(path.join(assets, directory), [".css", ".js"]).map(
			(file) => `/${directory}/${file}`,
		),
	);

export const getAssetVersion = ({
	worker = source_folder,
	assets = config.static,
} = {}) => {
	const hash = crypto.createHash("sha256");

	for (const [label, directory, extensions] of [
		["worker", worker, [".js"]],
		["c", path.join(assets, "c"), [".css"]],
		["j", path.join(assets, "j"), [".js"]],
	]) {
		for (const file of assetFiles(directory, extensions)) {
			hash.update(`${label}/${file}\0`);
			hash.update(fs.readFileSync(path.join(directory, file)));
		}
	}

	return hash.digest("hex").slice(0, 16);
};

const sw = () => {
	const version = getAssetVersion();

	return (
		src(path.join(source_folder, "*.js"))
			// make a file from the folder
			.pipe(concat("serviceworker.js"))
			.pipe(replace("{{ VERSION }}", version))
			.pipe(replace('"{{ ASSETS }}"', JSON.stringify(getPreinstallAssets())))
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
