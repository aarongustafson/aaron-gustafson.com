import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import { deriveHeroShareCard } from "../../_11ty/hero-share-card.js";
import postData from "../../src/posts/posts.11tydata.js";
import siteData from "../../src/src.11tydata.js";
import {
	insertImageFrontmatter,
	syncPostImages,
} from "./share-card-frontmatter.js";

const site = {
	url: "https://example.com",
	title: "Aaron Gustafson",
	social_image: "/i/share-card.jpg",
};

test("HTML pages generate titled cards instead of using the blank fallback", async () => {
	let received;
	const metadata = await siteData.eleventyComputed.metadata.call(
		{
			generateShareCard(text, slug) {
				received = { text, slug };
				return `/i/share-cards/${slug}.jpg`;
			},
		},
		{
			title: "<cite>Web Components</cite> &amp; More",
			site,
			page: { url: "/web-components/" },
		},
	);

	assert.deepEqual(received.text, ["Web Components & More"]);
	assert.match(received.slug, /^page-[a-f0-9]{16}$/);
	assert.equal(
		metadata.image,
		`https://example.com/i/share-cards/${received.slug}.jpg`,
	);
	assert.equal(metadata.imageWidth, 1200);
	assert.equal(metadata.imageHeight, 630);
	assert.match(metadata.imageAlt, /title “Web Components & More”/);
});

test("page and post cards preserve bracketed element names and code punctuation", async () => {
	const title = "Use `<input>` and `data-*`";
	const received = [];
	const context = {
		generateShareCard(text, slug) {
			received.push(text);
			return `/i/share-cards/${slug}.jpg`;
		},
	};
	const metadata = await siteData.eleventyComputed.metadata.call(context, {
		title,
		site,
		page: { url: "/input/" },
	});
	await postData.eleventyComputed.image.call(context, {
		title,
		tags: [],
		page: { fileSlug: "input" },
	});
	assert.equal(received.length, 2);
	for (const text of received) {
		assert.equal(text[0], "Use <input> and data-*");
	}
	assert.equal(metadata.socialTitle, "Use <input> and data-*");
	assert.match(metadata.imageAlt, /title “Use <input> and data-\*”/);
});

test("page cards preserve explicit image precedence", async () => {
	for (const images of [
		{ social_image: "/social.jpg", image: "/image.jpg", og_image: "/og.jpg" },
		{ image: "/image.jpg", og_image: "/og.jpg" },
		{ og_image: "https://external.example/og.jpg" },
	]) {
		const metadata = await siteData.eleventyComputed.metadata.call(
			{
				generateShareCard() {
					throw new Error("Explicit images should not generate a card");
				},
			},
			{ ...images, site, page: { url: "/example/" } },
		);
		assert.equal(
			metadata.image,
			new URL(images.social_image || images.image || images.og_image, site.url)
				.href,
		);
	}
});

test("page card names are stable and unique across sections and pagination", async () => {
	const slugs = [];
	const context = {
		generateShareCard(text, slug) {
			slugs.push(slug);
			return `/i/share-cards/${slug}.jpg`;
		},
	};
	for (const url of [
		"/about/",
		"/about/",
		"/publications/about/",
		"/notebook/",
		"/notebook/pg-2/",
	]) {
		await siteData.eleventyComputed.metadata.call(context, {
			title: "Example",
			site,
			page: { url, fileSlug: "index" },
		});
	}
	assert.equal(slugs[0], slugs[1]);
	assert.equal(new Set(slugs).size, 4);
});

test("non-HTML and unpublished outputs do not generate page cards", async () => {
	for (const url of [
		"/feeds/all.xml",
		"/feeds/all.json",
		"/sitemap.xml",
		false,
		undefined,
	]) {
		await siteData.eleventyComputed.metadata.call(
			{
				generateShareCard() {
					throw new Error("Non-HTML outputs should not generate cards");
				},
			},
			{ site, page: { url } },
		);
	}
});

test("HTML files and untitled pages get usable cards", async () => {
	let texts;
	await siteData.eleventyComputed.metadata.call(
		{
			generateShareCard(value) {
				texts = value;
				return "/i/share-cards/error.jpg";
			},
		},
		{ site, page: { url: "/404.html" } },
	);
	assert.deepEqual(texts, ["Aaron Gustafson"]);
});

test("page metadata supports Eleventy's non-enumerable computed-data proxy", async () => {
	const data = {
		title: "Web Components",
		site,
		page: { url: "/web-components/" },
	};
	const proxy = new Proxy({}, { get: (target, key) => data[key] });
	const metadata = await siteData.eleventyComputed.metadata.call(
		{
			generateShareCard() {
				return "/i/share-cards/example.jpg";
			},
		},
		proxy,
	);
	assert.equal(metadata.canonicalUrl, "https://example.com/web-components/");
	assert.equal(metadata.image, "https://example.com/i/share-cards/example.jpg");
	assert.equal(metadata.socialTitle, "Web Components");
});

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
			fs.readFileSync(path.join(postsDir, "2026-01-01-example.md"), "utf8"),
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
		const metadata = await sharp(
			path.join(outputDir, "example.jpg"),
		).metadata();
		assert.equal(url, "/i/share-cards/example.jpg");
		assert.equal(metadata.width, 1200);
		assert.equal(metadata.height, 630);
		assert.deepEqual(fs.readFileSync(source), original);
		assert.equal(cache.example.url, url);
	} finally {
		fs.rmSync(root, { recursive: true, force: true });
	}
});

test("hero cards read new and updated originals without creating static copies", async (t) => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "hero-original-"));
	t.after(() => fs.rmSync(root, { recursive: true, force: true }));
	const sourceDir = path.join(root, "source");
	const staticDir = path.join(root, "static");
	fs.mkdirSync(sourceDir);
	fs.mkdirSync(path.join(staticDir, "i"), { recursive: true });
	const source = path.join(sourceDir, "hero.svg");
	const original =
		'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="red"/></svg>';
	fs.writeFileSync(source, original);
	const options = {
		sourceDir,
		staticDir,
		outputDir: path.join(root, "cards"),
		outputUrlPath: "/i/share-cards",
		imageWidth: 1200,
		imageHeight: 630,
		jpegQuality: 90,
	};
	const cache = {};
	await deriveHeroShareCard({ src: "/i/hero.svg" }, "example", options, cache);
	assert.equal(fs.existsSync(path.join(staticDir, "i/hero.svg")), false);
	const previousHash = cache.example.hash;
	const output = path.join(options.outputDir, "example.jpg");
	const previousImage = fs.readFileSync(output);
	// A stale tracked copy must not hide an updated original.
	fs.writeFileSync(path.join(staticDir, "i/hero.svg"), original);
	fs.writeFileSync(source, original.replace("red", "blue"));
	await deriveHeroShareCard({ src: "/i/hero.svg" }, "example", options, cache);
	assert.notEqual(cache.example.hash, previousHash);
	assert.notDeepEqual(fs.readFileSync(output), previousImage);
	assert.equal(
		fs.readFileSync(path.join(staticDir, "i/hero.svg"), "utf8"),
		original,
	);
	await assert.rejects(
		deriveHeroShareCard({ src: "/i/../../outside.svg" }, "bad", options, cache),
		/outside the (static|image) directory/,
	);
});
