import fs from "fs/promises";
import { htmlToText } from "html-to-text";
import fetch from "node-fetch";
import path from "path";

const BUFFER_DUPLICATE_ERROR_PATTERNS = [
	/posted that one recently/i,
	/not able to post the same thing again so soon/i,
	/\balready (?:queued|scheduled|posted)\b/i,
	/\bduplicate (?:update|post)\b/i,
];

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

	// LinkedIn shortens URLs to approximately this many characters
	// (e.g. https://lnkd.in/gqwacVKT)
	static LINKEDIN_SHORTENED_URL_LENGTH = 28;
	static LINKEDIN_MAX_LENGTH = 3000;

	static processContentForLinkedIn(
		rawContent,
		isPost = false,
		itemUrl = "",
		externalUrl = "",
	) {
		let processed = rawContent;
		processed = this.removeBlockquotes(processed);
		processed = this.removeTrailingParagraphs(processed);
		processed = this.stripHtml(processed);

		// Clean up extra newlines
		processed = processed.replace(/\n\s*\n\s*\n/g, "\n\n");
		processed = processed.trim();

		if (isPost) {
			// For posts: include full content if it fits, otherwise truncate by word
			const fullSuffix = `\n\nOriginally posted at ${itemUrl}`;
			const truncatedSuffix = `\n\nContinue reading on ${itemUrl}`;

			// Account for LinkedIn shortening the URL
			const urlSavings = Math.max(0, itemUrl.length - this.LINKEDIN_SHORTENED_URL_LENGTH);

			const fullMessage = `${processed}${fullSuffix}`;
			const effectiveFullLength = fullMessage.length - urlSavings;

			if (effectiveFullLength <= this.LINKEDIN_MAX_LENGTH) {
				// Full content fits within the limit
				processed = fullMessage;
			} else {
				// Need to truncate: budget = max length - suffix (with shortened URL) - ellipsis
				const effectiveSuffixLength = truncatedSuffix.length - urlSavings;
				const contentBudget = this.LINKEDIN_MAX_LENGTH - effectiveSuffixLength - 1; // 1 for "…"
				const truncatedContent = this.truncateByWord(processed, contentBudget);
				processed = `${truncatedContent}\u2026${truncatedSuffix}`;
			}
		} else if (externalUrl) {
			// For links: append "Check it out: {url}"
			processed = `${processed}\n\nCheck it out: ${externalUrl}`;
		}

		return processed;
	}

	/**
	 * Truncate text at a word boundary without adding any suffix.
	 */
	static truncateByWord(text, maxLength) {
		if (text.length <= maxLength) return text;

		const truncated = text.substring(0, maxLength);
		const lastSpace = truncated.lastIndexOf(" ");

		if (lastSpace > 0) {
			return truncated.substring(0, lastSpace);
		}

		return truncated;
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
	constructor(testMode = false) {
		this.cacheDir = ".github/cache";
		this.cacheFile = path.join(this.cacheDir, "syndication-status.json");
		this.cacheBootstrapDateId = "2026-04-21";
		this.cacheBootstrapDate = new Date(`${this.cacheBootstrapDateId}T00:00:00.000Z`);
		this.cacheBootstrapPlatform = `baseline_${this.cacheBootstrapDateId.replaceAll("-", "_")}`;
		this.testMode = testMode;
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
		if (this.testMode) {
			console.log(
				`🧪 TEST: Skipping cache success write for ${type}:${itemId}:${platform}`,
			);
			return;
		}

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
		if (this.testMode) {
			console.log(
				`🧪 TEST: Skipping cache failure write for ${type}:${itemId}:${platform}`,
			);
			return;
		}

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

	isItemProcessed(itemStatus) {
		if (!itemStatus) return false;

		const platforms = Object.values(itemStatus.platforms || {});
		return platforms.length > 0 && platforms.every((platform) => platform.success);
	}

	async getUnprocessedItems(items, type) {
		const cache = await this.getSyndicationStatus();
		const unprocessedItems = [];
		let cacheUpdated = false;
		const now = new Date().toISOString();

		for (const item of items) {
			const itemStatus = cache[type][item.id];
			if (this.isItemProcessed(itemStatus)) {
				continue;
			}

			const itemDate = item.date_published ? new Date(item.date_published) : null;
			const isBeforeBootstrapDate =
				itemDate && !Number.isNaN(itemDate.getTime())
					? itemDate < this.cacheBootstrapDate
					: false;

			if (!itemStatus && isBeforeBootstrapDate) {
				cache[type][item.id] = {
					platforms: {
						[this.cacheBootstrapPlatform]: {
							success: true,
							timestamp: now,
						},
					},
					firstAttempt: now,
					lastUpdated: now,
				};
				cacheUpdated = true;
				continue;
			}

			unprocessedItems.push(item);
		}

		if (cacheUpdated && !this.testMode) {
			await fs.writeFile(this.cacheFile, JSON.stringify(cache, null, 2));
		} else if (cacheUpdated) {
			console.log("🧪 TEST: Skipping cache bootstrap writes");
		}

		return unprocessedItems;
	}

	// Backwards-compatible alias
	async getItemsNewerThan(items, type) {
		return this.getUnprocessedItems(items, type);
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
		return this.isItemProcessed(itemStatus);
	}
}

class SocialMediaAPI {
	constructor(testMode = false) {
		this.testMode = testMode || process.env.TEST_MODE === "true";
		this.cache = new CacheManager(this.testMode);

		if (this.testMode) {
			console.log("🧪 Running in TEST MODE - no actual posts will be made");
		}
	}

	isBufferDuplicateErrorMessage(message) {
		if (typeof message !== "string") {
			return false;
		}

		return BUFFER_DUPLICATE_ERROR_PATTERNS.some((pattern) =>
			pattern.test(message),
		);
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
						const mediaResponse = await fetch(`${serverUrl}/api/v1/media`, {
							method: "POST",
							headers: {
								Authorization: `Bearer ${accessToken}`,
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ url: mediaUrl }),
						});
						const mediaData = await mediaResponse.json();
						mediaIds.push(mediaData.id);
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

		const response = await fetch(`${serverUrl}/api/v1/statuses`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(postData),
		});

		return await response.json();
	}

	async postToBuffer(text, profileIds, mediaUrl = null) {
		const accessToken = process.env.BUFFER_ACCESS_TOKEN;
		if (!accessToken && !this.testMode) {
			throw new Error("Buffer access token not provided");
		}

		const results = [];

		for (const profileId of profileIds) {
			// Build form-encoded data (Buffer API expects this format)
			const formData = new URLSearchParams();
			formData.append("text", text);
			formData.append("profile_ids[]", profileId);

			if (mediaUrl) {
				formData.append("media[photo]", mediaUrl);
			}

			if (this.testMode) {
				console.log(
					`🧪 TEST: Buffer post data for profile ${profileId}:`,
					formData.toString(),
				);
				results.push({
					id: `test-buffer-${profileId}-${Date.now()}`,
					profileId,
					testMode: true,
				});
				continue;
			}

			try {
				const response = await fetch(
					"https://api.bufferapp.com/1/updates/create.json",
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${accessToken}`,
							"Content-Type": "application/x-www-form-urlencoded",
						},
						body: formData.toString(),
					},
				);
				const data = await response.json();

				// Check for errors in the response
				if (!response.ok || !data.success) {
					throw new Error(data.message || `HTTP ${response.status}`);
				}

				results.push({
					...data,
					profileId,
				});
			} catch (error) {
				// For fetch errors, try to get response data
				let errorDetails = error.message;
				let responseData = null;

				try {
					if (error.response) {
						responseData = await error.response.json();
						errorDetails = responseData;
					}
				} catch (e) {
					// Ignore JSON parse errors
				}

				console.log(
					`Failed to post to Buffer profile ${profileId}:`,
					error.message,
				);
				if (responseData) {
					console.log(
						"Buffer API error details:",
						JSON.stringify(responseData, null, 2),
					);
				}
				const duplicateDetected =
					this.isBufferDuplicateErrorMessage(error.message) ||
					this.isBufferDuplicateErrorMessage(
						typeof errorDetails === "string" ? errorDetails : null,
					) ||
					this.isBufferDuplicateErrorMessage(
						responseData?.message || responseData?.error,
					);

				if (duplicateDetected) {
					console.log(
						`ℹ️ Buffer reports profile ${profileId} already has this update queued or posted; treating as success to avoid duplicate retries`,
					);
					results.push({
						profileId,
						duplicateDetected: true,
						success: true,
					});
					continue;
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

		const response = await fetch(
			`https://maker.ifttt.com/trigger/${event}/with/key/${webhookKey}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		);

		const responseText = await response.text();
		let parsedResponse;

		if (responseText) {
			try {
				parsedResponse = JSON.parse(responseText);
			} catch (error) {
				parsedResponse = { message: responseText };
			}
		}

		if (!response.ok) {
			const errorMessage =
				parsedResponse?.message || responseText || `HTTP ${response.status}`;
			throw new Error(errorMessage);
		}

		return (
			parsedResponse || {
				status: response.status,
				ok: response.ok,
			}
		);
	}
}

export { CacheManager, ContentProcessor, SocialMediaAPI };
