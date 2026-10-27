import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import Eleventy from "@11ty/eleventy";
import markdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import attrs from "markdown-it-attrs";
import footnote from "markdown-it-footnote";

test("post heading IDs survive Nunjucks preprocessing and Markdown rendering", async (t) => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "markdown-render-"));
	t.after(() => fs.rmSync(root, { recursive: true, force: true }));
	const input = path.join(root, "src");
	const output = path.join(root, "dist");
	const configPath = path.join(root, "eleventy.config.mjs");
	fs.mkdirSync(input);
	fs.writeFileSync(
		configPath,
		'export default function () { return { markdownTemplateEngine: "njk" }; }\n',
	);
	const posts = [
		{
			file: "2016-01-06-affirming-user-choice-with-checkboxes.md",
			id: "dropdown-list-(select)",
			element: "select",
		},
		{
			file: "2025-12-29-fullscreen-video-and-iframes-made-easy.md",
			id: "customizable-button-text",
			element: "button",
		},
		{
			file: "2026-01-31-repeatable-form-fields-made-simple.md",
			id: "prefer-an-explicit-template%3F-bring-it!",
			element: "template",
		},
	];
	for (const { file } of posts) {
		const source = fs.readFileSync(
			new URL(`../../src/posts/${file}`, import.meta.url),
			"utf8",
		);
		const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
		assert.notEqual(body, source, `Missing front matter in ${file}`);
		fs.writeFileSync(path.join(input, file), body);
	}
	const eleventy = new Eleventy(input, output, {
		configPath,
		quietMode: true,
		config(config) {
			config.addGlobalData("site", { url: "https://example.com" });
			config.setLibrary(
				"md",
				markdownIt({ html: true, linkify: true, typographer: true, breaks: false })
					.use(anchor, {
						permalink: anchor.permalink.ariaHidden({ placement: "before" }),
					})
					.use(attrs)
					.use(footnote),
			);
		},
	});
	await eleventy.write();
	for (const { file, id, element } of posts) {
		const html = fs.readFileSync(
			path.join(output, file.replace(/\.md$/, ""), "index.html"),
			"utf8",
		);
		const headings = html.match(/<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/g) ?? [];
		const heading = headings.find((value) => value.includes(`id="${id}"`));
		assert.ok(heading, `Missing preserved heading ID ${id} in ${file}`);
		assert.ok(
			heading.includes(`<code>&lt;${element}&gt;</code>`),
			`Missing escaped element reference in ${file}`,
		);
	}
});
