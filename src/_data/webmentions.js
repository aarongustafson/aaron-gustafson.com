import fs from "fs";
import unionBy from "lodash/unionBy.js";
import fetch from "node-fetch";

// Load .env variables with dotenv
import dotenv from "dotenv";
dotenv.config();

// Define Cache Location and API Endpoint
const CACHE_FILE_PATH = "_cache/webmentions.json";
const API = "https://webmention.io/api";
const TOKEN = process.env.WEBMENTION_IO_TOKEN;

const site_file = "src/_data/site.json";
const site = JSON.parse(fs.readFileSync(site_file));
const domain = site.domain;

const spammers_file = "src/_data/webmention_spammers.json";
const spammers = JSON.parse(fs.readFileSync(spammers_file));

// Configuration constants for optimization
const MAX_NAME_LENGTH = 200; // Reasonable limit for webmention names to avoid storing extremely long titles

// Optimize webmention data to reduce memory usage
function optimizeWebmention(mention) {
	const optimized = {
		"wm-id": mention["wm-id"],
		"wm-target": mention["wm-target"],
		"wm-property": mention["wm-property"],
		url: mention.url,
		published: mention.published
	};

	// Only include author data if it exists and has useful info
	if (mention.author && (mention.author.name || mention.author.photo || mention.author.url)) {
		optimized.author = {};
		if (mention.author.name) optimized.author.name = mention.author.name;
		if (mention.author.photo) optimized.author.photo = mention.author.photo;
		if (mention.author.url) optimized.author.url = mention.author.url;
	}

	// Only include content if it exists and is meaningful
	if (mention.content) {
		const hasContent = mention.content.html || mention.content.text;
		if (hasContent) {
			optimized.content = {};
			if (mention.content.html) optimized.content.html = mention.content.html;
			if (mention.content.text) optimized.content.text = mention.content.text;
			// Include 'value' as fallback only if no other content is present
		} else if (mention.content.value) {
			optimized.content = { value: mention.content.value };
		}
	}

	// Include name only if it's reasonably short and useful
	if (mention.name && mention.name.length <= MAX_NAME_LENGTH) {
		optimized.name = mention.name;
	}

	// Include summary as fallback content
	if (mention.summary && !optimized.content) {
		optimized.summary = mention.summary;
	}

	// Include webmention type properties
	['like-of', 'repost-of', 'in-reply-to', 'mention-of', 'bookmark-of'].forEach(prop => {
		if (mention[prop]) {
			optimized[prop] = mention[prop];
		}
	});

	// Include wm-source for Twitter/Mastodon detection
	if (mention["wm-source"]) {
		optimized["wm-source"] = mention["wm-source"];
	}

	return optimized;
}

async function fetchWebmentions(since, perPage = 10000) {
	// If we dont have a domain name or token, abort
	if (!domain || !TOKEN) {
		console.warn(">>> unable to fetch webmentions: missing domain or token");
		return false;
	}

	let url = `${API}/mentions.jf2?domain=${domain}&token=${TOKEN}&per-page=${perPage}`;
	// only fetch new mentions
	if (since) {
		url += `&since=${since}`;
	}
	const response = await fetch(url);

	if (response.ok) {
		const feed = await response.json();
		console.log(
			`>>> ${feed.children.length} new webmentions fetched from ${API}`
		);
		return feed;
	}

	return null;
}

// Merge fresh webmentions with cached entries, unique per id
function mergeWebmentions(a, b) {
	return unionBy(a.children, b.children, "wm-id");
}

// save combined webmentions in cache file
function writeToCache(data) {
	const dir = "_cache";
	const fileContent = JSON.stringify(data, null, 2);

	// create cache folder if it doesnt exist already
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	// write data to cache json file
	fs.writeFile(CACHE_FILE_PATH, fileContent, (err) => {
		if (err) throw err;
		console.log(`>>> webmentions cached to ${CACHE_FILE_PATH}`);
	});
}

// get cache contents from json file
function readFromCache() {
	if (fs.existsSync(CACHE_FILE_PATH)) {
		const cacheFile = fs.readFileSync(CACHE_FILE_PATH);
		return JSON.parse(cacheFile);
	}

	// no cache found.
	return {
		lastFetched: null,
		children: [],
	};
}

function excludeSpammers(feed) {
	const regex = /^https?\:\/\/([^/]+).*/;
	let filtered_children = feed.children.filter((item) => {
		let domain = item.url.replace(regex, "$1");
		return spammers.indexOf(domain) < 0;
	});
	feed.children = filtered_children;
	return feed;
}

export default async function () {
	console.log(">>> Reading webmentions from cache...");

	const cache = readFromCache();
	let optimizedChildren = [];
	
	if (cache.children.length) {
		console.log(`>>> ${cache.children.length} webmentions loaded from cache`);
		
		// Optimize webmentions data in memory to reduce build-time memory usage
		console.log(">>> Optimizing webmentions data for memory efficiency...");
		const startData = JSON.stringify(cache.children);
		const startSize = Buffer.byteLength(startData, 'utf8');
		optimizedChildren = cache.children.map(optimizeWebmention);
		const endData = JSON.stringify(optimizedChildren);
		const endSize = Buffer.byteLength(endData, 'utf8');
		const savings = ((startSize - endSize) / startSize * 100).toFixed(1);
		console.log(`>>> Memory optimization: ${savings}% reduction (${(startSize/1024/1024).toFixed(1)}MB -> ${(endSize/1024/1024).toFixed(1)}MB)`);
	}

	// Only fetch new mentions in production
	if (process.env.NODE_ENV === "production") {
		console.log(">>> Checking for new webmentions...");
		const feed = await fetchWebmentions(cache.lastFetched);

		if (feed) {
			const mergedChildren = mergeWebmentions(cache, feed);
			
			// Save unoptimized version to cache for future fetches
			const webmentions = {
				lastFetched: new Date().toISOString(),
				children: mergedChildren,
			};
			writeToCache(webmentions);
			
			// Return optimized version for build
			const optimizedWebmentions = {
				lastFetched: webmentions.lastFetched,
				children: mergedChildren.map(optimizeWebmention)
			};
			
			return excludeSpammers(optimizedWebmentions);
		}
	}

	// Return optimized cache data
	const optimizedCache = {
		lastFetched: cache.lastFetched,
		children: optimizedChildren
	};
	
	return excludeSpammers(optimizedCache);
}
