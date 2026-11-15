import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { JSDOM } from "jsdom";
import nunjucks from "nunjucks";

const read = (file) =>
	fs.readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");

test("post metadata marks interactive sections for print hiding while preserving acknowledgments", () => {
	const loader = new nunjucks.Loader();
	loader.getSource = (name) => ({
		src:
			name === "layouts/base.njk"
				? "{% block content %}{% endblock %}"
				: name === "macros.njk"
					? "{% macro post_date() %}15 Nov 2026{% endmacro %}{% macro tag_list() %}{% endmacro %}"
					: "",
		path: name,
		noCache: true,
	});
	const environment = new nunjucks.Environment(loader);
	for (const filter of [
		"getWebmentionsForUrl",
		"webmentionsByType",
		"required",
		"markdownify",
		"strip_links",
		"readingTime",
	]) {
		environment.addFilter(filter, (value) => value);
	}
	const html = environment.renderString(
		read("src/_includes/layouts/post.njk"),
		{
			title: "Print example",
			tags: [],
			page: { url: "/notebook/example/", fileSlug: "example" },
			site: { url: "https://www.aaron-gustafson.com" },
			webmentions: [],
			disqus: { commentCount: 1 },
			thanks: { Contributor: "https://example.com/" },
			content: "<p>Article body</p>",
		},
	);
	const document = new JSDOM(html).window.document;
	for (const label of ["Reading Time", "Reactions", "Like this?"]) {
		const term = [...document.querySelectorAll("dt")].find(
			(node) => node.textContent.trim() === label,
		);
		assert.ok(term.classList.contains("print-hidden"));
		assert.ok(term.nextElementSibling.classList.contains("print-hidden"));
		assert.equal(term.hidden, false);
	}
	for (const label of ["Published", "Filed Under"]) {
		const term = [...document.querySelectorAll("dt")].find(
			(node) => node.textContent.trim() === label,
		);
		assert.equal(term.classList.contains("print-hidden"), false);
	}
	assert.match(
		document.querySelector(".entry__thanks").textContent,
		/Many thanks to/,
	);
	assert.ok(document.querySelector("print-link-list"));
	const list = document.querySelector("print-link-list");
	assert.equal(list.getAttribute("target"), ".entry__content");
	assert.equal(
		document.querySelector(".entry__content").nextElementSibling,
		list,
	);
});

test("offline controls hide both their heading and controls only in print", (t) => {
	const dom = new JSDOM('<div class="entry__meta"><dl></dl></div>', {
		runScripts: "outside-only",
		url: "https://www.aaron-gustafson.com/notebook/example/",
	});
	t.after(() => dom.window.close());
	Object.defineProperty(dom.window.navigator, "serviceWorker", { value: {} });
	dom.window.caches = { match: async () => undefined };
	dom.window.eval(read("src/_javascript/post/save-offline.js"));
	const term = dom.window.document.querySelector("dt");
	assert.equal(term.innerText, "Can’t read now?");
	assert.ok(term.classList.contains("print-hidden"));
	assert.ok(term.nextElementSibling.classList.contains("print-hidden"));
	assert.equal(term.hidden, false);
	assert.equal(term.nextElementSibling.hidden, false);
});

test("site footer separates the license from the screen-only colophon", () => {
	const source = read("src/_includes/layouts/base.njk");
	const footer = source.slice(
		source.indexOf('<footer role="contentinfo"'),
		source.indexOf("</footer>") + 9,
	);
	const loader = new nunjucks.Loader();
	loader.getSource = (name) => ({
		src: read(`src/_includes/${name}`),
		path: name,
		noCache: true,
	});
	const environment = new nunjucks.Environment(loader);
	const html = environment.renderString(footer, {
		page: { inputPath: "src/posts/example.md" },
		site: { repo_url: "https://github.com/example/repo/tree/main/" },
	});
	const document = new JSDOM(html).window.document;
	const copyright = document.querySelector(".footer__copyright");
	assert.ok(copyright.querySelector("#license"));
	assert.ok(copyright.querySelector(".footer__colophon"));
	assert.equal(
		[...copyright.childNodes]
			.filter((node) => node.nodeType === 3)
			.map((node) => node.textContent)
			.join("")
			.trim(),
		"",
	);
});
