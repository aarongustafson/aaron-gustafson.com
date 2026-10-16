import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(
	path.join(dirname, "../../src/_javascript/post/WebmentionIO.js"),
	"utf8",
);
const fixture = JSON.parse(
	fs.readFileSync(path.join(dirname, "fixtures/webmentions.json"), "utf8"),
);

function createPage() {
	const dom = new JSDOM(
		`<!doctype html>
		<html><head></head><body>
			<div><a href="#webmentions">0 Webmentions</a></div>
			<section id="webmentions" hidden data-webmention-target="https://example.test/post?x=1&y=2">
				<div class="webmentions webmentions--replies" hidden>
					<ol class="webmentions__list" data-webmention-collection="replies"
						data-webmention-types="posts,mentions,replies,bookmarks"></ol>
				</div>
				<div class="webmentions webmentions--likes" hidden>
					<ol class="webmentions__list" data-webmention-collection="likes"
						data-webmention-types="likes" data-webmention-template-class="webmention--like"></ol>
				</div>
				<div class="webmentions webmentions--reposts" hidden>
					<ol class="webmentions__list" data-webmention-collection="reposts"
						data-webmention-types="reposts" data-webmention-template-class="webmention--repost"></ol>
				</div>
			</section>
		</body></html>`,
		{
			runScripts: "outside-only",
			url: "https://example.test/post",
		},
	);
	const { window } = dom;
	vm.runInContext(source, dom.getInternalVMContext());
	return window;
}

test("normalizes only explicit fields and rejects unsafe URLs", () => {
	const window = createPage();
	const mention = window.WebmentionIO._test.normalizeMention(fixture.links[0]);

	assert.equal(mention.type, "reply");
	assert.equal(mention.author.url, "");
	assert.equal(mention.author.photo, "");
	assert.equal(mention.published, "");
	assert.equal(mention.polluted, undefined);
	assert.equal({}.polluted, undefined);
	assert.equal(window.WebmentionIO._test.safeUrl("javascript:alert(1)"), null);
});

test("renders hostile replies as sanitized DOM fragments", () => {
	const window = createPage();
	window.WebmentionIO.processWebmentions({ links: [fixture.links[0]] });
	const document = window.document;
	const reply = document.querySelector("#webmention-reply-hostile");

	assert.ok(reply);
	assert.equal(
		reply.querySelector(".p-name").textContent,
		"<img src=x onerror=alert(1)>",
	);
	assert.equal(reply.querySelector("script"), null);
	assert.equal(reply.querySelector("[onclick]"), null);
	assert.equal(reply.querySelector("img[onerror]"), null);
	assert.equal(reply.querySelector('a[href^="javascript:"]'), null);
	assert.equal(
		reply.querySelector(".p-content h3").textContent.startsWith("Heading"),
		true,
	);
	assert.equal(
		reply.querySelector('a[href="https://safe.example/path"]').rel,
		"nofollow",
	);
});

test("keeps Twitter likes with distinct favorited-by fragments", () => {
	const window = createPage();
	const likes = fixture.links.filter((link) =>
		link.source.includes("#favorited-by-"),
	);

	window.WebmentionIO.processWebmentions({ links: likes });

	assert.deepEqual(
		[...window.document.querySelectorAll(".webmentions--likes .webmention")].map(
			(mention) => mention.id,
		),
		["webmention-twitter-like-bob", "webmention-twitter-like-alice"],
	);
});

test("preserves replies, likes, reposts, bookmarks, counters, and encoded targets", () => {
	const window = createPage();
	window.WebmentionIO.processWebmentions({ links: fixture.links });
	const document = window.document;

	assert.equal(
		document.querySelectorAll(".webmentions--replies .webmention").length,
		2,
	);
	assert.equal(
		document.querySelectorAll(".webmentions--likes .webmention--like").length,
		3,
	);
	assert.equal(
		document.querySelectorAll(".webmentions--reposts .webmention--repost")
			.length,
		1,
	);
	assert.equal(
		document.querySelector('a[href="#webmentions"]').textContent,
		"6 Webmentions",
	);
	const loader = document.querySelector(
		'script[src^="https://webmention.io/api/mentions"]',
	);
	const endpoint = new URL(loader.src);
	assert.equal(
		endpoint.searchParams.get("target[]"),
		"https://example.test/post?x=1&y=2",
	);
	assert.equal(
		endpoint.searchParams.get("jsonp"),
		"window.WebmentionIO.processWebmentions",
	);
});
