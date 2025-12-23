import path from "path";
import through2 from "through2";
import gulp from "gulp";
const { dest, src } = gulp;
import config from "./config.js";
const { destination } = config;

const minifyJson = (buffer, filePath) => {
	const raw = buffer.toString("utf-8");
	if (!raw.trim()) {
		return buffer;
	}
	try {
		const parsed = JSON.parse(raw);
		return Buffer.from(JSON.stringify(parsed));
	} catch (error) {
		console.warn(
			`[data] Skipping JSON minification for ${filePath}: ${error.message}`,
		);
		return buffer;
	}
};

const minifyXml = (buffer) => {
	const xml = buffer.toString("utf-8");
	const collapsed = xml.replace(/>\s+</g, "><").trim();
	return Buffer.from(collapsed);
};

const minifyData = () =>
	through2.obj((file, _, cb) => {
		if (file.isNull()) {
			return cb(null, file);
		}
		if (file.isStream()) {
			return cb(new Error("Streaming files are not supported in data task"));
		}

		try {
			const ext = path.extname(file.path).toLowerCase();
			if (ext === ".json") {
				file.contents = minifyJson(file.contents, file.relative);
			} else if (ext === ".xml") {
				file.contents = minifyXml(file.contents);
			}
			return cb(null, file);
		} catch (error) {
			return cb(error);
		}
	});

const data = (cb) => {
	return src(`${destination}/**/*.{xml,json}`)
		.pipe(minifyData())
		.pipe(dest(destination))
		.on("done", cb);
};

export default data;
