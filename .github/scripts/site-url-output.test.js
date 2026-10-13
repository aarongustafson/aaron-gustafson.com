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
