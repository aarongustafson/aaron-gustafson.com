import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
	isOptimizedCacheHit,
	shouldEmitImage,
	smallestBuffer,
} from "../../_tasks/images.js";

test("optimized image cache requires matching content and optimizer", () => {
	const directory = fs.mkdtempSync(path.join(os.tmpdir(), "image-cache-"));
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

test("original or missing artifacts are never optimized cache hits", () => {
	const directory = fs.mkdtempSync(path.join(os.tmpdir(), "image-cache-"));
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

test("watch mode emits only cache misses", () => {
	assert.equal(shouldEmitImage(true, true), false);
	assert.equal(shouldEmitImage(false, true), true);
	assert.equal(shouldEmitImage(true, false), true);
});
