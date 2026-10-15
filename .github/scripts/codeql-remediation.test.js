import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import yaml from "js-yaml";
import {
	escapeYamlDoubleQuotedScalar,
	getPresentationEmbedUrl,
} from "../../plopfile.js";

const linkySource = readFileSync(
	new URL("../../src/linky/poo.html", import.meta.url),
	"utf8",
);

test("escapeYamlDoubleQuotedScalar preserves plain generated values", () => {
	assert.equal(escapeYamlDoubleQuotedScalar("A plain title"), "A plain title");
});

test("escapeYamlDoubleQuotedScalar escapes all JSON-sensitive characters", () => {
	const value = 'First "quote", second "quote", slash \\\nand a\ttab';
	const escaped = escapeYamlDoubleQuotedScalar(value);

	assert.equal(
		JSON.parse(`"${escaped}"`),
		value,
		"the escaped value remains a valid JSON-compatible double-quoted scalar",
	);
	assert.equal(yaml.load(`value: "${escaped}"`).value, value);
	assert.equal(
		escaped,
		'First \\"quote\\", second \\"quote\\", slash \\\\\\nand a\\ttab',
	);
});

test("getPresentationEmbedUrl derives embeds for the exact presentation host", () => {
	assert.equal(
		getPresentationEmbedUrl(
			"https://presentations.aaron-gustafson.com/inclusive-design/speaker-view",
		),
		"https://presentations.aaron-gustafson.com/inclusive-design/embed",
	);
});

test("getPresentationEmbedUrl rejects lookalike and malformed URLs", () => {
	for (const value of [
		"https://presentationsXaaron-gustafson.com/talk/slides",
		"https://presentations.aaron-gustafson.com.evil.example/talk/slides",
		"not a URL",
	]) {
		assert.equal(getPresentationEmbedUrl(value), value);
	}
});

test("Linky exposes password-manager fields without storing credentials", () => {
	const usernamePosition = linkySource.indexOf('autocomplete="username"');
	const tokenPosition = linkySource.indexOf('autocomplete="current-password"');
	const submitPosition = linkySource.indexOf('id="go"');
	const setupPosition = linkySource.indexOf('id="setup"');

	assert.ok(usernamePosition > -1);
	assert.ok(tokenPosition > usernamePosition);
	assert.ok(submitPosition > tokenPosition);
	assert.ok(setupPosition > submitPosition);
	assert.doesNotMatch(linkySource, /localStorage|sessionStorage/);
});

test("Linky closes only after GitHub accepts the request", () => {
	assert.match(linkySource, /XHR\.status >= 200 && XHR\.status < 300/);
	assert.match(linkySource, /else \{\s*linkFailed\(/);
	assert.match(linkySource, /setTimeout\(function \(\) \{\s*window\.close\(\)/);
});
