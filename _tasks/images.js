/* jshint node: true */
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import gulp from "gulp";
import sharp from "sharp";
import through2 from "through2";
import { optimize } from "svgo";
import config from "./config.js";

const DISABLE_IMAGE_OPTIMIZATION =
	process.env.DISABLE_IMAGE_OPTIMIZATION === "1" ||
	process.env.DISABLE_IMAGE_OPTIMIZATION === "true";

const optimizationOptions = {
	jpeg: {
		progressive: true,
		force: false,
		mozjpeg: true,
		quality: 85,
	},
	png: {
		progressive: true,
		force: false,
		compressionLevel: 9,
		adaptiveFiltering: true,
	},
};
const optimizerSignature = crypto
	.createHash("sha256")
	.update(
		JSON.stringify({
			cacheSchema: 3,
			sharp: sharp.versions.sharp,
			vips: sharp.versions.vips,
			svgo: JSON.parse(
				fs.readFileSync("./node_modules/svgo/package.json", "utf8"),
			).version,
			options: optimizationOptions,
		}),
	)
	.digest("hex");

function loadCache(cacheFile) {
	try {
		return JSON.parse(fs.readFileSync(cacheFile, "utf8"));
	} catch (error) {
		if (error.code === "ENOENT") return {};
		throw error;
	}
}

export function isOptimizedCacheHit(
	cached,
	sourceHash,
	signature,
	optimizedPath,
) {
	return Boolean(
		cached?.optimized === true &&
		cached.hash === sourceHash &&
		cached.optimizer === signature &&
		fs.existsSync(optimizedPath),
	);
}

export function smallestBuffer(originalContents, optimizedContents) {
	return optimizedContents.length < originalContents.length
		? optimizedContents
		: originalContents;
}

async function writeIfChanged(filePath, contents, { atomic = false } = {}) {
	try {
		const existing = await fs.promises.readFile(filePath);
		if (existing.equals(contents)) return false;
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
	if (atomic) {
		const temporary = `${filePath}.tmp-${crypto.randomUUID()}`;
		try {
			await fs.promises.writeFile(temporary, contents);
			await fs.promises.rename(temporary, filePath);
		} finally {
			await fs.promises.rm(temporary, { force: true });
		}
	} else {
		await fs.promises.writeFile(filePath, contents);
	}
	return true;
}

export async function buildImages({
	sourceDir = `${config.source}/_images`,
	staticDir = `${config.static}/i`,
	outputDir = `${config.destination}/i`,
	cacheDir = config.cache,
	disableOptimization = DISABLE_IMAGE_OPTIMIZATION,
} = {}) {
	const startTime = Date.now();
	const cacheFile = path.join(cacheDir, "optimized-images.json");
	const imageCache = loadCache(cacheFile);
	const previousCache = JSON.stringify(imageCache, null, 2);
	const counts = {
		optimized: 0,
		cached: 0,
		skipped: 0,
		media: 0,
		written: 0,
		unchanged: 0,
	};
	for (const filePath of Object.keys(imageCache)) {
		if (!fs.existsSync(filePath)) delete imageCache[filePath];
	}

	const processImages = through2.obj((file, _, callback) => {
		async function processFile() {
			let contents = file.contents;
			if (/\.(mp4|mov|mp3|ogg)$/i.test(file.path)) {
				counts.media++;
			} else {
				const filePath = path.relative(file.cwd, file.path);
				const hash = crypto.createHash("sha256").update(contents).digest("hex");
				// Failed builds must not replace bytes referenced by the persisted index.
				const optimizedPath = path.join(
					cacheDir,
					"optimized-images",
					optimizerSignature,
					hash,
					file.relative,
				);
				if (
					isOptimizedCacheHit(
						imageCache[filePath],
						hash,
						optimizerSignature,
						optimizedPath,
					)
				) {
					contents = await fs.promises.readFile(optimizedPath);
					counts.cached++;
				} else if (disableOptimization) {
					counts.skipped++;
				} else {
					let optimized;
					if (path.extname(file.path).toLowerCase() === ".svg") {
						optimized = Buffer.from(
							optimize(contents.toString(), { path: file.path }).data,
						);
					} else {
						optimized = await sharp(contents)
							.jpeg(optimizationOptions.jpeg)
							.png(optimizationOptions.png)
							.toBuffer();
					}
					const sourceSize = contents.length;
					contents = smallestBuffer(contents, optimized);
					await writeIfChanged(optimizedPath, contents, { atomic: true });
					imageCache[filePath] = {
						hash,
						size: sourceSize,
						optimized: true,
						optimizer: optimizerSignature,
						processed: Date.now(),
					};
					counts.optimized++;
				}
			}
			for (const directory of [staticDir, outputDir]) {
				if (
					await writeIfChanged(path.join(directory, file.relative), contents)
				) {
					counts.written++;
				} else {
					counts.unchanged++;
				}
			}
		}
		processFile().then(
			() => callback(),
			(error) =>
				callback(
					new Error(`Error processing ${file.path}: ${error.message}`, {
						cause: error,
					}),
				),
		);
	});

	await pipeline(
		gulp.src(
			[
				`${sourceDir}/**/*.{jpg,png,gif,svg,mp4,mov,mp3,ogg}`,
				`!${sourceDir}/**/*.sketch/**`,
				`!${sourceDir}/**/.DS_Store`,
			],
			{ allowEmpty: true, encoding: false },
		),
		processImages,
	);
	const updatedCache = JSON.stringify(imageCache, null, 2);
	if (updatedCache !== previousCache) {
		await writeIfChanged(cacheFile, Buffer.from(updatedCache), {
			atomic: true,
		});
	}
	console.log(
		`>>> Images: ${counts.optimized} optimized, ${counts.cached} cached, ${counts.skipped} skipped, ${counts.media} media, ${counts.written} output writes, ${counts.unchanged} unchanged (${Date.now() - startTime}ms)`,
	);
	return counts;
}

export default function images() {
	return buildImages();
}
