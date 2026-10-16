/* jshint node: true */
import fs from "fs";
import gulp from "gulp";
import crypto from "crypto";
import path from "path";
import sharp from "sharp";
import stream from "stream";
import through2 from "through2";
import { optimize } from "svgo";
import config from "./config.js";
const { dest, src } = gulp;
const { Transform } = stream;

const DISABLE_IMAGE_OPTIMIZATION =
	process.env.DISABLE_IMAGE_OPTIMIZATION === "1" ||
	process.env.DISABLE_IMAGE_OPTIMIZATION === "true";

const destination = `${config.static}/i`;
const dist = `${config.destination}/i`;
const isWatch = process.argv.includes("watch");

const cache_file = `${config.cache}/optimized-images.json`;
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
let imageCache = {};

// Load existing cache
try {
	imageCache = JSON.parse(fs.readFileSync(cache_file));
	console.log(
		`>>> Image cache loaded: ${Object.keys(imageCache).length} entries`,
	);

	// Clean up orphaned cache entries for better performance
	const originalCount = Object.keys(imageCache).length;
	Object.keys(imageCache).forEach((filePath) => {
		// The cache stores paths like "src/_images/share-card.jpg"
		if (!fs.existsSync(filePath)) {
			delete imageCache[filePath];
		}
	});
	const cleanedCount = Object.keys(imageCache).length;
	if (originalCount !== cleanedCount) {
		console.log(
			`>>> Cleaned ${originalCount - cleanedCount} orphaned cache entries`,
		);
	}
} catch (err) {
	console.log(`>>> No existing image cache found, starting fresh`);
	imageCache = {};
}

let cacheHits = 0;
let cacheMisses = 0;

function getCacheDetails(file) {
	const filePath = path.relative(file.cwd, file.path);
	const hash = crypto.createHash("sha256").update(file.contents).digest("hex");
	const cached = imageCache[filePath];
	const optimizedPath = path.join(destination, file.relative);
	const isHit = isOptimizedCacheHit(
		cached,
		hash,
		optimizerSignature,
		optimizedPath,
	);

	return { filePath, hash, optimizedPath, isHit };
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

export function shouldEmitImage(isCacheHit, watchMode) {
	return !isCacheHit || !watchMode;
}

const writeCache = () => {
	let stream = new Transform({
		objectMode: true,
		transform: (file, encoding, next) => {
			if (file.imageCacheUpdate) {
				const { filePath, hash, size, optimized } = file.imageCacheUpdate;
				imageCache[filePath] = {
					hash,
					size,
					optimized,
					optimizer: optimizerSignature,
					processed: Date.now(),
				};
				delete file.imageCacheUpdate;
			}
			return next(null, file);
		},
		flush: (next) => {
			fs.writeFileSync(cache_file, JSON.stringify(imageCache, null, 2));
			return next();
		},
	});
	return stream;
};

const processImages = (counts) => {
	return through2.obj(async (file, _, cb) => {
		const originalContents = Buffer.from(file.contents);
		let cacheDetails;

		try {
			if (DISABLE_IMAGE_OPTIMIZATION) {
				cacheDetails = getCacheDetails(file);
				file.imageCacheUpdate = {
					filePath: cacheDetails.filePath,
					hash: cacheDetails.hash,
					size: originalContents.length,
					optimized: false,
				};
				counts.skipped++;
				return cb(null, file);
			}

			cacheDetails = getCacheDetails(file);

			if (cacheDetails.isHit) {
				cacheHits++;
				counts.cached++;
				if (!shouldEmitImage(true, isWatch)) {
					return cb();
				}
				file.contents = fs.readFileSync(cacheDetails.optimizedPath);
				return cb(null, file);
			}

			cacheMisses++;

			if (path.extname(file.path).toLowerCase() === ".svg") {
				const result = optimize(originalContents.toString(), {
					path: file.path,
				});
				const optimizedContents = Buffer.from(result.data);
				file.contents = smallestBuffer(originalContents, optimizedContents);
			} else {
				const optimizedContents = await sharp(originalContents)
					.jpeg(optimizationOptions.jpeg)
					.png(optimizationOptions.png)
					.toBuffer();
				file.contents = smallestBuffer(originalContents, optimizedContents);
			}

			file.imageCacheUpdate = {
				filePath: cacheDetails.filePath,
				hash: cacheDetails.hash,
				size: originalContents.length,
				optimized: true,
			};
			counts.optimized++;
			return cb(null, file);
		} catch (err) {
			counts.failed++;
			return cb(new Error(`Error processing ${file.path}: ${err.message}`));
		}
	});
};

const mediaGlobs = `${config.source}/_images/**/*.{mp4,mov,mp3,ogg}`;
const mediaCopyOptions = {
	allowEmpty: true,
	encoding: false, // Ensure binary assets stay untouched (no UTF-8 decoding)
};

const imageCopyOptions = {
	allowEmpty: true,
	encoding: false,
};

// Optimized images function with performance tracking
const images = () => {
	const startTime = Date.now();
	const counts = {
		optimized: 0,
		cached: 0,
		skipped: 0,
		failed: 0,
	};

	// Reset cache counters
	cacheHits = 0;
	cacheMisses = 0;

	// Handle media files separately (no processing needed, preserve binary data)
	src([mediaGlobs], mediaCopyOptions).pipe(dest(destination)).pipe(dest(dist));

	return (
		src(
			[
				`${config.source}/_images/**/*.{jpg,png,gif,svg}`,
				`!${config.source}/**/*.sketch/**`,
				`!${config.source}/**/.DS_Store`,
			],
			imageCopyOptions,
		)
			.pipe(processImages(counts))

			// Save to destinations
			.pipe(dest(destination))
			.pipe(dest(dist))

			// Write updated cache and log performance
			.pipe(writeCache())
			.on("end", () => {
				const duration = Date.now() - startTime;
				const hitRate =
					cacheHits + cacheMisses > 0
						? ((cacheHits / (cacheHits + cacheMisses)) * 100).toFixed(1)
						: "0.0";
				console.log(
					`>>> Images: ${counts.optimized} optimized, ${counts.cached} cached, ${counts.skipped} skipped, ${counts.failed} failed (${duration}ms, ${hitRate}% cache hit rate)`,
				);
			})
	);
};

export default images;
