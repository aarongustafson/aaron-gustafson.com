import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import Eleventy from "@11ty/eleventy";
import imagePipeline from "../../_11ty/image-pipeline.js";

function fixture(t) {
	const parent = path.resolve("_cache/optimized-images");
	fs.mkdirSync(parent, { recursive: true });
	const root = fs.mkdtempSync(path.join(parent, "eleventy-test-"));
	t.after(() => fs.rmSync(root, { recursive: true, force: true }));
	const input = path.join(root, "src");
	const sourceDir = path.join(input, "_images");
	const staticDir = path.join(input, "static");
	const cacheDir = path.join(root, "cache");
	const output = path.join(root, "custom-output");
	fs.mkdirSync(sourceDir, { recursive: true });
	fs.mkdirSync(path.join(staticDir, "i/share-cards"), { recursive: true });
	const svg =
		'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">\n<!-- remove this comment -->\n<rect width="100" height="100" fill="red"/>\n</svg>';
	fs.writeFileSync(path.join(sourceDir, "example.svg"), svg);
	fs.writeFileSync(path.join(staticDir, "i/example.svg"), svg);
	fs.writeFileSync(path.join(staticDir, "i/static-only.svg"), svg);
	fs.writeFileSync(path.join(staticDir, "i/share-cards/post.jpg"), "card");
	fs.writeFileSync(path.join(staticDir, "robots.txt"), "User-agent: *");
	fs.writeFileSync(path.join(input, "index.md"), "# Image pipeline test");
	return { root, input, output, sourceDir, staticDir, cacheDir, svg };
}

test("image pipeline filters only managed duplicates and registers one watcher", (t) => {
	const f = fixture(t);
	let copies;
	let options;
	let behavior;
	const watches = [];
	const hooks = [];
	imagePipeline(
		{
			setServerPassthroughCopyBehavior(value) {
				behavior = value;
			},
			addPassthroughCopy(value, copyOptions) {
				copies = value;
				options = copyOptions;
			},
			addWatchTarget(value) {
				watches.push(value);
			},
			on(event, callback) {
				hooks.push({ event, callback });
			},
		},
		f,
	);
	assert.deepEqual(copies, { [f.staticDir]: "/" });
	assert.equal(behavior, "copy");
	assert.deepEqual(watches, [f.sourceDir]);
	assert.equal(hooks.length, 1);
	assert.equal(hooks[0].event, "eleventy.after");
	assert.equal(options.filter("i/example.svg"), false);
	for (const file of [
		"",
		"i",
		"robots.txt",
		"i/static-only.svg",
		"i/share-cards/post.jpg",
	]) {
		assert.equal(options.filter(file), true, file);
	}
	fs.mkdirSync(path.join(f.sourceDir, "design.sketch"), { recursive: true });
	fs.writeFileSync(path.join(f.sourceDir, "design.sketch/preview.svg"), f.svg);
	assert.equal(options.filter("i/design.sketch/preview.svg"), true);
});

for (const mode of ["build", "serve"]) {
	test(`Eleventy ${mode} preserves tracked originals and optimized output across rebuilds`, async (t) => {
		const f = fixture(t);
		const project = new Eleventy(f.input, f.output, {
			configPath: false,
			quietMode: true,
			config(config) {
				config.setUseGitIgnore(false);
				config.addPlugin(imagePipeline, f);
			},
		});
		project.setRunMode(mode);
		await project.write();
		const built = path.join(f.output, "i/example.svg");
		const optimized = fs.readFileSync(built);
		assert.ok(optimized.length < Buffer.byteLength(f.svg));
		assert.equal(
			fs.readFileSync(path.join(f.staticDir, "i/example.svg"), "utf8"),
			f.svg,
		);
		assert.equal(
			fs.readFileSync(path.join(f.output, "i/static-only.svg"), "utf8"),
			f.svg,
		);
		assert.equal(
			fs.readFileSync(path.join(f.output, "i/share-cards/post.jpg"), "utf8"),
			"card",
		);
		assert.ok(fs.existsSync(path.join(f.output, "robots.txt")));

		const timestamp = new Date("2000-01-01T00:00:00Z");
		fs.utimesSync(built, timestamp, timestamp);
		await project.write();
		assert.deepEqual(fs.readFileSync(built), optimized);
		assert.equal(fs.statSync(built).mtimeMs, timestamp.getTime());

		project.setIncrementalFile(path.join(f.staticDir, "i/example.svg"));
		await project.write();
		assert.deepEqual(fs.readFileSync(built), optimized);

		fs.writeFileSync(
			path.join(f.sourceDir, "example.svg"),
			f.svg.replace("red", "blue"),
		);
		project.setIncrementalFile(path.join(f.sourceDir, "example.svg"));
		await project.write();
		assert.match(fs.readFileSync(built, "utf8"), /blue|#00f/);
		assert.equal(
			fs.readFileSync(path.join(f.staticDir, "i/example.svg"), "utf8"),
			f.svg,
		);

		fs.writeFileSync(path.join(f.sourceDir, "new.svg"), f.svg);
		project.setIncrementalFile(path.join(f.sourceDir, "new.svg"));
		await project.write();
		assert.ok(fs.existsSync(path.join(f.output, "i/new.svg")));
		assert.equal(fs.existsSync(path.join(f.staticDir, "i/new.svg")), false);

		fs.unlinkSync(built);
		await project.write();
		assert.ok(fs.existsSync(built));
	});
}
