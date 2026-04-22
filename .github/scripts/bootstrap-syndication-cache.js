import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";

const DEFAULT_CUTOFF = "2026-04-21";
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
	const before =
		process.env.BOOTSTRAP_CACHE_BEFORE ||
		getArgValue("--before") ||
		DEFAULT_CUTOFF;
	const beforeDate = new Date(`${before}T00:00:00.000Z`);

	if (Number.isNaN(beforeDate.getTime())) {
		throw new Error(`Invalid bootstrap cutoff date: ${before}`);
	}

	const contentType =
		process.env.BOOTSTRAP_CACHE_CONTENT_TYPE ||
		getArgValue("--content-type") ||
		"both";

	if (!["posts", "links", "both"].includes(contentType)) {
		throw new Error(`Invalid content type: ${contentType}`);
	}

	const dryRun =
		process.env.BOOTSTRAP_CACHE_DRY_RUN === "true" ||
		process.argv.includes("--dry-run");

	return {
		before,
		beforeDate,
		contentType,
		dryRun,
	};
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

function shouldBootstrapItem(item, beforeDate) {
	const itemDate = item.date_published ? new Date(item.date_published) : null;
	if (!itemDate || Number.isNaN(itemDate.getTime())) {
		return false;
	}

	return itemDate < beforeDate;
}

function markPlatformsSuccessful(cache, type, item, timestamp) {
	if (!cache[type][item.id]) {
		cache[type][item.id] = {
			platforms: {},
			firstAttempt: timestamp,
		};
	}

	for (const platform of PLATFORM_MAP[type]) {
		cache[type][item.id].platforms[platform] = {
			success: true,
			timestamp,
			seeded: true,
		};
	}

	cache[type][item.id].lastUpdated = timestamp;
}

async function seedType(cache, type, items, beforeDate) {
	let seededCount = 0;
	for (const item of items) {
		if (!shouldBootstrapItem(item, beforeDate)) {
			continue;
		}

		markPlatformsSuccessful(cache, type, item, new Date().toISOString());
		seededCount += 1;
	}

	return seededCount;
}

async function main() {
	const { before, beforeDate, contentType, dryRun } = getConfig();
	const cache = await readCache();
	let changed = false;

	console.log(`🗂️  Seeding syndication cache for items published before ${before}`);
	console.log(`🎯 Content type: ${contentType}`);
	console.log(
		dryRun
			? "🧪 Dry run only - cache will not be written"
			: "✍️  Cache writes enabled",
	);

	if (contentType === "posts" || contentType === "both") {
		const posts = await fetchFeed(process.env.POSTS_FEED_URL, "posts");
		const seededPosts = await seedType(cache, "posts", posts, beforeDate);
		console.log(`📝 Posts marked as sent: ${seededPosts}`);
		changed = changed || seededPosts > 0;
	}

	if (contentType === "links" || contentType === "both") {
		const links = await fetchFeed(process.env.LINKS_FEED_URL, "links");
		const seededLinks = await seedType(cache, "links", links, beforeDate);
		console.log(`🔗 Links marked as sent: ${seededLinks}`);
		changed = changed || seededLinks > 0;
	}

	if (!changed) {
		console.log("✅ No items required cache seeding");
		return;
	}

	if (dryRun) {
		console.log("🧪 Dry run complete - cache file left unchanged");
		return;
	}

	await writeCache(cache);
	console.log(`✅ Cache updated: ${CACHE_FILE}`);
}

main().catch((error) => {
	console.error("❌ Failed to seed syndication cache:", error.message);
	process.exit(1);
});