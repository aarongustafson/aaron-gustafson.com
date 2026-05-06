import fs from "fs/promises";
import fetch from "node-fetch";
import path from "path";

const CACHE_DIR = ".github/cache";
const CACHE_FILE = path.join(CACHE_DIR, "syndication-status.json");

const PLATFORM_MAP = {
	posts: ["linkedin", "mastodon", "twitter", "bluesky"],
	links: ["linkedin", "pinterest", "mastodon", "twitter", "bluesky"],
};

function getArgValue(name) {
	const prefix = `${name}=`;
	const arg = process.argv.find((entry) => entry.startsWith(prefix));
	return arg ? arg.slice(prefix.length) : undefined;
}

function getConfig() {
	const contentType =
		process.env.MARK_ALL_SENT_CONTENT_TYPE ||
		getArgValue("--content-type") ||
		"both";

	if (!["posts", "links", "both"].includes(contentType)) {
		throw new Error(`Invalid content type: ${contentType}`);
	}

	const dryRun =
		process.env.MARK_ALL_SENT_DRY_RUN === "true" ||
		process.argv.includes("--dry-run");

	const alsoFetchFeeds =
		process.env.MARK_ALL_SENT_FETCH_FEEDS === "true" ||
		process.argv.includes("--fetch-feeds");

	return { contentType, dryRun, alsoFetchFeeds };
}

async function ensureCacheDir() {
	await fs.mkdir(CACHE_DIR, { recursive: true });
}

async function readCache() {
	try {
		await ensureCacheDir();
		const data = await fs.readFile(CACHE_FILE, "utf8");
		return JSON.parse(data);
	} catch {
		return {
			posts: {},
			links: {},
			initialized: new Date().toISOString(),
		};
	}
}

async function writeCache(cache) {
	await ensureCacheDir();
	await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

async function fetchFeed(feedUrl, label) {
	if (!feedUrl) {
		throw new Error(`Missing feed URL for ${label}`);
	}

	const cacheBustedUrl = `${feedUrl}?t=${Date.now()}`;
	console.log(`📡 Fetching ${label} feed: ${cacheBustedUrl}`);

	const response = await fetch(cacheBustedUrl, {
		headers: {
			"Cache-Control": "no-cache",
			Pragma: "no-cache",
			Accept: "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch ${label} feed: HTTP ${response.status}`);
	}

	const feed = await response.json();
	if (!feed?.items || !Array.isArray(feed.items)) {
		throw new Error(`Invalid ${label} feed format`);
	}

	return feed.items;
}

function markAllPlatformsSuccessful(cache, type, itemId, timestamp) {
	// Defensively initialize the type bucket and the item entry in case the
	// cache file is partial or corrupt.
	if (!cache[type] || typeof cache[type] !== "object") {
		cache[type] = {};
	}

	if (!cache[type][itemId] || typeof cache[type][itemId] !== "object") {
		cache[type][itemId] = {
			platforms: {},
			firstAttempt: timestamp,
		};
	}

	if (
		!cache[type][itemId].platforms ||
		typeof cache[type][itemId].platforms !== "object"
	) {
		cache[type][itemId].platforms = {};
	}

	for (const platform of PLATFORM_MAP[type]) {
		cache[type][itemId].platforms[platform] = {
			success: true,
			timestamp,
			markedManually: true,
		};
	}

	cache[type][itemId].lastUpdated = timestamp;
}

function markAllCacheEntriesForType(cache, type, markedIds, timestamp) {
	for (const itemId of Object.keys(cache[type] || {})) {
		markAllPlatformsSuccessful(cache, type, itemId, timestamp);
		markedIds.add(itemId);
	}
}

function markFeedItemsForType(cache, type, items, markedIds, timestamp) {
	for (const item of items) {
		if (!item.id) continue;
		markAllPlatformsSuccessful(cache, type, item.id, timestamp);
		markedIds.add(item.id);
	}
}

async function main() {
	const { contentType, dryRun, alsoFetchFeeds } = getConfig();
	const timestamp = new Date().toISOString();
	const cache = await readCache();
	let totalMarked = 0;

	console.log(`🏷️  Marking all syndication cache entries as sent`);
	console.log(`🎯 Content type: ${contentType}`);
	console.log(
		alsoFetchFeeds
			? "📡 Will also fetch live feeds to include items not yet in cache"
			: "📂 Operating on existing cache entries only",
	);
	console.log(
		dryRun
			? "🧪 Dry run only — cache will not be written"
			: "✍️  Cache writes enabled",
	);

	const types = contentType === "both" ? ["posts", "links"] : [contentType];

	for (const type of types) {
		// Use a Set so each unique item ID is counted exactly once even if it
		// appears in both the existing cache and the live feed.
		const markedIds = new Set();

		// Mark existing cache entries
		markAllCacheEntriesForType(cache, type, markedIds, timestamp);

		// Optionally fetch live feeds and mark those items too
		if (alsoFetchFeeds) {
			const feedEnvKey = type === "posts" ? "POSTS_FEED_URL" : "LINKS_FEED_URL";
			const feedUrl = process.env[feedEnvKey];
			try {
				const items = await fetchFeed(feedUrl, type);
				markFeedItemsForType(cache, type, items, markedIds, timestamp);
			} catch (error) {
				console.error(`  ⚠️  Failed to fetch ${type} feed: ${error.message}`);
			}
		}

		console.log(`  ✅ ${type}: ${markedIds.size} unique items marked as sent`);
		totalMarked += markedIds.size;
	}

	if (totalMarked === 0) {
		console.log("✅ No items found to mark");
		return;
	}

	if (dryRun) {
		console.log(`🧪 Dry run complete — ${totalMarked} entries would be updated`);
		return;
	}

	await writeCache(cache);
	console.log(`✅ Cache updated: ${CACHE_FILE} (${totalMarked} entries marked as sent)`);
}

main().catch((error) => {
	console.error("❌ Failed to mark cache entries as sent:", error.message);
	process.exit(1);
});
