import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import nunjucks from "nunjucks";
import { resolveMetadata } from "../../_11ty/metadata.js";
import { validateFile } from "./validate-built-metadata.js";

test("built metadata validation rejects missing social images and preserves author attribution", (t) => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "built-social-images-"));
	t.after(() => fs.rmSync(root, { recursive: true, force: true }));
	const site = {
		url: "https://example.com",
		title: "Example",
		author: {
			name: "Author",
			uri: "https://example.com",
			twitter: "example",
			mastodon: "@example@social.example",
		},
	};
	const metadata = resolveMetadata({
		title: "Article",
		description: "Summary",
		image: "/i/share-cards/article.jpg",
		is_post: true,
		site,
		page: { url: "/article/" },
	});
	const environment = new nunjucks.Environment(
		new nunjucks.FileSystemLoader(path.resolve("src/_includes")),
	);
	const partial = environment.render("partials/global/metadata.njk", {
		site,
		metadata,
	});
	const html = `<html id="aaron-gustafson_com"><head><meta name="view-transition">${partial}</head></html>`;
	const filename = path.join(root, "index.html");
	fs.writeFileSync(filename, html);
	assert.ok(
		validateFile(filename, root).some((error) =>
			error.includes("social image is missing"),
		),
	);
	fs.mkdirSync(path.join(root, "i/share-cards"), { recursive: true });
	fs.writeFileSync(path.join(root, "i/share-cards/article.jpg"), "image");
	assert.deepEqual(validateFile(filename, root), []);
	assert.match(
		html,
		/name="fediverse:creator" content="@example@social.example"/,
	);
	assert.match(
		html,
		/property="article:author" content="https:\/\/example.com"/,
	);
	assert.match(html, /name="twitter:creator" content="@example"/);
});
