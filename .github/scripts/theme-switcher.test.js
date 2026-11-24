import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import * as sass from "sass";
import CleanCSS from "clean-css";
import nunjucks from "nunjucks";
import { copyThemeModules } from "../../_tasks/scripts.js";

const bootstrap = fs.readFileSync(
	new URL("../../src/_includes/partials/global/theme-preference.js", import.meta.url),
	"utf8",
);

function restore({ saved = null, cookie = "", blocked = false, ignoresWrites = false, cookieBlocked = false } = {}) {
	const attributes = {};
	const warnings = [];
	const writes = [];
	let value = saved;
	let cookies = cookie;
	const localStorage = {
		getItem(key) {
			assert.equal(key, "theme-switcher");
			if (blocked) throw new Error("Storage blocked");
			return value;
		},
		setItem(key, next) {
			assert.equal(key, "theme-switcher");
			if (blocked) throw new Error("Storage blocked");
			if (!ignoresWrites) value = next;
		},
	};
	const document = {
		documentElement: {
			setAttribute(name, next) { attributes[name] = next; },
		},
		get cookie() {
			if (cookieBlocked) throw new Error("Cookies blocked");
			return cookies;
		},
		set cookie(next) {
			writes.push(next);
			cookies = cookies.split(";").filter(part => !part.trim().startsWith("darkmode=")).join(";");
		},
	};
	vm.runInNewContext(bootstrap, {
		window: { localStorage },
		document,
		console: { warn: (...args) => warnings.push(args) },
	});
	return { theme: attributes["data-theme"], saved: value, warnings, writes, cookie: cookies };
}

for (const saved of ["system", "light", "dark"]) {
	test(`restores ${saved} before conflicting legacy preferences`, () => {
		const result = restore({ saved, cookie: "darkmode=true" });
		assert.equal(result.theme, saved);
		assert.equal(result.saved, saved);
		assert.equal(result.cookie, "");
		assert.equal(result.warnings.length, 0);
	});
}

for (const [cookie, theme] of [["true", "dark"], ["false", "light"]]) {
	test(`migrates darkmode=${cookie} and retires it only after verification`, () => {
		const result = restore({ cookie: `other=1; darkmode=${cookie}` });
		assert.equal(result.theme, theme);
		assert.equal(result.saved, theme);
		assert.equal(result.writes.length, 1);
		assert.match(result.writes[0], /Path=\/; Max-Age=0/);
		assert.equal(result.cookie.includes("darkmode"), false);
	});

	test(`preserves the effective ${theme} choice and cookie when storage is blocked`, () => {
		const result = restore({ cookie: `darkmode=${cookie}`, blocked: true });
		assert.equal(result.theme, theme);
		assert.equal(result.writes.length, 0);
		assert.ok(result.warnings.length > 0);
	});
}

test("ignores invalid stores and similarly named cookies", () => {
	for (const cookie of ["", "notdarkmode=true", "darkmode=invalid", "darkmode=trueish"]) {
		const result = restore({ saved: "invalid", cookie });
		assert.equal(result.theme, "system");
		assert.equal(result.writes.length, 0);
	}
	assert.equal(restore({ saved: "invalid", cookie: "darkmode=false" }).theme, "light");
});

test("reports silently discarded storage writes without deleting the cookie", () => {
	const result = restore({ cookie: "darkmode=true", ignoresWrites: true });
	assert.equal(result.theme, "dark");
	assert.equal(result.cookie, "darkmode=true");
	assert.equal(result.writes.length, 0);
	assert.ok(result.warnings.length > 0);
});

test("blocked stores are explicit and fall back to System when no preference can be read", () => {
	const result = restore({ blocked: true, cookieBlocked: true });
	assert.equal(result.theme, "system");
	assert.ok(result.warnings.length > 0);
});

test("theme UI includes a named dialog and explicit close without change-dismissal hooks", () => {
	const source = fs.readFileSync(
		new URL("../../src/_includes/partials/global/theme-switcher.njk", import.meta.url),
		"utf8",
	);
	const environment = new nunjucks.Environment();
	environment.addFilter("svgContents", () => "<svg></svg>");
	const html = environment.renderString(source);
	assert.match(html, /commandfor="theme-dialog" command="show-modal"/);
	assert.match(html, /aria-haspopup="dialog"/);
	assert.match(html, /<dialog\b[^>]*aria-label="Color theme"/);
	assert.doesNotMatch(html, /<h[1-6]\b/);
	assert.match(html, /<theme-switcher class="theme-icons" label="Color theme"><\/theme-switcher>/);
	assert.doesNotMatch(html, /<(?:fieldset|legend|input|label)\b/);
	assert.doesNotMatch(html, /<theme-switcher\b[^>]*\bscript=/);
	assert.doesNotMatch(html, /\bicon-only\b/);
	assert.match(html, /commandfor="theme-dialog" command="close" aria-label="Close">&times;<\/button>/);
	assert.doesNotMatch(html, /<form\b/);
	assert.match(html, /aria-controls="theme-dialog" hidden/);
});

test("web component page IDs do not collide with global UI IDs", () => {
	const source = fs.readFileSync(
		new URL("../../src/web-components.html", import.meta.url),
		"utf8",
	);
	assert.match(source, /id="web-component-\{\{ component\.name \}\}"/);
	assert.doesNotMatch(source, /id="\{\{ component\.name \}\}"/);
});

test("web component catalog remains server rendered and uses list-filter", () => {
	const source = fs.readFileSync(
		new URL("../../src/web-components.html", import.meta.url),
		"utf8",
	);
	assert.match(source, /<list-filter[\s\S]*for="web-components-list"[\s\S]*search[\s\S]*categories/);
	assert.match(source, /data-list-filter-ref="search"/);
	assert.match(source, /data-list-filter-ref="categories"/);
	assert.match(source, /data-list-filter-ref="reset"/);
	assert.match(source, /data-list-filter-ref="output"/);
	assert.match(source, /listing--grid listing--web-components/);
	assert.doesNotMatch(source, /<micro-lighter\b|web-component__install|data-copy=/);
	assert.match(source, /block-size:\s*auto/);
	assert.match(source, /height:\s*auto/);
	assert.match(source, /\.web-component\[hidden\]\s*\{\s*display:\s*none/);
	assert.match(source, /grid-template-columns:\s*1fr 12rem 10rem/);
	assert.match(source, /margin-inline:\s*-1\.25rem/);
	assert.doesNotMatch(source, /data-copy=/);
	assert.match(source, /font-size:\s*1rem/);
	assert.match(source, /background:\s*var\(--theme-input-background/);
	assert.match(source, /border:\s*1px solid var\(--theme-border/);
	assert.match(source, /\.web-components__controls select,\n\s*\.web-components__controls select option\s*\{[\s\S]*?background:\s*#fffcf4;[\s\S]*?color:\s*#2c2825;/);
	assert.match(source, /\.web-components__controls input\[type="search"\]\s*\{[\s\S]*?background:\s*#fffcf4;[\s\S]*?color:\s*#2c2825;/);
	assert.match(source, /\.web-component \.listing__item__title code\s*\{[\s\S]*?white-space:\s*normal;/);
	assert.match(source, /component.description \| markdownify \| striptags/);
	assert.doesNotMatch(source, /data-web-component-search|data-web-component-category|data-web-component-reset|catalog\.js/);
	assert.match(source, /is-filtering-out/);
	assert.match(source, /is-filtering-in/);
	assert.match(source, /prefers-reduced-motion/);
	assert.match(source, /@media \(prefers-reduced-motion: no-preference\)/);
});

test("head restores preferences before styles and maps every bare module import", () => {
	const source = fs.readFileSync(
		new URL("../../src/_includes/layouts/base.njk", import.meta.url),
		"utf8",
	);
	assert.ok(source.indexOf("global/theme-preference.js") < source.indexOf('rel="stylesheet"'));
	assert.doesNotMatch(source, /global\/dark-mode\.js/);
	assert.ok(source.indexOf('type="importmap"') < source.indexOf('type="module" src="/j/theme/init.js"'));
	assert.match(source, /"@aarongustafson\/form-multi-switch": "\/j\/form-multi-switch\/index.js"/);
	assert.match(source, /"@aarongustafson\/theme-switcher\/define.js": "\/j\/theme-switcher\/define.js"/);
});

test("module copies preserve ES imports and repair missing outputs on repeated builds", async (t) => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "theme-modules-"));
	t.after(() => fs.rmSync(root, { recursive: true, force: true }));
	const outputs = [path.join(root, "static"), path.join(root, "dist")];
	await copyThemeModules({ outputs });
	const source = new URL("../../node_modules/@aarongustafson/theme-switcher/theme-switcher.js", import.meta.url);
	for (const output of outputs) {
		assert.deepEqual(
			fs.readFileSync(path.join(output, "theme-switcher/theme-switcher.js")),
			fs.readFileSync(source),
		);
		for (const file of ["theme/init.js", "form-multi-switch/index.js", "form-multi-switch/form-multi-switch.js", "theme-switcher/define.js"]) {
			assert.ok(fs.existsSync(path.join(output, file)));
		}
	}
	fs.unlinkSync(path.join(outputs[1], "theme/init.js"));
	await copyThemeModules({ outputs });
	assert.ok(fs.existsSync(path.join(outputs[1], "theme/init.js")));
	await assert.rejects(copyThemeModules({ packages: path.join(root, "missing"), outputs }), /ENOENT/);
});

test("expanded and minified palettes support System without overriding explicit choices", () => {
	const source = sass.compile(
		new URL("../../src/_styles/advanced.scss", import.meta.url).pathname,
		{ silenceDeprecations: ["global-builtin", "color-functions", "import"] },
	).css;
	const minified = new CleanCSS({ level: 2, compatibility: "ie8" }).minify(source);
	assert.deepEqual(minified.errors, []);
	for (const css of [source, minified.styles]) {
		assert.doesNotMatch(css, /\.dark-mode/);
		assert.match(css, /:root\[data-theme="?dark"?\]/);
		assert.match(css, /:root:not\(\[data-theme\]\)/);
		assert.match(css, /:root\[data-theme="?system"?\]/);
		assert.match(css, /prefers-color-scheme:\s*dark/);
		assert.match(css, /--theme-background:\s*#454545/);
		assert.match(css, /--theme-background:\s*#fffcf4/);
		assert.match(css, /var\(--theme-background/);
		assert.match(css, /--multi-switch-selected-background:\s*var\(--theme-button-background\)/);
		assert.match(css, /#theme-switcher\s*>\s*span\s*\{\s*display:\s*inline-block/);
		assert.match(css, /\[data-multi-switch-label\]\s*\{\s*margin-block-start:\s*0/);
		const closeRule = css.match(/dialog button\[command="?close"?\]\s*\{([^}]+)\}/)?.[1];
		assert.ok(closeRule);
		assert.match(closeRule, /position:\s*absolute/);
		assert.match(closeRule, /inset-block-start:\s*0?\.25rem/);
		assert.match(closeRule, /inset-inline-end:\s*0?\.25rem/);
		assert.match(closeRule, /min-inline-size:\s*2\.75rem/);
		assert.match(closeRule, /min-block-size:\s*2\.75rem/);
		assert.match(css, /\[data-multi-switch-choice\]\s*\{\s*align-items:\s*center/);
		assert.match(css, /forced-colors:\s*active/);
		assert.match(css, /forced-color-adjust:\s*none/);
		for (const theme of ["system", "light", "dark"]) {
			assert.ok(css.includes(`/i/icons/theme-${theme}.svg`));
			assert.ok(fs.existsSync(new URL(`../../src/_images/icons/theme-${theme}.svg`, import.meta.url)));
		}
		const defined = new Set([...css.matchAll(/(--theme-[\w-]+):/g)].map(match => match[1]));
		for (const [, token] of css.matchAll(/var\((--theme-[\w-]+)/g)) {
			assert.ok(defined.has(token), `Undefined palette token ${token}`);
		}
	}
	for (const file of ["feed.scss", "old-ie.scss"]) {
		assert.ok(sass.compile(
			new URL(`../../src/_styles/${file}`, import.meta.url).pathname,
			{ silenceDeprecations: ["global-builtin", "color-functions", "import"] },
		).css.length > 0);
	}
});
