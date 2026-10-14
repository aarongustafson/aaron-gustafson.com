import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { resolveMetadata } from "../../_11ty/metadata.js";
import { readMetadataRecord, writeAuditCsv } from "./metadata-audit.js";

const site = {
	url: "https://example.com",
	title: "Example Site",
	description: "Site description.",
	logo: "/logo.png",
	logo_alt: "The Example Site logo.",
	logo_width: 800,
	logo_height: 600,
	lang: "en_US",
	twitter: { username: "example" },
};

test("metadata keeps branded document titles and unbranded social titles", () => {
	const metadata = resolveMetadata({
		title: "A long visible page title",
		meta_description: "Search description.",
		social_description: "Social description.",
		page: { url: "/article/" },
		site,
	});

	assert.equal(
		metadata.documentTitle,
		"A long visible page title :: Example Site",
	);
	assert.equal(metadata.socialTitle, "A long visible page title");
	assert.equal(metadata.metaDescription, "Search description.");
	assert.equal(metadata.socialDescription, "Social description.");
	assert.equal(metadata.canonicalUrl, "https://example.com/article/");
});

test("metadata prefers front matter descriptions over generated excerpts", () => {
	const metadata = resolveMetadata({
		title: "Article",
		description: "Concise authored description.",
		excerpt: "<p>A much longer generated excerpt.</p>",
		page: { url: "/article/" },
		site,
	});

	assert.equal(metadata.metaDescription, "Concise authored description.");
	assert.equal(metadata.socialDescription, "Concise authored description.");
});

test("generated cards include known dimensions and accessible image text", () => {
	const metadata = resolveMetadata({
		title: "Article",
		image: "/i/share-cards/article.jpg",
		page: { url: "/article/" },
		site,
		is_post: true,
	});

	assert.equal(metadata.type, "article");
	assert.equal(metadata.image, "https://example.com/i/share-cards/article.jpg");
	assert.equal(metadata.imageWidth, 1200);
	assert.equal(metadata.imageHeight, 630);
	assert.equal(metadata.imageType, "image/jpeg");
	assert.equal(
		metadata.imageAlt,
		"A share card with a crocheted doll of Aaron Gustafson and the title “Article”.",
	);
});

test("links without descriptions use their first source paragraph", () => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "metadata-source-"));
	const inputPath = path.join(root, "link.md");
	fs.writeFileSync(
		inputPath,
		"---\ntitle: Link\n---\n\nA useful summary from the saved link.\n\n> A quotation.\n",
	);

	try {
		const metadata = resolveMetadata({
			title: "Link",
			body_class: "link",
			is_post: true,
			page: { url: "/link/", inputPath },
			site,
		});
		assert.equal(
			metadata.metaDescription,
			"A useful summary from the saved link.",
		);
	} finally {
		fs.rmSync(root, { recursive: true, force: true });
	}
});

test("external images are not assigned an unverified media type", () => {
	const metadata = resolveMetadata({
		title: "Link",
		og_image: "https://images.example.com/preview/",
		page: { url: "/link/" },
		site,
	});

	assert.equal(metadata.imageType, undefined);
	assert.equal(metadata.imageWidth, undefined);
	assert.equal(metadata.imageHeight, undefined);
});

test("metadata audit reports effective over-limit values and writes review columns", () => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "metadata-audit-"));
	const postDirectory = path.join(root, "src/posts");
	fs.mkdirSync(path.join(root, "src/_data"), { recursive: true });
	fs.mkdirSync(postDirectory, { recursive: true });
	fs.writeFileSync(
		path.join(root, "src/_data/site.json"),
		JSON.stringify(site),
	);
	const postPath = path.join(postDirectory, "2026-01-01-example.md");
	fs.writeFileSync(
		postPath,
		`---\ntitle: "${"Long ".repeat(15).trim()}"\ndescription: "${"Description ".repeat(20).trim()}"\n---\n\nBody.\n`,
	);
	const csvPath = path.join(root, "review.csv");

	try {
		const record = readMetadataRecord(postPath, root);
		assert.ok(record.overLimit.includes("meta_description"));
		assert.ok(record.overLimit.includes("social_description"));
		assert.equal(writeAuditCsv([record], csvPath), 1);
		const csv = fs.readFileSync(csvPath, "utf8");
		assert.doesNotMatch(csv, /proposed_seo_title/);
		assert.match(csv, /proposed_meta_description/);
		assert.match(csv, /proposed_social_description/);
		assert.match(csv, /review_status/);
	} finally {
		fs.rmSync(root, { recursive: true, force: true });
	}
});
