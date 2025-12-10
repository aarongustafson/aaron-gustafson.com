import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { htmlToText } from "html-to-text";

class ContentProcessor {
	static stripHtml(content) {
		return htmlToText(content, {
			wordwrap: false,
			ignoreHref: true,
			ignoreImage: true,
			preserveNewlines: true,
		});
	}

	static removeBlockquotes(content) {
		// Remove opening blockquotes
		content = content.replace(/<blockquote[^>]*>/g, "");
		// Remove closing blockquotes and replace with newlines
		content = content.replace(/<\/blockquote>/g, "\n\n");
		return content;
	}

	static removeTrailingParagraphs(content) {
		// Remove closing paragraph tags and replace with newlines
		content = content.replace(/<\/p>/g, "\n\n");
		return content;
	}

	static processContentForLinkedIn(rawContent) {
		let processed = rawContent;
		processed = this.removeBlockquotes(processed);
		processed = this.removeTrailingParagraphs(processed);
		processed = this.stripHtml(processed);

		// Clean up extra newlines
		processed = processed.replace(/\n\s*\n\s*\n/g, "\n\n");
		processed = processed.trim();

		return processed;
	}

	static createScreenshotUrl(url) {
		const apiKey = process.env.SCREENSHOT_API_KEY;
		if (!apiKey) {
			console.log("No screenshot API key provided, skipping screenshots");
			return null;
		}

		const encodedUrl = encodeURIComponent(url);
		return `https://api.screenshotmachine.com?key=${apiKey}&url=${encodedUrl}&dimension=1024x768&format=png`;
	}

	static truncateText(text, maxLength) {
		if (text.length <= maxLength) return text;

		// Find the last space before the max length
		const truncated = text.substring(0, maxLength);
		const lastSpace = truncated.lastIndexOf(" ");

		if (lastSpace > 0) {
			return truncated.substring(0, lastSpace) + "...";
		}

		return truncated + "...";
	}
}

class CacheManager {
	constructor() {
		this.cacheDir = ".github/cache";
		this.cacheFile = path.join(this.cacheDir, "syndication-status.json");
	}

	async ensureCacheDir() {
		try {
			await fs.mkdir(this.cacheDir, { recursive: true });
		} catch (error) {
			// Directory already exists or other error
		}
	}

	async getSyndicationStatus() {
		try {
			await this.ensureCacheDir();
			const data = await fs.readFile(this.cacheFile, "utf8");
			return JSON.parse(data);
		} catch (error) {
			// If no cache exists, initialize with empty status
			return {
				posts: {},
				links: {},
				initialized: new Date().toISOString(),
			};
		}
	}

	async markPlatformSuccess(type, itemId, platform) {
		const cache = await this.getSyndicationStatus();

		if (!cache[type][itemId]) {
			cache[type][itemId] = {
				platforms: {},
				firstAttempt: new Date().toISOString(),
			};
		}

		cache[type][itemId].platforms[platform] = {
			success: true,
			timestamp: new Date().toISOString(),
		};

		cache[type][itemId].lastUpdated = new Date().toISOString();

		await fs.writeFile(this.cacheFile, JSON.stringify(cache, null, 2));
	}

	async markPlatformFailure(type, itemId, platform, error) {
		const cache = await this.getSyndicationStatus();

		if (!cache[type][itemId]) {
			cache[type][itemId] = {
				platforms: {},
				firstAttempt: new Date().toISOString(),
			};
		}

		cache[type][itemId].platforms[platform] = {
			success: false,
			error: error,
			timestamp: new Date().toISOString(),
		};

		cache[type][itemId].lastUpdated = new Date().toISOString();

		await fs.writeFile(this.cacheFile, JSON.stringify(cache, null, 2));
	}

	async isPlatformSuccessful(type, itemId, platform) {
		const cache = await this.getSyndicationStatus();
		return cache[type][itemId]?.platforms[platform]?.success === true;
	}

	async getItemsNewerThan(items, type) {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		return items.filter((item) => {
			const itemDate = new Date(item.date_published);
			// Only include items published today or later
			return itemDate >= today;
		});
	}

	// For backwards compatibility - this method is deprecated
	async updateLastSyndicatedTime(type) {
		// No-op: we now track per-post, per-platform
		console.log(
			"⚠️  updateLastSyndicatedTime is deprecated - using granular tracking",
		);
	}

	// Legacy method for backwards compatibility
	async isProcessed(type, item) {
		// Consider an item processed only if ALL platforms succeeded
		const cache = await this.getSyndicationStatus();
		const itemStatus = cache[type][item.id];

		if (!itemStatus) return false;

		// Check if all platforms succeeded
		const platforms = Object.values(itemStatus.platforms);
		return platforms.length > 0 && platforms.every((p) => p.success === true);
	}
}

class SocialMediaAPI {
	constructor(testMode = false) {
		this.cache = new CacheManager();
		this.testMode = testMode || process.env.TEST_MODE === "true";

		if (this.testMode) {
			console.log("🧪 Running in TEST MODE - no actual posts will be made");
		}
	}

	// NOTE: LinkedIn and Pinterest now use IFTTT webhooks instead of direct API calls
	// The methods below are kept for reference but are not actively used
	// To use direct API integration, update syndicate-posts.js and syndicate-links.js

	async postToMastodon(status, mediaUrls = []) {
		const accessToken = process.env.MASTODON_ACCESS_TOKEN;
		const serverUrl = process.env.MASTODON_SERVER_URL;

		if ((!accessToken || !serverUrl) && !this.testMode) {
			throw new Error("Mastodon credentials not provided");
		}

		const postData = {
			status: status,
			visibility: "public",
		};

		// Upload media if provided
		if (mediaUrls.length > 0) {
			const mediaIds = [];
			for (const mediaUrl of mediaUrls) {
				if (this.testMode) {
					console.log("🧪 TEST: Would upload media to Mastodon:", mediaUrl);
					mediaIds.push("test-media-" + Date.now());
				} else {
					try {
						const mediaResponse = await axios.post(
							`${serverUrl}/api/v1/media`,
							{ url: mediaUrl },
							{
								headers: {
									Authorization: `Bearer ${accessToken}`,
								},
							},
						);
						mediaIds.push(mediaResponse.data.id);
					} catch (error) {
						console.log("Failed to upload media to Mastodon:", error.message);
					}
				}
			}
			if (mediaIds.length > 0) {
				postData.media_ids = mediaIds;
			}
		}

		if (this.testMode) {
			console.log(
				"🧪 TEST: Mastodon post data:",
				JSON.stringify(postData, null, 2),
			);
			return {
				id: "test-mastodon-post-" + Date.now(),
				url: "https://front-end.social/@test/123456789",
				testMode: true,
			};
		}

		const response = await axios.post(
			`${serverUrl}/api/v1/statuses`,
			postData,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
			},
		);

		return response.data;
	}

	async postToBuffer(text, profileIds, mediaUrl = null) {
		const accessToken = process.env.BUFFER_ACCESS_TOKEN;
		if (!accessToken && !this.testMode) {
			throw new Error("Buffer access token not provided");
		}

		const results = [];

		for (const profileId of profileIds) {
			const postData = {
				text: text,
				profile_ids: [profileId],
			};

			if (mediaUrl) {
				postData.media = {
					photo: mediaUrl,
				};
			}

			if (this.testMode) {
				console.log(
					`🧪 TEST: Buffer post data for profile ${profileId}:`,
					JSON.stringify(postData, null, 2),
				);
				results.push({
					id: `test-buffer-${profileId}-${Date.now()}`,
					profile_id: profileId,
					testMode: true,
				});
				continue;
			}

			try {
				const response = await axios.post(
					"https://api.bufferapp.com/1/updates/create.json",
					postData,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
							"Content-Type": "application/json",
						},
					},
				);
				results.push(response.data);
			} catch (error) {
				const errorDetails = error.response?.data || error.message;
				console.log(
					`Failed to post to Buffer profile ${profileId}:`,
					error.message,
				);
				if (error.response?.data) {
					console.log(
						"Buffer API error details:",
						JSON.stringify(error.response.data, null, 2),
					);
				}
				if (error.response?.status === 400) {
					console.log(
						"Post data that was rejected:",
						JSON.stringify(postData, null, 2),
					);
				}
				results.push({
					error: error.message,
					profileId,
					details: errorDetails,
				});
			}
		}

		return results;
	}

	async sendToIFTTT(event, data) {
		const webhookKey = process.env.IFTTT_KEY;
		if (!webhookKey && !this.testMode) {
			console.log("IFTTT webhook key not provided, skipping IFTTT fallback");
			return null;
		}

		if (this.testMode) {
			console.log(
				`🧪 TEST: IFTTT webhook "${event}":`,
				JSON.stringify(data, null, 2),
			);
			return {
				event: event,
				status: "sent",
				testMode: true,
			};
		}

		const response = await axios.post(
			`https://maker.ifttt.com/trigger/${event}/with/key/${webhookKey}`,
			data,
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		return response.data;
	}
}

export { ContentProcessor, CacheManager, SocialMediaAPI };
