import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import nunjucks from "nunjucks";

import { htmlBaseOptions } from "../../_11ty/html-base.js";
import filters from "../../_11ty/filters.js";
import { setWebmentionsData } from "../../_11ty/webmentions-store.js";
import sequoiaData from "../../src/_data/sequoia.js";

test("HTML base configuration preserves authored URLs", () => {
	assert.deepEqual(htmlBaseOptions, { baseHref: "/" });
});

test("the site title uses a root-relative homepage URL", () => {
	const baseLayout = fs.readFileSync(
		new URL("../../src/_includes/layouts/base.njk", import.meta.url),
		"utf8",
	);

	assert.match(
		baseLayout,
		/<a href="\/" aria-label="Return to Aaron Gustafson’s homepage">/,
	);
	assert.doesNotMatch(baseLayout, /\bsite_url\b/);
});

test("all site pages expose the publication and only articles expose a document", () => {
	const baseLayout = fs.readFileSync(
		new URL("../../src/_includes/layouts/base.njk", import.meta.url),
		"utf8",
	);
	const config = JSON.parse(
		fs.readFileSync(new URL("../../sequoia.json", import.meta.url), "utf8"),
	);
	const verification = fs.readFileSync(
		new URL(
			"../../src/static/.well-known/site.standard.publication",
			import.meta.url,
		),
		"utf8",
	).trim();
	const sequoia = sequoiaData();
	assert.equal(sequoia.publicationUri, config.publicationUri);
	assert.equal(sequoia.publicationUri, verification);

	class EmptyPartialsLoader extends nunjucks.Loader {
		getSource(name) {
			return { src: "", path: name, noCache: true };
		}
	}
	const environment = new nunjucks.Environment(new EmptyPartialsLoader());
	environment.addFilter("svgContents", () => "");
	const atUri = "at://did:plc:example/site.standard.document/article";

	for (const page of [
		{ url: "/", body_class: "home" },
		{ url: "/notebook/" },
		{ url: "/notebook/article/", atUri },
	]) {
		const html = environment.renderString(baseLayout, {
			site: { title: "Example Site", repo_url: "" },
			build: {},
			sequoia,
			page: { url: page.url },
			...page,
		});
		const publicationLinks = html.match(
			/<link rel="site\.standard\.publication" href="([^"]+)"\s*\/?>/g,
		);
		assert.equal(publicationLinks?.length, 1, page.url);
		assert.ok(publicationLinks[0].includes(`href="${config.publicationUri}"`));
		assert.equal(
			(html.match(/rel="site\.standard\.document"/g) ?? []).length,
			page.atUri ? 1 : 0,
			page.url,
		);
		assert.equal(
			html.includes(`<link rel="site.standard.document" href="${atUri}"`),
			Boolean(page.atUri),
			page.url,
		);
	}
});

test("webmentions use each post's absolute canonical target", () => {
	const webmentionsPartial = fs.readFileSync(
		new URL(
			"../../src/_includes/partials/post/webmentions.njk",
			import.meta.url,
		),
		"utf8",
	);
	const webmentionsScript = fs.readFileSync(
		new URL("../../src/_javascript/post/WebmentionIO.js", import.meta.url),
		"utf8",
	);

	assert.match(
		webmentionsPartial,
		/data-webmention-target="\{\{ this_url \}\}"/,
	);
	assert.match(webmentionsScript, /getAttribute\("data-webmention-target"\)/);
	assert.match(
		webmentionsScript,
		/endpoint\.searchParams\.set\("per-page",\s*"10000"\)/,
	);
	assert.match(
		webmentionsScript,
		/endpoint\.searchParams\.append\("target\[\]",\s*value\)/,
	);
});

test("the carbon badge requests the absolute canonical page URL", () => {
	const carbonBadgePartial = fs.readFileSync(
		new URL(
			"../../src/_includes/partials/global/carbon-badge.njk",
			import.meta.url,
		),
		"utf8",
	);
	const carbonBadgeScript = fs.readFileSync(
		new URL("../../src/_javascript/main/carbon-badge.js", import.meta.url),
		"utf8",
	);

	assert.match(
		carbonBadgePartial,
		/data-carbon-target="\{\{ site\.url \+ page\.url \}\}"/,
	);
	assert.match(carbonBadgeScript, /getAttribute\("data-carbon-target"\)/);
	assert.match(carbonBadgeScript, /https:\/\/api\.websitecarbon\.com\/b\?url=/);
	assert.doesNotMatch(carbonBadgePartial, /website-carbon-badges/);
});

test("webmentions stay in the shared lookup store", () => {
	setWebmentionsData({
		urlIndex: {
			"https://example.com/current/": [2],
			"https://example.com/old/": [1, 2],
		},
		compactData: {
			1: { "wm-id": 1, name: "First" },
			2: { "wm-id": 2, name: "Second" },
		},
	});

	const mentions = filters.getWebmentionsForUrl(
		{ totalCount: 2 },
		"https://example.com/current/",
		"https://example.com/old/",
	);

	assert.deepEqual(
		mentions.map((mention) => mention["wm-id"]),
		[1, 2],
	);
});
