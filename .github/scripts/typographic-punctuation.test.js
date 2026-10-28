import assert from "node:assert/strict";
import test from "node:test";
import markdownIt from "markdown-it";
import attrs from "markdown-it-attrs";
import { typographMarkdown } from "./typographic-punctuation.js";

const md = markdownIt().use(attrs);

for (const [source, attribute] of [
	[
		'### Dropdown List (`<select>`) {id="dropdown-list-(select)"}',
		'id="dropdown-list-(select)"',
	],
	[
		'## Customizable `<button>` text {id="customizable-button-text"}',
		'id="customizable-button-text"',
	],
	[
		'## Prefer an explicit `<template>`? Bring it! {id="prefer-an-explicit-template%3F-bring-it!"}',
		'id="prefer-an-explicit-template%3F-bring-it!"',
	],
	[
		'[Feed](https://example.com/feed){rel="alternate" type="application/rss+xml"}',
		'rel="alternate" type="application/rss+xml"',
	],
	[
		'1. Outer\n   1. Inner\n   {type="a"}',
		'type="a"',
	],
]) {
	test(`preserves Markdown attribute ${attribute}`, () => {
		const result = typographMarkdown(source);
		assert.equal(result, source);
		assert.ok(md.render(result).includes(attribute));
	});
}

test("protects quoted attribute values while typographing surrounding prose", () => {
	const source = `"It's helpful" [link](/guide){.guide title="Author's guide" data-note='Say "hello"' aria-label="A {useful} guide"} -- isn't it?`;
	const result = typographMarkdown(source);
	assert.equal(
		result,
		`“It’s helpful” [link](/guide){.guide title="Author's guide" data-note='Say "hello"' aria-label="A {useful} guide"} — isn’t it?`,
	);
	assert.equal(typographMarkdown(result), result);
});

test("still typographs prose in braces and preserves existing protected syntax", () => {
	const source = [
		`{"It's prose"} and "normal prose".`,
		'`const label = "Code";` <span title="HTML">Visible</span>',
		`{{ "variable" }} {% set name = "value" %} {# "comment" #}`,
		"```js",
		'const label = "Fenced code";',
		"```",
	].join("\n");
	assert.equal(
		typographMarkdown(source),
		[
			"{“It’s prose”} and “normal prose”.",
			'`const label = "Code";` <span title="HTML">Visible</span>',
			`{{ "variable" }} {% set name = "value" %} {# "comment" #}`,
			"```js",
			'const label = "Fenced code";',
			"```",
		].join("\n"),
	);
});
