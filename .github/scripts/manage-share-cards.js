import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createGenerator } from "@aarongustafson/eleventy-plugin-share-card";
import { deriveHeroShareCard } from "../../_11ty/hero-share-card.js";
import { plainText } from "../../_11ty/metadata.js";
import {
	heroShareCardOptions,
	postSlugFromPath,
	shareCardOptions,
	tagsToShareCardText,
} from "../../_11ty/share-card-config.js";
import { parseFrontmatter, syncPostImages } from "./share-card-frontmatter.js";

function loadCache(cacheFile) {
	try {
		return JSON.parse(fs.readFileSync(cacheFile, "utf8"));
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		return {};
	}
}

function saveCache(cacheFile, cache) {
	fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
	const temporary = `${cacheFile}.tmp-${process.pid}`;
	fs.writeFileSync(temporary, `${JSON.stringify(cache, null, 2)}\n`);
	fs.renameSync(temporary, cacheFile);
}

export async function buildPostShareCard(
	post,
	{
		force = false,
		dryRun = false,
		cardOptions = shareCardOptions,
		heroOptions = heroShareCardOptions,
	} = {},
) {
	if (path.extname(post) !== ".md") {
		throw new Error(`Expected a Markdown post: ${post}`);
	}
	const { data } = parseFrontmatter(fs.readFileSync(post, "utf8"), post);
	const slug = postSlugFromPath(post);
	const image = `${cardOptions.outputUrlPath.replace(/\/$/, "")}/${slug}.jpg`;
	if (data.image && data.image !== image) {
		console.log(`Preserving custom image for ${post}: ${data.image}`);
	} else if (!dryRun) {
		if (data.hero) {
			const cache = loadCache(heroOptions.cacheFile);
			await deriveHeroShareCard(data.hero, slug, heroOptions, cache, force);
			saveCache(heroOptions.cacheFile, cache);
		} else {
			// The text generator logs failures rather than throwing. Requiring a
			// fresh cache entry prevents an old image from masking a failed render.
			const cache = loadCache(cardOptions.cacheFile);
			delete cache[slug];
			saveCache(cardOptions.cacheFile, cache);
			const hooks = [];
			const generate = createGenerator(cardOptions, {
				on(event, callback) {
					if (event !== "eleventy.after") {
						throw new Error(`Unexpected share-card build event: ${event}`);
					}
					hooks.push(callback);
				},
			});
			await generate(
				[plainText(data.title), tagsToShareCardText(data.tags)],
				slug,
			);
			for (const flush of hooks) await flush();
			if (
				!loadCache(cardOptions.cacheFile)[slug] ||
				!fs.existsSync(path.join(cardOptions.outputDir, `${slug}.jpg`))
			) {
				throw new Error(`Failed to generate share card for ${post}`);
			}
		}
	}

	return syncPostImages({
		files: [post],
		outputDir: cardOptions.outputDir,
		outputUrlPath: cardOptions.outputUrlPath,
		dryRun,
		validateOutput: !dryRun,
	});
}

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
				NODE_OPTIONS: process.env.NODE_OPTIONS || "--max-old-space-size=6144",
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

export async function manageShareCards({
	force = false,
	dryRun = false,
	post,
} = {}) {
	if (!post && !dryRun) {
		runShareCardBuild({ force });
	}

	const summary = post
		? await buildPostShareCard(post, { force, dryRun })
		: syncPostImages({
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
	path.resolve(process.argv[1]) ===
		path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
	const force = process.argv.includes("--force");
	const dryRun = process.argv.includes("--dry-run");
	try {
		const postIndex = process.argv.indexOf("--post");
		const post = postIndex === -1 ? undefined : process.argv[postIndex + 1];
		if (postIndex !== -1 && (!post || post.startsWith("--"))) {
			throw new Error("--post requires a Markdown file path");
		}
		await manageShareCards({ force, dryRun, post });
	} catch (error) {
		console.error(error);
		process.exitCode = 1;
	}
}
