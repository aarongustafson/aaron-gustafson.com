import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { JSDOM } from "jsdom";
import yaml from "js-yaml";
import markdownIt from "markdown-it";
import nunjucks from "nunjucks";
import filters from "../../_11ty/filters.js";

const root = new URL("../../", import.meta.url);
const components = JSON.parse(
	fs.readFileSync(new URL("src/_data/web_components.json", root), "utf8"),
);
const template = fs
	.readFileSync(new URL("src/web-components.html", root), "utf8")
	.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
const env = new nunjucks.Environment(
	new nunjucks.FileSystemLoader(new URL("src/_includes/", root).pathname),
);
for (const [name, filter] of Object.entries(filters)) {
	env.addFilter(name, filter);
}
const md = markdownIt({ html: true });
env.addFilter("markdownify", (text) => md.renderInline(text));
env.addFilter("svgContents", (file) =>
	fs.readFileSync(new URL(file.slice(1), root), "utf8"),
);

const postFiles = fs.readdirSync(new URL("src/posts/", root));
const posts = [
	...new Set(components.flatMap((item) => item.related_posts ?? [])),
].map((slug) => {
	const file = postFiles.find((name) =>
		new RegExp(`^\\d{4}-\\d{2}-\\d{2}-${slug}\\.md$`).test(name),
	);
	assert.ok(file, `Related post does not exist: ${slug}`);
	const source = fs.readFileSync(new URL(`src/posts/${file}`, root), "utf8");
	const data = yaml.load(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
	return {
		inputPath: `./src/posts/${file}`,
		fileSlug: slug,
		url: `/notebook/${slug}/`,
		data,
	};
});

function render(t, webComponents = components, publishedPosts = posts) {
	const dom = new JSDOM(
		env.renderString(template, {
			web_components: webComponents,
			collections: { posts: publishedPosts },
		}),
	);
	t.after(() => dom.window.close());
	return dom.window.document;
}

test("component cards reuse notebook teasers with real post metadata and preserve existing actions", (t) => {
	const document = render(t);
	const introLink = document.querySelector(
		'p > a[href="/notebook/a-web-component-starter-template/"]',
	);
	assert.ok(introLink);
	assert.ok(
		introLink.compareDocumentPosition(document.querySelector(".listing")) & 4,
	);

	for (const component of components) {
		const card = document.getElementById(`web-component-${component.name}`);
		const teasers = card.querySelectorAll(".web-component__post .entry--post");
		assert.equal(teasers.length, component.related_posts?.length ?? 0);
		for (const [index, teaser] of [...teasers].entries()) {
			assert.equal(teaser.parentElement.hidden, true);
			assert.equal(teaser.parentElement.querySelector("hr"), null);
			const post = posts.find(
				(item) => item.fileSlug === component.related_posts[index],
			);
			assert.ok(teaser.querySelector(".entry__type svg"));
			const link = teaser.querySelector("h3.entry__title a");
			assert.equal(link.getAttribute("href"), post.url);
			assert.equal(link.textContent.trim(), post.data.title);
			const meta = teaser.querySelector(".entry__meta");
			assert.match(meta.textContent, /Notebook entry posted\s+on/);
			assert.equal(
				meta.querySelector("time").getAttribute("datetime"),
				filters.machine_date(post.data.date),
			);
			assert.equal(teaser.querySelector(".entry__summary"), null);
		}
		assert.equal(card.querySelectorAll(".web-component__links a").length, 3);
		assert.equal(
			card.querySelector(".web-component__image").getAttribute("src"),
			`/i/share-cards/${component.image}`,
		);
		assert.equal(card.dataset.category, component.category);
		assert.equal(
			card.querySelector(".web-component__body .web-component__post"),
			card.querySelector(".web-component__post"),
		);
	}
	assert.ok(document.querySelector('list-filter[for="web-components-list"]'));
});

test("cards support multiple related entries and omit posts absent from the published collection", (t) => {
	const component = {
		...components[0],
		related_posts: [posts[0].fileSlug, posts[1].fileSlug],
	};
	const document = render(t, [component]);
	assert.equal(document.querySelectorAll(".web-component__post").length, 2);

	const unpublished = render(t, [component], []);
	assert.equal(unpublished.querySelector(".web-component__post"), null);
	assert.ok(unpublished.querySelector(".web-component__links"));
});

test("the empty component listing retains its fallback and starter invitation", (t) => {
	const document = render(t, [], []);
	assert.match(
		document.body.textContent,
		/No web components are currently listed/,
	);
	assert.ok(
		document.querySelector(
			'a[href="/notebook/a-web-component-starter-template/"]',
		),
	);
});
