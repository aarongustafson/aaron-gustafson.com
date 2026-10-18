import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
	buildImages,
	isOptimizedCacheHit,
	smallestBuffer,
} from "../../_tasks/images.js";

test("optimized image cache requires matching content and optimizer", (t) => {
	const directory = fs.mkdtempSync(path.join(os.tmpdir(), "image-cache-"));
	t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
	const output = path.join(directory, "image.jpg");
	fs.writeFileSync(output, "optimized");

	const cached = {
		hash: "source-hash",
		optimized: true,
		optimizer: "optimizer-hash",
	};

	assert.equal(
		isOptimizedCacheHit(cached, "source-hash", "optimizer-hash", output),
		true,
	);
	assert.equal(
		isOptimizedCacheHit(cached, "changed-source", "optimizer-hash", output),
		false,
	);
	assert.equal(
		isOptimizedCacheHit(cached, "source-hash", "changed-optimizer", output),
		false,
	);
});

test("original or missing artifacts are never optimized cache hits", (t) => {
	const directory = fs.mkdtempSync(path.join(os.tmpdir(), "image-cache-"));
	t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
	const missingOutput = path.join(directory, "missing.jpg");
	const cached = {
		hash: "source-hash",
		optimized: false,
		optimizer: "optimizer-hash",
	};

	assert.equal(
		isOptimizedCacheHit(cached, "source-hash", "optimizer-hash", missingOutput),
		false,
	);

	cached.optimized = true;
	assert.equal(
		isOptimizedCacheHit(cached, "source-hash", "optimizer-hash", missingOutput),
		false,
	);
});

test("optimization never increases the artifact size", () => {
	const original = Buffer.from("small");
	const larger = Buffer.from("larger optimized output");
	const smaller = Buffer.from("tiny");

	assert.equal(smallestBuffer(original, larger), original);
	assert.equal(smallestBuffer(original, smaller), smaller);
});

function fixture(t) {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "image-build-"));
	t.after(() => fs.rmSync(root, { recursive: true, force: true }));
	const options = {
		sourceDir: path.join(root, "source"),
		staticDir: path.join(root, "static"),
		outputDir: path.join(root, "dist"),
		cacheDir: path.join(root, "cache"),
		disableOptimization: false,
	};
	fs.mkdirSync(options.sourceDir);
	const source = path.join(options.sourceDir, "example.svg");
	fs.writeFileSync(
		source,
		'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">\n<!-- removable comment -->\n<rect width="100" height="100" fill="red"/>\n</svg>',
	);
	const media = Buffer.from([0, 255, 128, 64, 0, 1]);
	fs.writeFileSync(path.join(options.sourceDir, "example.mp4"), media);
	return {
		options,
		source,
		media,
		key: path.relative(process.cwd(), source),
		cacheFile: path.join(options.cacheDir, "optimized-images.json"),
		artifact: path.join(options.cacheDir, "optimized-images/example.svg"),
		staticFile: path.join(options.staticDir, "example.svg"),
		outputFile: path.join(options.outputDir, "example.svg"),
	};
}

test("warm builds do no optimization, output writes, or cache rewrites", async (t) => {
	const f = fixture(t);
	const cold = await buildImages(f.options);
	assert.equal(cold.optimized, 1);
	assert.equal(cold.written, 4);
	assert.ok(fs.statSync(f.staticFile).size < fs.statSync(f.source).size);
	assert.deepEqual(
		fs.readFileSync(path.join(f.options.outputDir, "example.mp4")),
		f.media,
	);
	const paths = [
		f.cacheFile,
		f.artifact,
		f.staticFile,
		f.outputFile,
		path.join(f.options.staticDir, "example.mp4"),
		path.join(f.options.outputDir, "example.mp4"),
	];
	const timestamp = new Date("2000-01-01T00:00:00Z");
	for (const file of paths) fs.utimesSync(file, timestamp, timestamp);
	const warm = await buildImages(f.options);
	assert.equal(warm.optimized, 0);
	assert.equal(warm.cached, 1);
	assert.equal(warm.written, 0);
	assert.equal(warm.unchanged, 4);
	for (const file of paths)
		assert.equal(fs.statSync(file).mtimeMs, timestamp.getTime());
});

test("clean output directories are repopulated without reoptimization", async (t) => {
	const f = fixture(t);
	await buildImages(f.options);
	fs.unlinkSync(f.outputFile);
	fs.unlinkSync(path.join(f.options.outputDir, "example.mp4"));
	const result = await buildImages(f.options);
	assert.equal(result.optimized, 0);
	assert.equal(result.cached, 1);
	assert.equal(result.written, 2);
	assert.deepEqual(fs.readFileSync(f.outputFile), fs.readFileSync(f.artifact));
	assert.deepEqual(
		fs.readFileSync(path.join(f.options.outputDir, "example.mp4")),
		f.media,
	);
});

test("disabled builds reuse valid artifacts without invalidating the cache", async (t) => {
	const f = fixture(t);
	await buildImages(f.options);
	const cache = fs.readFileSync(f.cacheFile);
	const artifact = fs.readFileSync(f.artifact);
	const disabled = await buildImages({
		...f.options,
		disableOptimization: true,
	});
	assert.equal(disabled.optimized, 0);
	assert.equal(disabled.cached, 1);
	assert.equal(disabled.written, 0);
	assert.deepEqual(fs.readFileSync(f.cacheFile), cache);
	assert.deepEqual(fs.readFileSync(f.staticFile), artifact);
	const enabled = await buildImages(f.options);
	assert.equal(enabled.optimized, 0);
	assert.equal(enabled.written, 0);
});

test("disabled builds copy changed sources without poisoning optimized artifacts", async (t) => {
	const f = fixture(t);
	await buildImages(f.options);
	const cache = fs.readFileSync(f.cacheFile);
	const artifact = fs.readFileSync(f.artifact);
	fs.writeFileSync(
		f.source,
		fs.readFileSync(f.source, "utf8").replace("red", "blue"),
	);
	const disabled = await buildImages({
		...f.options,
		disableOptimization: true,
	});
	assert.equal(disabled.skipped, 1);
	assert.equal(disabled.optimized, 0);
	assert.deepEqual(fs.readFileSync(f.outputFile), fs.readFileSync(f.source));
	assert.deepEqual(fs.readFileSync(f.artifact), artifact);
	assert.deepEqual(fs.readFileSync(f.cacheFile), cache);
	const enabled = await buildImages(f.options);
	assert.equal(enabled.optimized, 1);
	assert.notDeepEqual(fs.readFileSync(f.artifact), artifact);
});

test("cold disabled builds never mark originals as optimized", async (t) => {
	const f = fixture(t);
	const disabled = await buildImages({
		...f.options,
		disableOptimization: true,
	});
	assert.equal(disabled.skipped, 1);
	assert.equal(fs.existsSync(f.cacheFile), false);
	assert.equal(fs.existsSync(f.artifact), false);
	assert.deepEqual(fs.readFileSync(f.staticFile), fs.readFileSync(f.source));
	const enabled = await buildImages(f.options);
	assert.equal(enabled.optimized, 1);
});

test("missing artifacts and optimizer changes invalidate cache entries", async (t) => {
	const f = fixture(t);
	await buildImages(f.options);
	fs.unlinkSync(f.artifact);
	assert.equal((await buildImages(f.options)).optimized, 1);
	const cache = JSON.parse(fs.readFileSync(f.cacheFile));
	cache[f.key].optimizer = "previous-version";
	fs.writeFileSync(f.cacheFile, JSON.stringify(cache));
	assert.equal((await buildImages(f.options)).optimized, 1);
});

test("overwritten output files are repaired from cache rather than reoptimized", async (t) => {
	const f = fixture(t);
	await buildImages(f.options);
	fs.copyFileSync(f.source, f.staticFile);
	const result = await buildImages(f.options);
	assert.equal(result.optimized, 0);
	assert.equal(result.written, 1);
	assert.deepEqual(fs.readFileSync(f.staticFile), fs.readFileSync(f.artifact));
});

test("legacy cache entries migrate once and subsequent builds reuse artifacts", async (t) => {
	const f = fixture(t);
	fs.mkdirSync(f.options.cacheDir);
	fs.writeFileSync(
		f.cacheFile,
		JSON.stringify({
			[f.key]: { mtime: 123, size: 456, processed: 789 },
		}),
	);
	assert.equal((await buildImages(f.options)).optimized, 1);
	assert.equal((await buildImages(f.options)).optimized, 0);
});

test("invalid cache and image data fail the task explicitly", async (t) => {
	const f = fixture(t);
	fs.mkdirSync(f.options.cacheDir);
	fs.writeFileSync(f.cacheFile, "not json");
	await assert.rejects(buildImages(f.options), SyntaxError);
	fs.unlinkSync(f.cacheFile);
	fs.writeFileSync(
		path.join(f.options.sourceDir, "broken.png"),
		"not an image",
	);
	await assert.rejects(
		buildImages(f.options),
		/Error processing .*broken\.png/,
	);
});
