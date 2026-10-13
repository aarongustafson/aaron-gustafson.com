import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
	heroShareCardOptions,
	shareCardOptions,
} from "../../_11ty/share-card-config.js";
import { syncPostImages } from "./share-card-frontmatter.js";

function removeCache(cacheFile) {
	try {
		fs.unlinkSync(cacheFile);
		console.log(`Removed ${cacheFile}`);
	} catch (error) {
		if (error.code !== "ENOENT") {
			throw error;
		}
	}
}

export function runShareCardBuild({ force = false } = {}) {
	if (force) {
		removeCache(shareCardOptions.cacheFile);
		removeCache(heroShareCardOptions.cacheFile);
	}

	const result = spawnSync(
		process.execPath,
		["node_modules/@11ty/eleventy/cmd.cjs", "--quiet"],
		{
			stdio: "inherit",
			env: {
				...process.env,
				NODE_ENV: "development",
				NODE_OPTIONS:
					process.env.NODE_OPTIONS || "--max-old-space-size=6144",
				FORCE_SHARE_CARDS: force ? "true" : "false",
			},
		},
	);
	if (result.error) {
		throw result.error;
	}
	if (result.status !== 0) {
		throw new Error(`Share-card build exited with status ${result.status}`);
	}
}

export function manageShareCards({ force = false, dryRun = false } = {}) {
	if (!dryRun) {
		runShareCardBuild({ force });
	}

	const summary = syncPostImages({
		dryRun,
		validateOutput: !dryRun,
	});
	console.log(
		[
			`Posts: ${summary.posts}`,
			`${dryRun ? "Would update" : "Updated"}: ${summary.updated}`,
			`Skipped: ${summary.skipped}`,
			`Missing outputs: ${summary.missingOutputs.length}`,
		].join("\n"),
	);
	return summary;
}

const isMain =
	process.argv[1] &&
	path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
	const force = process.argv.includes("--force");
	const dryRun = process.argv.includes("--dry-run");
	try {
		manageShareCards({ force, dryRun });
	} catch (error) {
		console.error(error);
		process.exitCode = 1;
	}
}
