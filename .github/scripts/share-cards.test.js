import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import { deriveHeroShareCard } from "../../_11ty/hero-share-card.js";
import postData from "../../src/posts/posts.11tydata.js";
import {
	insertImageFrontmatter,
	syncPostImages,
} from "./share-card-frontmatter.js";

test("post images skip generation when frontmatter has an image", async () => {
	const result = await postData.eleventyComputed.image.call(
		{
			generateHeroShareCard() {
				throw new Error("Hero generation should not run");
			},
			generateShareCard() {
				throw new Error("Text generation should not run");
			},
		},
		{
			image: "/i/share-cards/example.jpg",
			page: { fileSlug: "example" },
		},
	);

	assert.equal(result, "/i/share-cards/example.jpg");
});

test("posts with heroes queue a derived hero card", async () => {
	let received;
	const hero = { src: "/i/posts/example/hero.jpg", offset: "20" };
	const result = await postData.eleventyComputed.image.call(
		{
			generateHeroShareCard(value, slug) {
				received = { value, slug };
				return "/i/share-cards/example.jpg";
			},
		},
		{
			hero,
			page: { fileSlug: "example" },
		},
	);

	assert.deepEqual(received, { value: hero, slug: "example" });
	assert.equal(result, "/i/share-cards/example.jpg");
});

test("text cards strip title markup and decode entities", async () => {
	let received;
	const result = await postData.eleventyComputed.image.call(
		{
			generateShareCard(text, slug) {
				received = { text, slug };
				return "/i/share-cards/example.jpg";
			},
		},
		{
			title: "<cite>Adaptive Web Design</cite>: Folded &amp; Gathered",
			tags: ["Writing"],
			page: { fileSlug: "example" },
		},
	);

	assert.deepEqual(received, {
		text: ["Adaptive Web Design: Folded & Gathered", "#writing"],
		slug: "example",
	});
	assert.equal(result, "/i/share-cards/example.jpg");
});

test("image frontmatter insertion preserves existing formatting", () => {
	const source =
		'---\r\ntitle: "Example"\r\natUri: "at://example"\r\n---\r\n\r\nBody\r\n';
	const updated = insertImageFrontmatter(
		source,
		"/i/share-cards/example.jpg",
		"example.md",
	);

	assert.equal(
		updated,
		'---\r\ntitle: "Example"\r\natUri: "at://example"\r\nimage: "/i/share-cards/example.jpg"\r\n---\r\n\r\nBody\r\n',
	);
});

test("sync writes only missing image fields", () => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "share-card-sync-"));
	const postsDir = path.join(root, "posts");
	const outputDir = path.join(root, "cards");
	fs.mkdirSync(postsDir);
	fs.mkdirSync(outputDir);
	fs.writeFileSync(
		path.join(postsDir, "2026-01-01-example.md"),
		'---\ntitle: "Example"\n---\n\nBody\n',
		{ mode: 0o755 },
	);
	fs.writeFileSync(
		path.join(postsDir, "2026-01-02-existing.md"),
		'---\ntitle: "Existing"\nimage: "/i/share-cards/existing.jpg"\n---\n',
	);
	fs.writeFileSync(path.join(outputDir, "example.jpg"), "card");

	try {
		const summary = syncPostImages({ postsDir, outputDir });
		assert.deepEqual(summary, {
			posts: 2,
			updated: 1,
			skipped: 1,
			missingOutputs: [],
		});
		assert.match(
			fs.readFileSync(
				path.join(postsDir, "2026-01-01-example.md"),
				"utf8",
			),
			/image: "\/i\/share-cards\/example\.jpg"/,
		);
		assert.equal(
			fs.statSync(path.join(postsDir, "2026-01-01-example.md")).mode & 0o777,
			0o755,
		);
	} finally {
		fs.rmSync(root, { recursive: true, force: true });
	}
});

test("hero cards use cover dimensions without changing the source", async () => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "hero-share-card-"));
	const staticDir = path.join(root, "static");
	const outputDir = path.join(root, "cards");
	const source = path.join(staticDir, "i/posts/example/hero.png");
	fs.mkdirSync(path.dirname(source), { recursive: true });
	await sharp({
		create: {
			width: 400,
			height: 900,
			channels: 3,
			background: "#27831b",
		},
	})
		.png()
		.toFile(source);
	const original = fs.readFileSync(source);
	const options = {
		staticDir,
		outputDir,
		outputUrlPath: "/i/share-cards",
		imageWidth: 1200,
		imageHeight: 630,
		jpegQuality: 90,
	};
	const cache = {};

	try {
		const url = await deriveHeroShareCard(
			{ src: "/i/posts/example/hero.png", offset: "99999" },
			"example",
			options,
			cache,
		);
		const metadata = await sharp(path.join(outputDir, "example.jpg")).metadata();
		assert.equal(url, "/i/share-cards/example.jpg");
		assert.equal(metadata.width, 1200);
		assert.equal(metadata.height, 630);
		assert.deepEqual(fs.readFileSync(source), original);
		assert.equal(cache.example.url, url);
	} finally {
		fs.rmSync(root, { recursive: true, force: true });
	}
});
