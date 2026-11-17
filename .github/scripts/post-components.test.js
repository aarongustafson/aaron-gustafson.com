import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { JSDOM } from "jsdom";

const integration = fs
	.readFileSync(
		new URL("../../src/_javascript/post-components/init.js", import.meta.url),
		"utf8",
	)
	.replace(/^import .*;\n/gm, "");

function enhance(html, t) {
	const dom = new JSDOM(html, { runScripts: "outside-only" });
	t.after(() => dom.window.close());
	const warnings = [];
	dom.window.console.warn = (...args) => warnings.push(args);
	dom.window.eval(integration);
	return { dom, document: dom.window.document, warnings };
}

test("post integration wraps eligible images without changing links, pictures, captions, or positioning", (t) => {
	const { dom, document } = enhance(
		`
		<figure style="position: static"><img id="hero" alt="Hero"><figcaption>Credit</figcaption></figure>
		<figure style="position: absolute"><a id="link" href="/original.jpg"><picture><source srcset="/large.jpg"><img id="linked" alt="Linked"></picture></a><figcaption>Caption</figcaption></figure>
		<figure><img alt=""><img alt="   "><img src="/missing-alt.jpg"></figure>
		<figure><img-alt-overlay><img id="authored" alt="Already wrapped"></img-alt-overlay></figure>
		<figure><img id="first" alt="First"><img id="second" alt="Second"></figure>
		<img id="outside" alt="Outside a figure">
		<footer><figure><img id="footer" alt="Footer image"></figure></footer>
	`,
		t,
	);

	assert.equal(document.querySelectorAll("img-alt-overlay").length, 6);
	for (const id of ["hero", "linked", "first", "second", "footer"]) {
		const overlay = document.getElementById(id).closest("img-alt-overlay");
		assert.ok(overlay);
		assert.equal(overlay.getAttribute("button-label"), "View Alt");
		assert.equal(overlay.getAttribute("close-label"), "Dismiss Alt");
	}
	assert.equal(
		document.getElementById("link").parentElement.localName,
		"img-alt-overlay",
	);
	assert.ok(document.querySelector("#link > picture > #linked"));
	assert.equal(
		document.querySelector("source").getAttribute("srcset"),
		"/large.jpg",
	);
	assert.equal(
		document.querySelectorAll("img-alt-overlay figcaption").length,
		0,
	);
	assert.equal(
		document.querySelectorAll("img-alt-overlay img-alt-overlay").length,
		0,
	);
	assert.equal(
		document.getElementById("outside").closest("img-alt-overlay"),
		null,
	);
	assert.equal(
		document.getElementById("hero").closest("figure").style.position,
		"relative",
	);
	assert.equal(
		document.getElementById("linked").closest("figure").style.position,
		"absolute",
	);
	dom.window.eval(integration);
	assert.equal(document.querySelectorAll("img-alt-overlay").length, 6);
});

test("post integration preserves shared image links and interactive controls with a warning", (t) => {
	const { document, warnings } = enhance(
		`
		<figure><a href="/images/"><img alt="First"><img alt="Second"></a></figure>
		<figure><button><img alt="Button image"></button></figure>
	`,
		t,
	);
	assert.equal(document.querySelectorAll("img-alt-overlay").length, 0);
	assert.equal(document.querySelectorAll("a img").length, 2);
	assert.equal(document.querySelectorAll("button img").length, 1);
	assert.equal(warnings.length, 3);
});
