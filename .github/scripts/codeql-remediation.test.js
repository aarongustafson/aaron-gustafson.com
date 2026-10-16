import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import yaml from "js-yaml";
import {
	escapeYamlDoubleQuotedScalar,
	getPresentationEmbedUrl,
} from "../../plopfile.js";

const linkySource = readFileSync(
	new URL("../../src/linky/poo.html", import.meta.url),
	"utf8",
);
const formSaverSource = readFileSync(
	new URL("../../src/_javascript/form-saver/form-saver.js", import.meta.url),
	"utf8",
);

function runFormSaver(fields, initialData, cleanup = "") {
	const pageKey = "https://example.com/linky/poo/";
	const listeners = {};
	const stored = new Map([[pageKey, JSON.stringify(initialData)]]);
	const form = {
		querySelectorAll() {
			return fields;
		},
		getAttribute(name) {
			return name === "data-form-saver-cleanup" ? cleanup : null;
		},
		addEventListener(name, callback) {
			listeners[name] = callback;
		},
	};
	const document = {
		querySelector() {
			return form;
		},
	};
	const context = {
		document,
		location: { toString: () => pageKey },
		localStorage: {
			getItem(key) {
				return stored.get(key) ?? null;
			},
			setItem(key, value) {
				stored.set(key, value);
			},
		},
		setTimeout,
		clearTimeout,
		console,
	};

	vm.runInNewContext(formSaverSource, context);
	return {
		listeners,
		readStored: () => JSON.parse(stored.get(pageKey)),
	};
}

function field(name, value, options = {}) {
	return {
		name,
		value,
		type: options.type || "text",
		hasAttribute(attribute) {
			return attribute === "data-form-saver-ignore" && options.ignore === true;
		},
	};
}

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
	assert.match(
		linkySource,
		/name="username"[\s\S]*?data-form-saver-ignore[\s\S]*?required/,
	);
	assert.match(
		linkySource,
		/name="token"[\s\S]*?data-form-saver-ignore[\s\S]*?required/,
	);
	assert.match(linkySource, /data-form-saver-cleanup="credentials password"/);
	assert.doesNotMatch(linkySource, /localStorage|sessionStorage/);
});

test("form-saver never serializes ignored or password fields", () => {
	const title = field("p_title", "Saved draft");
	const username = field("username", "octocat", { ignore: true });
	const token = field("token", "github-token", { ignore: true });
	const password = field("password", "secret", { type: "password" });
	const saver = runFormSaver([title, username, token, password], {});

	saver.listeners.change();

	assert.deepEqual(saver.readStored(), { p_title: "Saved draft" });
});

test("form-saver cleans sensitive legacy data while restoring safe drafts", () => {
	const title = field("p_title", "");
	const username = field("username", "", { ignore: true });
	const token = field("token", "", { type: "password", ignore: true });
	const saver = runFormSaver(
		[title, username, token],
		{
			p_title: "Restored draft",
			username: "octocat",
			token: "github-token",
			password: "secret",
			credentials: "legacy plaintext",
		},
		"credentials password",
	);

	assert.equal(title.value, "Restored draft");
	assert.equal(username.value, "");
	assert.equal(token.value, "");
	assert.deepEqual(saver.readStored(), { p_title: "Restored draft" });
});

test("Linky closes only after GitHub accepts the request", () => {
	assert.match(linkySource, /XHR\.status >= 200 && XHR\.status < 300/);
	assert.match(linkySource, /else \{\s*linkFailed\(/);
	assert.match(linkySource, /setTimeout\(function \(\) \{\s*window\.close\(\)/);
});
