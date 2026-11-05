import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { restoreShareCards } from "../../plugins/share-cards-cache/index.js";

test("Netlify cache restore preserves new and updated committed share cards", async (t) => {
	const root = await fs.mkdtemp(path.join(os.tmpdir(), "share-cache-test-"));
	t.after(() => fs.rm(root, { recursive: true, force: true }));
	const directory = path.join(root, "cards");
	await fs.mkdir(directory);
	await fs.writeFile(path.join(directory, "new.jpg"), "new committed image");
	await fs.writeFile(
		path.join(directory, "updated.jpg"),
		"updated committed image",
	);
	await restoreShareCards(
		{
			cache: {
				async restore(target) {
					assert.equal(target, directory);
					await fs.rm(target, { recursive: true, force: true });
					await fs.mkdir(target);
					await fs.writeFile(
						path.join(target, "cached-only.jpg"),
						"cached image",
					);
					await fs.writeFile(
						path.join(target, "updated.jpg"),
						"stale cached image",
					);
				},
			},
		},
		directory,
	);
	assert.equal(
		await fs.readFile(path.join(directory, "new.jpg"), "utf8"),
		"new committed image",
	);
	assert.equal(
		await fs.readFile(path.join(directory, "updated.jpg"), "utf8"),
		"updated committed image",
	);
	assert.equal(
		await fs.readFile(path.join(directory, "cached-only.jpg"), "utf8"),
		"cached image",
	);
});

test("a failed Netlify restore still recovers checked-out share cards", async (t) => {
	const root = await fs.mkdtemp(
		path.join(os.tmpdir(), "share-cache-error-test-"),
	);
	t.after(() => fs.rm(root, { recursive: true, force: true }));
	const directory = path.join(root, "cards");
	await fs.mkdir(directory);
	await fs.writeFile(path.join(directory, "new.jpg"), "committed image");
	await assert.rejects(
		() =>
			restoreShareCards(
				{
					cache: {
						async restore(target) {
							await fs.rm(target, { recursive: true, force: true });
							throw new Error("Cache restore failed");
						},
					},
				},
				directory,
			),
		/Cache restore failed/,
	);
	assert.equal(
		await fs.readFile(path.join(directory, "new.jpg"), "utf8"),
		"committed image",
	);
});
