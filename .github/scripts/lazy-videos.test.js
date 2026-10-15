import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const scriptPath = new URL(
	"../../src/_javascript/main/lazy-videos.js",
	import.meta.url,
);

function createLink(src) {
	const attributes = new Map([["data-lazy-video-src", src]]);
	return {
		handlers: {},
		nodeName: "A",
		parentNode: {
			replaceChild(replacement) {
				this.replacement = replacement;
			},
		},
		addEventListener(type, handler) {
			this.handlers[type] = handler;
		},
		getAttribute(name) {
			return attributes.get(name);
		},
		setAttribute(name, value) {
			attributes.set(name, value);
		},
	};
}

async function runLazyVideos(links) {
	const preconnected = [];
	const iframe = {
		attributes: new Map(),
		cloneNode() {
			return {
				attributes: new Map(),
				setAttribute(name, value) {
					this.attributes.set(name, value);
				},
			};
		},
		setAttribute(name, value) {
			this.attributes.set(name, value);
		},
	};
	const document = {
		createElement() {
			return iframe;
		},
		querySelectorAll() {
			return links;
		},
	};
	const context = {
		AG: {
			preconnect(url) {
				preconnected.push(url);
			},
		},
		URL,
		document,
		location: { href: "https://www.aaron-gustafson.com/" },
	};

	vm.runInNewContext(await readFile(scriptPath, "utf8"), context);
	return { preconnected };
}

test("lazy videos activate supported HTTPS embeds", async () => {
	const link = createLink("https://player.vimeo.com/video/173326449");
	const { preconnected } = await runLazyVideos([link]);

	assert.deepEqual(preconnected, ["https://player.vimeo.com/video/173326449"]);
	assert.equal(typeof link.handlers.click, "function");

	link.handlers.click({
		currentTarget: link,
		preventDefault() {},
	});

	assert.equal(
		link.parentNode.replacement.attributes.get("src"),
		"https://player.vimeo.com/video/173326449",
	);
});

test("lazy videos reject scriptable and lookalike hosts", async () => {
	const scriptUrl = createLink("javascript:alert(1)");
	const lookalike = createLink(
		"https://www.youtube.com.attacker.example/embed/video",
	);
	const { preconnected } = await runLazyVideos([scriptUrl, lookalike]);

	assert.deepEqual(preconnected, []);
	assert.equal(scriptUrl.handlers.click, undefined);
	assert.equal(lookalike.handlers.click, undefined);
});
