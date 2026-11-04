import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import nunjucks from "nunjucks";

const layout = fs.readFileSync(
	new URL("../../src/_includes/layouts/post.njk", import.meta.url),
	"utf8",
);
const heroTemplate = layout.match(
	/\{% if hero %\}[\s\S]*?<\/figure>\s*\{% endif %\}/,
)?.[0];
assert.ok(heroTemplate, "Post layout must contain a hero figure");

const environment = new nunjucks.Environment(null, { autoescape: true });
environment.addFilter("absoluteUrl", (value, base) => new URL(value, base).href);

function renderHero(credit = {}) {
	return environment.renderString(heroTemplate, {
		hero: { src: "/i/hero.jpg", alt: "Example hero", ...credit },
		site: { url: "https://example.com" },
		transition_root: "post-example",
	});
}

for (const [name, credit] of [
	["missing", {}],
	["null", { credit: null }],
	["empty", { credit: "" }],
	["whitespace-only", { credit: " \t\n " }],
	["missing with a URL", { url: "https://example.com/credit" }],
]) {
	test(`post hero omits the credit overlay when credit is ${name}`, () => {
		const html = renderHero(credit);
		assert.match(html, /<img\b/);
		assert.match(html, /alt="Example hero"/);
		assert.doesNotMatch(html, /<figcaption\b|entry__hero__credit|Credit:/);
	});
}

test("post hero preserves plain-text credit", () => {
	const html = renderHero({ credit: "Example Artist" });
	assert.match(html, /<figcaption class="entry__hero__credit">/);
	assert.match(html, /Credit:\s+Example Artist/);
	assert.doesNotMatch(html, /<a\b/);
});

test("post hero preserves linked credit", () => {
	const html = renderHero({
		credit: "Example Artist",
		url: "https://example.com/artist",
	});
	assert.match(html, /<figcaption class="entry__hero__credit">/);
	assert.match(
		html,
		/<a href="https:\/\/example.com\/artist">Example Artist<\/a>/,
	);
});
