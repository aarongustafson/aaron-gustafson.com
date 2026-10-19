import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import sharp from "sharp";
import { shareCardOptions } from "../../_11ty/share-card-config.js";
import { buildPostShareCard } from "./manage-share-cards.js";

function fixture(t) {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "single-share-card-"));
	t.after(() => fs.rmSync(root, { recursive: true, force: true }));
	const post = path.join(root, "2026-01-01-selected.md");
	const otherPost = path.join(root, "2026-01-02-other.md");
	const outputDir = path.join(root, "cards");
	fs.mkdirSync(outputDir);
	fs.writeFileSync(
		post,
		'---\ntitle: "Selected &amp; Ready"\ntags: [CSS]\n---\n\nBody\n',
	);
	fs.writeFileSync(otherPost, "---\ntitle: [invalid yaml\n---\n");
	const otherCard = path.join(outputDir, "other.jpg");
	fs.writeFileSync(otherCard, "unchanged");
	const cardOptions = {
		...shareCardOptions,
		outputDir,
		cacheFile: path.join(root, "text-cache.json"),
		verbose: false,
	};
	const heroOptions = {
		outputDir,
		outputUrlPath: cardOptions.outputUrlPath,
		cacheFile: path.join(root, "hero-cache.json"),
		staticDir: path.join(root, "static"),
		imageWidth: 1200,
		imageHeight: 630,
		jpegQuality: 90,
	};
	const otherEntry = { hash: "other-hash", url: "/i/share-cards/other.jpg" };
	for (const options of [cardOptions, heroOptions]) {
		fs.writeFileSync(options.cacheFile, JSON.stringify({ other: otherEntry }));
	}
	return {
		root,
		post,
		otherPost,
		otherCard,
		cardOptions,
		heroOptions,
		otherEntry,
	};
}

test("single-post text build writes one card and only its frontmatter", async (t) => {
	const f = fixture(t);
	const otherSource = fs.readFileSync(f.otherPost);
	const otherTime = fs.statSync(f.otherCard).mtimeMs;
	const heroCache = fs.readFileSync(f.heroOptions.cacheFile);
	const summary = await buildPostShareCard(f.post, f);

	assert.deepEqual(summary, {
		posts: 1,
		updated: 1,
		skipped: 0,
		missingOutputs: [],
	});
	const output = path.join(f.cardOptions.outputDir, "selected.jpg");
	const metadata = await sharp(output).metadata();
	assert.equal(metadata.width, 1200);
	assert.equal(metadata.height, 630);
	assert.match(
		fs.readFileSync(f.post, "utf8"),
		/image: "\/i\/share-cards\/selected\.jpg"/,
	);
	assert.deepEqual(fs.readFileSync(f.otherPost), otherSource);
	assert.equal(fs.statSync(f.otherCard).mtimeMs, otherTime);
	assert.deepEqual(fs.readFileSync(f.heroOptions.cacheFile), heroCache);
	assert.deepEqual(
		JSON.parse(fs.readFileSync(f.cardOptions.cacheFile)).other,
		f.otherEntry,
	);

	fs.appendFileSync(f.post, "\nMore body text.\n");
	await buildPostShareCard(f.post, { ...f, force: true });
	assert.deepEqual(fs.readdirSync(f.cardOptions.outputDir).sort(), [
		"other.jpg",
		"selected.jpg",
	]);
	assert.equal(fs.statSync(f.otherCard).mtimeMs, otherTime);
	assert.deepEqual(
		JSON.parse(fs.readFileSync(f.cardOptions.cacheFile)).other,
		f.otherEntry,
	);
});

test("single-post hero build preserves unrelated caches and source images", async (t) => {
	const f = fixture(t);
	const source = path.join(f.heroOptions.staticDir, "i/hero.png");
	fs.mkdirSync(path.dirname(source), { recursive: true });
	await sharp({
		create: { width: 300, height: 500, channels: 3, background: "#369" },
	})
		.png()
		.toFile(source);
	const original = fs.readFileSync(source);
	fs.writeFileSync(
		f.post,
		'---\ntitle: "Hero"\nhero:\n  src: /i/hero.png\n---\n',
	);
	const textCache = fs.readFileSync(f.cardOptions.cacheFile);
	await buildPostShareCard(f.post, f);
	const output = path.join(f.cardOptions.outputDir, "selected.jpg");
	const metadata = await sharp(output).metadata();
	assert.equal(metadata.width, 1200);
	assert.equal(metadata.height, 630);
	assert.deepEqual(fs.readFileSync(source), original);
	assert.deepEqual(fs.readFileSync(f.cardOptions.cacheFile), textCache);

	fs.utimesSync(output, new Date(0), new Date(0));
	await buildPostShareCard(f.post, f);
	assert.equal(fs.statSync(output).mtimeMs, 0);
	await buildPostShareCard(f.post, { ...f, force: true });
	assert.ok(fs.statSync(output).mtimeMs > 0);
	assert.deepEqual(
		JSON.parse(fs.readFileSync(f.heroOptions.cacheFile)).other,
		f.otherEntry,
	);
});

test("single-post dry run does not write images, frontmatter, or caches", async (t) => {
	const f = fixture(t);
	const source = fs.readFileSync(f.post);
	const cache = fs.readFileSync(f.cardOptions.cacheFile);
	const summary = await buildPostShareCard(f.post, {
		...f,
		dryRun: true,
		force: true,
	});
	assert.equal(summary.posts, 1);
	assert.equal(summary.updated, 1);
	assert.equal(summary.missingOutputs.length, 1);
	assert.deepEqual(fs.readFileSync(f.post), source);
	assert.deepEqual(fs.readFileSync(f.cardOptions.cacheFile), cache);
	assert.deepEqual(fs.readdirSync(f.cardOptions.outputDir), ["other.jpg"]);
});

test("single-post builds preserve custom images even with force", async (t) => {
	const f = fixture(t);
	const source =
		'---\ntitle: "Custom"\nimage: https://example.com/custom.jpg\n---\n';
	fs.writeFileSync(f.post, source);
	const cache = fs.readFileSync(f.cardOptions.cacheFile);
	const summary = await buildPostShareCard(f.post, { ...f, force: true });
	assert.equal(summary.skipped, 1);
	assert.equal(fs.readFileSync(f.post, "utf8"), source);
	assert.deepEqual(fs.readFileSync(f.cardOptions.cacheFile), cache);
	assert.deepEqual(fs.readdirSync(f.cardOptions.outputDir), ["other.jpg"]);
});

test("single-post builds report hero failures without adding image frontmatter", async (t) => {
	const f = fixture(t);
	const source =
		'---\ntitle: "Missing hero"\nhero:\n  src: /missing.jpg\n---\n';
	fs.writeFileSync(f.post, source);
	await assert.rejects(
		buildPostShareCard(f.post, f),
		/Hero source does not exist/,
	);
	assert.equal(fs.readFileSync(f.post, "utf8"), source);
});

test("single-post text failures cannot be hidden by a stale image", async (t) => {
	const f = fixture(t);
	fs.writeFileSync(
		path.join(f.cardOptions.outputDir, "selected.jpg"),
		"old image",
	);
	await assert.rejects(
		buildPostShareCard(f.post, {
			...f,
			cardOptions: {
				...f.cardOptions,
				baseImagePath: path.join(f.root, "missing.jpg"),
			},
		}),
		/Failed to generate share card/,
	);
	assert.doesNotMatch(fs.readFileSync(f.post, "utf8"), /^image:/m);
});

test("single-post CLI rejects missing targets without a site build", () => {
	const result = spawnSync(
		process.execPath,
		[".github/scripts/manage-share-cards.js", "--post", "--force"],
		{ encoding: "utf8" },
	);
	assert.equal(result.status, 1);
	assert.match(result.stderr, /--post requires a Markdown file path/);
	assert.doesNotMatch(result.stdout, /Posts:|Copied|Wrote/);
});
