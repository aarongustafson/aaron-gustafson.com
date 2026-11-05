import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import nunjucks from "nunjucks";

test("JSON feeds expose the same resolved social metadata as the HTML page", () => {
	const environment = new nunjucks.Environment(
		new nunjucks.FileSystemLoader(path.resolve("src/_includes")),
	);
	environment.addFilter("content_type", () => "post");
	environment.addFilter("url", (value) => value);
	environment.addFilter(
		"absoluteUrl",
		(value, base) => new URL(value, base).href,
	);
	environment.addFilter("dateToRfc3339", (value) => value.toISOString());
	environment.addFilter("block_markdownify", (value) => value);
	environment.addFilter("trim_newlines", (value) => value.trim());
	const metadata = {
		socialTitle: 'A "social" title',
		socialDescription: "Social description, not promotional post text.",
		image: "https://example.com/custom.jpg",
		imageAlt: "The actual hero.",
	};
	const html = environment.render("feeds/post.json.njk", {
		site: { url: "https://example.com" },
		post: {
			url: "/notebook/article/",
			inputPath: "./src/posts/2026-01-01-article.md",
			date: new Date("2026-01-01T12:00:00Z"),
			templateContent: "<p>Body</p>",
			data: {
				title: "Article",
				page: {},
				description: "Page description",
				image: "/default.jpg",
				metadata,
				twitter_text: "Promotional text.",
			},
		},
	});
	const item = JSON.parse(html);
	assert.deepEqual(item._social, {
		title: metadata.socialTitle,
		description: metadata.socialDescription,
		image: metadata.image,
		image_alt: metadata.imageAlt,
	});
	assert.equal(item.social_text, "Promotional text.");
	assert.equal(item.url, "https://example.com/notebook/article/");
});
