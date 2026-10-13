import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import { htmlBaseOptions } from "../../_11ty/html-base.js";

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
	assert.match(
		webmentionsScript,
		/getAttribute\("data-webmention-target"\)/,
	);
	assert.match(webmentionsScript, /"per-page=10000&"/);
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
		new URL(
			"../../src/_javascript/main/carbon-badge.js",
			import.meta.url,
		),
		"utf8",
	);

	assert.match(
		carbonBadgePartial,
		/data-carbon-target="\{\{ site\.url \+ page\.url \}\}"/,
	);
	assert.match(
		carbonBadgeScript,
		/getAttribute\("data-carbon-target"\)/,
	);
	assert.match(
		carbonBadgeScript,
		/https:\/\/api\.websitecarbon\.com\/b\?url=/,
	);
	assert.doesNotMatch(carbonBadgePartial, /website-carbon-badges/);
});
