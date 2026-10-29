import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import config from "../../_tasks/config.js";

test("script rebuilds retain unchanged sources and recreate clean output deterministically", async (t) => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "script-build-"));
	t.after(() => fs.rmSync(root, { recursive: true, force: true }));
	const original = { ...config };
	const source = path.join(root, "src");
	const main = path.join(source, "_javascript/main");
	const output = path.join(root, "static");
	const dist = path.join(root, "dist");
	fs.mkdirSync(main, { recursive: true });
	fs.cpSync(
		new URL("../../src/_javascript/theme", import.meta.url),
		path.join(source, "_javascript/theme"),
		{ recursive: true },
	);
	fs.writeFileSync(`${main}/first.js`, "window.first = 1;");
	fs.writeFileSync(`${main}/second.js`, "window.second = 2;");
	Object.assign(config, { source, static: output, destination: dist });
	let scripts;
	try {
		({ default: scripts } = await import("../../_tasks/scripts.js"));
	} finally {
		Object.assign(config, original);
	}
	await scripts();
	const first = fs.readFileSync(`${output}/j/main.js`, "utf8");
	const minified = fs.readFileSync(`${output}/j/main.min.js`, "utf8");
	await scripts();
	assert.equal(fs.readFileSync(`${output}/j/main.js`, "utf8"), first);
	assert.equal(fs.readFileSync(`${output}/j/main.min.js`, "utf8"), minified);

	fs.utimesSync(`${main}/first.js`, new Date(0), new Date(0));
	fs.writeFileSync(`${main}/second.js`, "window.second = 3;");
	await scripts();
	const updated = fs.readFileSync(`${output}/j/main.js`, "utf8");
	assert.match(updated, /window.first = 1/);
	assert.match(updated, /window.second = 3/);

	fs.rmSync(dist, { recursive: true });
	await scripts();
	assert.equal(fs.readFileSync(`${dist}/j/main.js`, "utf8"), updated);
	fs.unlinkSync(`${main}/second.js`);
	await scripts();
	assert.doesNotMatch(
		fs.readFileSync(`${dist}/j/main.js`, "utf8"),
		/window.second/,
	);
});
