import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

const CACHE_FILE = path.join(".github", "cache", "syndication-status.json");
const DEFAULT_SAMPLE_POST_ID =
	"https://www.aaron-gustafson.com/notebook/never-lose-form-progress-again/";

function countItems(collection = {}) {
	return Object.keys(collection).length;
}

function countFullySuccessfulItems(collection = {}) {
	return Object.values(collection).filter((itemStatus) => {
		const platforms = Object.values(itemStatus?.platforms || {});
		return platforms.length > 0 && platforms.every((platform) => platform.success);
	}).length;
}

function getIncompleteItems(collection = {}) {
	return Object.entries(collection)
		.filter(([, itemStatus]) => {
			const platforms = Object.values(itemStatus?.platforms || {});
			return platforms.length === 0 || platforms.some((platform) => !platform.success);
		})
		.map(([itemId, itemStatus]) => ({
			itemId,
			platforms: itemStatus?.platforms || {},
		}));
}

function printVerboseSection(label, collection = {}) {
	const entries = Object.entries(collection);
	if (entries.length === 0) {
		console.log(`\n=== ${label} (0 entries) ===`);
		return;
	}

	console.log(`\n=== ${label} (${entries.length} entries) ===`);

	// Sort by most-recently updated first for readability
	const sorted = entries.sort(([, a], [, b]) => {
		const aTime = a?.lastUpdated || a?.firstAttempt || "";
		const bTime = b?.lastUpdated || b?.firstAttempt || "";
		return bTime.localeCompare(aTime);
	});

	for (const [itemId, itemStatus] of sorted) {
		const platforms = itemStatus?.platforms || {};
		const platformNames = Object.keys(platforms).sort();
		const allSuccess = platformNames.length > 0 && platformNames.every((p) => platforms[p]?.success);
		const statusIcon = allSuccess ? "✅" : "⚠️ ";
		console.log(`\n  ${statusIcon} ${itemId}`);
		console.log(`     firstAttempt : ${itemStatus?.firstAttempt || "(none)"}`);
		console.log(`     lastUpdated  : ${itemStatus?.lastUpdated || "(none)"}`);
		if (platformNames.length === 0) {
			console.log(`     platforms    : (none)`);
		} else {
			for (const platform of platformNames) {
				const p = platforms[platform];
				const icon = p?.success ? "✅" : "❌";
				const flags = [
					p?.seeded ? "seeded" : null,
					p?.markedManually ? "markedManually" : null,
				].filter(Boolean).join(", ");
				const flagStr = flags ? ` [${flags}]` : "";
				const errStr = p?.error ? ` -- ERROR: ${p.error}` : "";
				console.log(`     ${icon} ${platform.padEnd(10)} @ ${p?.timestamp || "(no timestamp)"}${flagStr}${errStr}`);
			}
		}
	}
}

async function main() {
	const verbose = process.argv.includes("--verbose") || process.argv.includes("-v");
	const samplePostId = process.argv.find((a) => a.startsWith("--sample="))?.slice(9) || DEFAULT_SAMPLE_POST_ID;

	try {
		const content = await fs.readFile(CACHE_FILE, "utf8");
		const hash = crypto.createHash("sha256").update(content).digest("hex");
		const size = Buffer.byteLength(content, "utf8");
		const cache = JSON.parse(content);

		console.log(`cache_file=${CACHE_FILE}`);
		console.log(`cache_size_bytes=${size}`);
		console.log(`cache_sha256=${hash}`);
		console.log(`posts_total=${countItems(cache.posts)}`);
		console.log(`posts_fully_successful=${countFullySuccessfulItems(cache.posts)}`);
		console.log(`links_total=${countItems(cache.links)}`);
		console.log(`links_fully_successful=${countFullySuccessfulItems(cache.links)}`);

		const incompletePosts = getIncompleteItems(cache.posts);
		const incompleteLinks = getIncompleteItems(cache.links);
		console.log(`posts_incomplete=${incompletePosts.length}`);
		console.log(`links_incomplete=${incompleteLinks.length}`);
		if (incompletePosts.length > 0) {
			console.log(`posts_incomplete_ids=${incompletePosts.map((item) => item.itemId).join(",")}`);
		}
		if (incompleteLinks.length > 0) {
			console.log(`links_incomplete_ids=${incompleteLinks.map((item) => item.itemId).join(",")}`);
		}

		const samplePost = cache.posts?.[samplePostId];
		if (samplePost) {
			console.log(`sample_post_id=${samplePostId}`);
			console.log(
				`sample_post_platforms=${Object.keys(samplePost.platforms || {}).sort().join(",")}`,
			);
			console.log(
				`sample_post_platform_statuses=${JSON.stringify(samplePost.platforms || {})}`,
			);
		} else {
			console.log(`sample_post_missing=${samplePostId}`);
		}

		if (verbose) {
			console.log("\n========================================");
			console.log("VERBOSE CACHE DUMP");
			console.log("========================================");
			console.log(`initialized : ${cache.initialized || "(unknown)"}`);
			printVerboseSection("POSTS", cache.posts);
			printVerboseSection("LINKS", cache.links);
			console.log("\n========================================");
			console.log("END VERBOSE CACHE DUMP");
			console.log("========================================");
		}
	} catch (error) {
		console.log(`cache_file_missing=${CACHE_FILE}`);
		console.log(`cache_error=${error.message}`);
	}
}

main().catch((error) => {
	console.error("Failed to inspect syndication cache:", error.message);
	process.exit(1);
});