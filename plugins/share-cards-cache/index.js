import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

/**
 * Netlify Build Plugin: share-cards-cache
 *
 * Persists the locally-generated OG share-card images between Netlify deploys
 * so they are not regenerated from scratch on every build.
 *
 * The eleventy-plugin-share-card generator already keeps its own content-hash
 * cache in _cache/share-cards.json (handled by netlify-plugin-cache-folder),
 * but the actual image files must also survive between builds or the generator
 * will re-create them even when nothing has changed.
 */
export async function restoreShareCards(
	utils,
	directory = "./src/static/i/share-cards",
) {
	const exists = await fs.stat(directory).then(
		() => true,
		(error) => {
			if (error.code === "ENOENT") return false;
			throw error;
		},
	);
	const temporary = await fs.mkdtemp(
		path.join(os.tmpdir(), "share-cards-checkout-"),
	);
	const backup = path.join(temporary, "cards");
	try {
		if (exists) await fs.cp(directory, backup, { recursive: true });
		try {
			await utils.cache.restore(directory);
		} finally {
			// Netlify restore replaces the directory; checked-out cards must win.
			if (exists) await fs.cp(backup, directory, { recursive: true });
		}
	} finally {
		await fs.rm(temporary, { recursive: true, force: true });
	}
}

export default {
	async onPreBuild({ utils }) {
		await restoreShareCards(utils);
	},
	async onPostBuild({ utils }) {
		await utils.cache.save("./src/static/i/share-cards");
	},
};
