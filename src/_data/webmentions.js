import fs from "fs";
import unionBy from "lodash/unionBy.js";
import fetch from "node-fetch";
import { gunzipSync, gzipSync } from "zlib";

// Load .env variables with dotenv
import dotenv from "dotenv";
dotenv.config();

// Define Cache Location and API Endpoint
const CACHE_FILE_PATH = "_cache/webmentions.json";
const PROCESSED_CACHE_FILE = "_cache/webmentions_processed.json";
const COMPRESSED_CACHE_FILE = "_cache/webmentions_processed.gz";
const API = "https://webmention.io/api";
const TOKEN = process.env.WEBMENTION_IO_TOKEN;

const site_file = "src/_data/site.json";
const site = JSON.parse(fs.readFileSync(site_file));
const domain = site.domain;

const spammers_file = "src/_data/webmention_spammers.json";
const spammers = JSON.parse(fs.readFileSync(spammers_file));

// Configuration constants for optimization
const MAX_NAME_LENGTH = 200; // Reasonable limit for webmention names to avoid storing extremely long titles
const COMPRESSION_THRESHOLD = 1024 * 1024; // Use compression for files > 1MB

/**
 * Determines if the processed cache needs to be regenerated based on cache state.
 * 
 * @param {Object|null} processedData - Previously processed webmentions data
 * @param {Object} cache - Raw webmentions cache from file
 * @param {boolean} cacheHasData - Whether the cache contains webmention data
 * @returns {boolean} True if cache should be reprocessed
 * 
 * Logic:
 * - Always reprocess if no processed data exists
 * - Never reprocess if there's no cache data to process
 * - Always reprocess if processed data lacks lastProcessed timestamp
 * - Reprocess if cache is newer than last processing time
 */
function shouldReprocessCache(processedData, cache, cacheHasData) {
	if (!processedData) return true;
	if (!cacheHasData) return false;
	if (!processedData.lastProcessed) return true;
	
	const cacheDate = new Date(cache.lastFetched || 0);
	const processedDate = new Date(processedData.lastProcessed);
	return cacheDate > processedDate;
}

// Create optimized data structure for fast template access
function createOptimizedWebmentionData(webmentions) {
	const data = {
		lastProcessed: new Date().toISOString(),
		urlIndex: {},
		typeIndex: {},
		compactData: {},
		totalCount: webmentions.length
	};
	
	webmentions.forEach(mention => {
		const wmId = mention["wm-id"];
		const target = mention["wm-target"];
		const type = mention["wm-property"];
		
		// Store webmention in format compatible with both server and client templates
		// This maintains compatibility with the client-side WebmentionIO.js expectations
		data.compactData[wmId] = {
			// Server-side template fields
			"wm-id": wmId,
			"wm-target": target,
			"wm-property": type,
			"wm-source": mention["wm-source"] || null,
			url: mention.url,
			published: mention.published,
			author: mention.author || null,
			content: mention.content || null,
			name: mention.name || null,
			summary: mention.summary || null,
			
			// Client-side WebmentionIO.js compatibility fields
			id: wmId,
			source: mention.url,
			verified_date: mention.published,
			data: {
				url: mention.url,
				author: mention.author || null,
				content: mention.content && mention.content.text || mention.content && mention.content.html || mention.content && mention.content.value || null,
				published_ts: mention.published
			},
			activity: {
				type: type,
				sentence_html: mention.content && mention.content.html || null
			}
		};
		
		// Index by target URL for O(1) lookups
		if (!data.urlIndex[target]) {
			data.urlIndex[target] = [];
		}
		data.urlIndex[target].push(wmId);
		
		// Index by type for filtering
		if (!data.typeIndex[type]) {
			data.typeIndex[type] = [];
		}
		data.typeIndex[type].push(wmId);
	});
	
	return data;
}

// Read compressed processed cache
function readProcessedCache() {
	// Try compressed version first
	if (fs.existsSync(COMPRESSED_CACHE_FILE)) {
		try {
			const compressed = fs.readFileSync(COMPRESSED_CACHE_FILE);
			const json = gunzipSync(compressed).toString();
			const data = JSON.parse(json);
			console.log(">>> Using compressed processed webmentions cache");
			return data;
		} catch (e) {
			console.log(">>> Error reading compressed cache:", e.message);
		}
	}
	
	// Fall back to JSON version
	if (fs.existsSync(PROCESSED_CACHE_FILE)) {
		try {
			const data = JSON.parse(fs.readFileSync(PROCESSED_CACHE_FILE));
			console.log(">>> Using JSON processed webmentions cache");
			return data;
		} catch (e) {
			console.log(">>> Error reading JSON cache:", e.message);
		}
	}
	
	return null;
}

// Save processed cache with optional compression
function saveProcessedCache(data) {
	// First, estimate size to determine if compression is needed
	// Use a rough estimate based on object keys/structure before full stringification
	const estimatedSize = JSON.stringify(data).length; // Quick estimate
	
	try {
		// Only do full stringification once we know we need it
		const jsonString = JSON.stringify(data);
		const jsonSize = Buffer.byteLength(jsonString, 'utf8');
		
		// Always save JSON version as fallback
		fs.writeFileSync(PROCESSED_CACHE_FILE, jsonString);
		
		// Use compression for larger datasets
		if (jsonSize > COMPRESSION_THRESHOLD) {
			try {
				const compressed = gzipSync(jsonString);
				fs.writeFileSync(COMPRESSED_CACHE_FILE, compressed);
				
				const compressionRatio = ((jsonSize - compressed.length) / jsonSize * 100).toFixed(1);
				console.log(`>>> Processed cache compressed: ${compressionRatio}% reduction (${(jsonSize/1024/1024).toFixed(1)}MB -> ${(compressed.length/1024/1024).toFixed(1)}MB)`);
			} catch (compressionError) {
				console.warn(`>>> Failed to compress cache: ${compressionError.message}`);
				console.log(`>>> Processed cache saved: ${(jsonSize/1024/1024).toFixed(1)}MB`);
			}
		} else {
			console.log(`>>> Processed cache saved: ${(jsonSize/1024/1024).toFixed(1)}MB`);
		}
	} catch (error) {
		console.error(`>>> Failed to save processed cache: ${error.message}`);
		console.error('>>> Build may be slower on subsequent runs');
		// Don't throw - allow build to continue without cache
	}
}

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

	// Include content if it exists - be more inclusive to avoid missing content
	if (mention.content) {
		optimized.content = {};
		// Always include all available content fields
		if (mention.content.html) optimized.content.html = mention.content.html;
		if (mention.content.text) optimized.content.text = mention.content.text;
		if (mention.content.value) optimized.content.value = mention.content.value;
		// Include content-type if available
		if (mention.content["content-type"]) optimized.content["content-type"] = mention.content["content-type"];
	}

	// Include name only if it's reasonably short and useful
	if (mention.name && mention.name.length <= MAX_NAME_LENGTH) {
		optimized.name = mention.name;
	}

	// Include summary as fallback content
	if (mention.summary) {
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

	// Try to load preprocessed data first for fastest builds
	let processedData = readProcessedCache();
	const cache = readFromCache();
	const cacheHasData = cache.children && cache.children.length > 0;
	
	// Check if we need to regenerate processed cache
	const needsReprocessing = shouldReprocessCache(processedData, cache, cacheHasData);
	
	if (needsReprocessing && cacheHasData) {
		console.log(`>>> ${cache.children.length} webmentions loaded from cache`);
		console.log(">>> Processing webmentions for optimal build performance...");
		
		const startTime = Date.now();
		
		// Filter spammers and optimize data
		const cleanCache = excludeSpammers(cache);
		const optimizedChildren = cleanCache.children.map(optimizeWebmention);
		
		// Create optimized data structure
		processedData = createOptimizedWebmentionData(optimizedChildren);
		processedData.lastFetched = cache.lastFetched || new Date().toISOString();
		
		// Save for future builds
		saveProcessedCache(processedData);
		
		const processingTime = Date.now() - startTime;
		console.log(`>>> Processing completed in ${processingTime}ms`);
		
		// Only calculate expensive size metrics in debug mode
		if (process.env.VERBOSE === "true" || process.env.DEBUG === "true") {
			const originalSize = JSON.stringify(cache.children).length;
			const optimizedSize = JSON.stringify(processedData.compactData).length;
			const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
			console.log(`>>> Memory optimization: ${savings}% reduction (${(originalSize/1024/1024).toFixed(1)}MB -> ${(optimizedSize/1024/1024).toFixed(1)}MB)`);
		}
	} else if (processedData) {
		console.log(`>>> Using preprocessed webmentions cache (${processedData.totalCount} webmentions)`);
	}

	// Handle production updates
	if (process.env.NODE_ENV === "production") {
		console.log(">>> Checking for new webmentions...");
		const feed = await fetchWebmentions(cache.lastFetched);

		if (feed) {
			console.log(">>> New webmentions found, updating cache...");
			const mergedChildren = mergeWebmentions(cache, feed);
			
			// Save unoptimized version to cache for future fetches
			const newCache = {
				lastFetched: new Date().toISOString(),
				children: mergedChildren,
			};
			writeToCache(newCache);
			
			// Regenerate processed cache with new data
			const cleanNewCache = excludeSpammers(newCache);
			const optimizedNewChildren = cleanNewCache.children.map(optimizeWebmention);
			processedData = createOptimizedWebmentionData(optimizedNewChildren);
			processedData.lastFetched = newCache.lastFetched;
			
			saveProcessedCache(processedData);
		}
	}

	// Return data in format expected by templates
	if (!processedData) {
		return {
			lastFetched: null,
			children: [],
			urlIndex: {},
			typeIndex: {},
			totalCount: 0
		};
	}
	
	// Convert compact data back to array format for templates
	const children = Object.values(processedData.compactData);
	
	return {
		lastFetched: processedData.lastFetched,
		children: children,
		urlIndex: processedData.urlIndex,
		typeIndex: processedData.typeIndex,
		compactData: processedData.compactData,
		totalCount: processedData.totalCount
	};
}
