import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
	heroShareCardOptions,
} from "./share-card-config.js";

function loadCache(cacheFile) {
	try {
		return JSON.parse(fs.readFileSync(cacheFile, "utf8"));
	} catch (error) {
		if (error.code === "ENOENT") {
			return {};
		}
		throw error;
	}
}

function saveCache(cacheFile, cache) {
	const resolved = path.resolve(cacheFile);
	fs.mkdirSync(path.dirname(resolved), { recursive: true });
	const temporary = `${resolved}.tmp-${process.pid}`;
	fs.writeFileSync(temporary, `${JSON.stringify(cache, null, 2)}\n`);
	fs.renameSync(temporary, resolved);
}

function resolveHeroSource(heroSrc, staticDir) {
	if (!heroSrc || !heroSrc.startsWith("/")) {
		throw new Error(`Hero source must be site-root relative: ${heroSrc}`);
	}

	const staticRoot = path.resolve(staticDir);
	const source = path.resolve(staticRoot, heroSrc.slice(1));
	if (!source.startsWith(`${staticRoot}${path.sep}`)) {
		throw new Error(`Hero source is outside the static directory: ${heroSrc}`);
	}
	if (!fs.existsSync(source)) {
		throw new Error(`Hero source does not exist: ${source}`);
	}
	return source;
}

function normalizedDimensions(metadata) {
	const rotated = metadata.orientation >= 5 && metadata.orientation <= 8;
	return {
		width: rotated ? metadata.height : metadata.width,
		height: rotated ? metadata.width : metadata.height,
	};
}

export async function deriveHeroShareCard(
	hero,
	slug,
	options = heroShareCardOptions,
	cache = {},
	force = false,
) {
	const source = resolveHeroSource(hero.src, options.staticDir);
	const output = path.resolve(options.outputDir, `${slug}.jpg`);
	const publicUrl = `${options.outputUrlPath.replace(/\/$/, "")}/${slug}.jpg`;
	const offset = Number.parseFloat(hero.offset);
	const topOffset = Number.isFinite(offset) ? Math.max(0, offset) : 0;
	const sourceBytes = fs.readFileSync(source);
	const hash = crypto
		.createHash("sha256")
		.update(sourceBytes)
		.update(
			JSON.stringify({
				imageWidth: options.imageWidth,
				imageHeight: options.imageHeight,
				jpegQuality: options.jpegQuality,
				topOffset,
			}),
		)
		.digest("hex")
		.slice(0, 16);

	if (!force && cache[slug]?.hash === hash && fs.existsSync(output)) {
		return publicUrl;
	}

	const image = sharp(source).rotate();
	const dimensions = normalizedDimensions(await sharp(source).metadata());
	if (!dimensions.width || !dimensions.height) {
		throw new Error(`Unable to read hero dimensions: ${source}`);
	}

	const scale = Math.max(
		options.imageWidth / dimensions.width,
		options.imageHeight / dimensions.height,
	);
	const resizedWidth = Math.ceil(dimensions.width * scale);
	const resizedHeight = Math.ceil(dimensions.height * scale);
	const left = Math.max(0, Math.floor((resizedWidth - options.imageWidth) / 2));
	const top = Math.min(
		Math.max(0, Math.round(topOffset)),
		Math.max(0, resizedHeight - options.imageHeight),
	);

	fs.mkdirSync(path.dirname(output), { recursive: true });
	const temporary = `${output}.tmp-${process.pid}.jpg`;
	await image
		.resize(resizedWidth, resizedHeight, { fit: "fill" })
		.extract({
			left,
			top,
			width: options.imageWidth,
			height: options.imageHeight,
		})
		.jpeg({
			quality: options.jpegQuality,
			progressive: true,
			mozjpeg: true,
		})
		.toFile(temporary);
	fs.renameSync(temporary, output);

	cache[slug] = { hash, url: publicUrl };
	return publicUrl;
}

export function createHeroShareCardGenerator(eleventyConfig) {
	const queue = new Map();

	eleventyConfig.on("eleventy.after", async () => {
		if (queue.size === 0) {
			return;
		}

		const cache = loadCache(heroShareCardOptions.cacheFile);
		const force = process.env.FORCE_SHARE_CARDS === "true";
		for (const [slug, hero] of queue) {
			await deriveHeroShareCard(
				hero,
				slug,
				heroShareCardOptions,
				cache,
				force,
			);
			queue.delete(slug);
		}
		saveCache(heroShareCardOptions.cacheFile, cache);
	});

	return async function generateHeroShareCard(hero, slug) {
		if (!slug) {
			throw new Error("A slug is required to generate a hero share card");
		}
		queue.set(slug, hero);
		return `${heroShareCardOptions.outputUrlPath.replace(/\/$/, "")}/${slug}.jpg`;
	};
}
