import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
	contentExcerpt,
	contentExcerptSource,
	plainText,
	resolveMetadata,
} from "../../_11ty/metadata.js";
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

test("plain text preserves element names and syntax inside Markdown code", () => {
	assert.equal(
		plainText("Use `<input>`, `<form-dropzone>`, and `<atom:entry>`."),
		"Use <input>, <form-dropzone>, and <atom:entry>.",
	);
	assert.equal(
		plainText("Keep `my_attribute`, `data-*`, `a ** b`, and `` `value` ``."),
		"Keep my_attribute, data-*, a ** b, and `value`.",
	);
	assert.equal(
		plainText("Compare `a < b && c > d` and `[^1]`."),
		"Compare a < b && c > d and [^1].",
	);
});

test("plain text parses formatting, balanced links, references, and attributes", () => {
	assert.equal(
		plainText("**Bold** and *emphasized* with ~~deleted~~ text."),
		"Bold and emphasized with deleted text.",
	);
	assert.equal(
		plainText(
			'[A `<button>`](https://example.com/a_(b) "Title") and [guide][ref].\n\n[ref]: https://example.com/guide',
		),
		"A <button> and guide.",
	);
	assert.equal(
		plainText(
			"# Mixed-case heading {#old-id}\n\nUse `<input>`{.language-html}.",
		),
		"Mixed-case heading Use <input>.",
	);
});

test("plain text strips actual HTML and decodes entities once", () => {
	assert.equal(
		plainText(
			'<p>Use <code>&lt;input&gt;</code> &amp; <em>HTML</em>. <a href="https://example.com">Guide</a></p>',
		),
		"Use <input> & HTML. Guide",
	);
	assert.equal(
		plainText("<code>&amp;lt;input&amp;gt;</code>"),
		"&lt;input&gt;",
	);
	assert.equal(plainText("1 < 2 &amp; 3 > 1"), "1 < 2 & 3 > 1");
	assert.equal(plainText("<!-- hidden -->\n\nA\n  summary."), "A summary.");
	assert.equal(plainText(), "");
});

test("plain text keeps Markdown image descriptions but skips HTML images", () => {
	assert.equal(
		plainText(
			'![*Diagram* of `<input>`](diagram.png "Title") <img src="other.png" alt="Hidden">',
		),
		"Diagram of <input>",
	);
});

test("plain text omits defined and excerpt-only footnotes without editing code", () => {
	assert.equal(
		plainText(
			"Summary[^1] and details[^named].\n\n[^1]: Not metadata.\n[^named]: Also not metadata.",
		),
		"Summary and details.",
	);
	assert.equal(
		plainText("Summary[^1] and details[^named], but keep `[^1]`."),
		"Summary and details, but keep [^1].",
	);
});

test("excerpt extraction can retain Markdown until its final conversion", () => {
	const body =
		"<!-- comment -->\n\nUse `<input>` with **labels**.[^1]\n\nSecond paragraph.\n\n<!-- more -->\n\n[^1]: A footnote.";
	assert.equal(
		contentExcerptSource(body),
		"Use `<input>` with **labels**.[^1]",
	);
	assert.equal(contentExcerpt(body), "Use <input> with labels.");
});

test("metadata preserves code in descriptions, titles and generated image text", () => {
	const metadata = resolveMetadata({
		title: "Working with `<input>`",
		description: "The `<form-dropzone>` component enhances a native `<input>`.",
		image: "/i/share-cards/article.jpg",
		page: { url: "/article/" },
		site,
	});
	assert.equal(metadata.documentTitle, "Working with <input> :: Example Site");
	assert.equal(metadata.socialTitle, "Working with <input>");
	assert.equal(
		metadata.metaDescription,
		"The <form-dropzone> component enhances a native <input>.",
	);
	assert.equal(metadata.socialDescription, metadata.metaDescription);
	assert.equal(
		metadata.imageAlt,
		"A share card with a crocheted doll of Aaron Gustafson and the title “Working with <input>”.",
	);
});

test("metadata does not reparse normalized site names, descriptions or image text", () => {
	const metadata = resolveMetadata({
		site: {
			...site,
			title: "The `<input>` site",
			description: "About `<input>` and `my_attribute`.",
		},
	});
	assert.equal(metadata.siteName, "The <input> site");
	assert.equal(metadata.documentTitle, "The <input> site");
	assert.equal(metadata.socialTitle, "The <input> site");
	assert.equal(metadata.metaDescription, "About <input> and my_attribute.");
	assert.equal(metadata.socialDescription, metadata.metaDescription);
	assert.equal(metadata.imageAlt, "The Example Site logo.");
	const withoutLogo = resolveMetadata({
		title: "The `<input>` element",
		site: { url: site.url, title: site.title },
	});
	assert.equal(withoutLogo.imageAlt, "Preview image for The <input> element.");
});

test("metadata converts authored HTML excerpts and custom alt text once", () => {
	const metadata = resolveMetadata({
		excerpt:
			"<p>Use <code>&lt;input&gt;</code> &amp; <code>my_attribute</code>.</p>",
		image_alt: "Diagram of `<input>` and **labels**.",
		site,
	});
	assert.equal(metadata.metaDescription, "Use <input> & my_attribute.");
	assert.equal(metadata.socialDescription, metadata.metaDescription);
	assert.equal(metadata.imageAlt, "Diagram of <input> and labels.");
});

test("Eleventy escapes literal element references in the actual metadata template", async (t) => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "metadata-render-"));
	t.after(() => fs.rmSync(root, { recursive: true, force: true }));
	const input = path.join(root, "src");
	const output = path.join(root, "dist");
	const configPath = path.join(root, "eleventy.config.mjs");
	fs.mkdirSync(input);
	fs.writeFileSync(configPath, "export default function () {};\n");
	fs.copyFileSync(
		new URL(
			"../../src/_includes/partials/global/metadata.njk",
			import.meta.url,
		),
		path.join(input, "index.njk"),
	);
	const metadata = resolveMetadata({
		title: "Use `<input>`",
		description: "Enhance `<input>` with `<form-dropzone>`.",
		image: "/i/share-cards/article.jpg",
		site,
	});
	const { default: Eleventy } = await import("@11ty/eleventy");
	const eleventy = new Eleventy(input, output, {
		configPath,
		quietMode: true,
		config(config) {
			config.addGlobalData("site", { ...site, author: { name: "Author" } });
			config.addGlobalData("metadata", metadata);
		},
	});
	await eleventy.write();
	const html = fs.readFileSync(path.join(output, "index.html"), "utf8");
	assert.match(html, /<title>Use &lt;input&gt; :: Example Site<\/title>/);
	for (const selector of [
		'name="description"',
		'property="og:description"',
		'name="twitter:description"',
	]) {
		assert.ok(
			html.includes(
				`<meta ${selector} content="Enhance &lt;input&gt; with &lt;form-dropzone&gt;.">`,
			),
		);
	}
	assert.match(html, /property="og:image:alt" content="[^"]*Use &lt;input&gt;/);
	assert.doesNotMatch(html, /<(?:input|form-dropzone)\b/);
});

test("source excerpts and metadata audit retain element names through fallback paths", (t) => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "metadata-code-"));
	t.after(() => fs.rmSync(root, { recursive: true, force: true }));
	fs.mkdirSync(path.join(root, "src/posts"), { recursive: true });
	fs.mkdirSync(path.join(root, "src/_data"), { recursive: true });
	fs.writeFileSync(
		path.join(root, "src/_data/site.json"),
		JSON.stringify(site),
	);
	const inputPath = path.join(root, "src/posts/2026-01-01-example.md");
	fs.writeFileSync(
		inputPath,
		'---\ntitle: "Use `<input>`"\n---\n\nKeep `<input>` and `my_attribute`.[^1]\n\nMore text.',
	);
	const metadata = resolveMetadata({
		is_post: true,
		page: { inputPath, url: "/article/" },
		site,
	});
	assert.equal(metadata.metaDescription, "Keep <input> and my_attribute.");
	assert.equal(metadata.socialDescription, metadata.metaDescription);
	const record = readMetadataRecord(inputPath, root);
	assert.equal(record.title, "Use <input>");
	assert.equal(
		record.values.meta_description,
		"Keep <input> and my_attribute.",
	);
	assert.equal(
		record.values.social_description,
		record.values.meta_description,
	);
});

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
