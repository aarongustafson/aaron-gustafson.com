import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { ContentProcessor, SocialMediaAPI } from "./social-media-utils.js";

class LinkSyndicator extends SocialMediaAPI {
	constructor() {
		const testMode =
			process.env.TEST_MODE === "true" || process.argv.includes("--test");
		super(testMode);
	}
	async run() {
		try {
			console.log("🔗 Starting link syndication...");

			const feedUrl = process.env.LINKS_FEED_URL;
			console.log(`📡 Fetching links from: ${feedUrl}`);

			// Add cache-busting parameter to ensure we get fresh content
			const cacheBustedUrl = `${feedUrl}?t=${Date.now()}`;
			const response = await fetch(cacheBustedUrl, {
				headers: {
					"Cache-Control": "no-cache",
					Pragma: "no-cache",
					Accept: "application/json",
				},
			});

			console.log("Feed URL:", cacheBustedUrl);
			console.log("Response status:", response.status);
			console.log(
				"Response content-type:",
				response.headers.get("content-type"),
			);

			// Parse JSON
			let feed = await response.json();

			// Debug logging
			console.log("Feed type:", typeof feed);
			console.log("Feed is object:", typeof feed === "object" && feed !== null);
			if (feed && typeof feed === "object") {
				console.log("Feed keys:", Object.keys(feed).join(", "));
				console.log("Has items property:", "items" in feed);
				if ("items" in feed) {
					console.log("Items is array:", Array.isArray(feed.items));
					console.log("Items length:", feed.items?.length || 0);
				}
			}

			if (!feed.items || feed.items.length === 0) {
				console.log("📭 No links found in feed");
				console.log(
					"Raw feed data (first 1000 chars):",
					JSON.stringify(feed).substring(0, 1000),
				);
				return;
			}

			// Get links that are not yet fully processed
			const newLinks = await this.cache.getUnprocessedItems(feed.items, "links");

			if (newLinks.length === 0) {
				console.log("✅ No new links to syndicate");
				return;
			}

			console.log(`🔗 Found ${newLinks.length} new link(s) to syndicate`);

			// Limit the number of links processed per run to avoid flooding platforms.
			// Set MAX_ITEMS_PER_RUN=0 to disable the limit and process everything.
			const rawLimit = process.env.MAX_ITEMS_PER_RUN;
			const parsedLimit =
				rawLimit === undefined || rawLimit.trim() === ""
					? 1
					: parseInt(rawLimit, 10);
			const limit =
				Number.isNaN(parsedLimit) || parsedLimit < 0 ? 1 : parsedLimit;

			// Deprioritize items that have prior platform failures so they don't
			// block never-attempted items (head-of-line blocking).
			const cacheStatus = await this.cache.getSyndicationStatus();
			newLinks.sort((a, b) => {
				const aHasFailure = Object.values(
					cacheStatus.links[a.id]?.platforms || {},
				).some((p) => !p.success);
				const bHasFailure = Object.values(
					cacheStatus.links[b.id]?.platforms || {},
				).some((p) => !p.success);
				if (aHasFailure && !bHasFailure) return 1;
				if (!aHasFailure && bHasFailure) return -1;
				return 0;
			});

			const linksToProcess = limit > 0 ? newLinks.slice(0, limit) : newLinks;
			if (limit > 0 && newLinks.length > limit) {
				console.log(
					`⏳ Processing ${linksToProcess.length} of ${newLinks.length} link(s) this run (MAX_ITEMS_PER_RUN=${limit}). Remaining will be posted in future runs.`,
				);
			}

			// Process each new link (most recent first)
			for (const link of linksToProcess) {
				console.log(`🔗 Processing link: ${link.title}`);
				await this.syndicateLink(link);
			}

			// Update last syndicated time after processing all links
			await this.cache.updateLastSyndicatedTime("links");

			console.log("✅ Link syndication completed successfully");
		} catch (error) {
			console.error("❌ Error during link syndication:", error.message);

			// Send error notification to IFTTT if configured
			await this.sendToIFTTT("syndication_error", {
				type: "links",
				error: error.message,
				timestamp: new Date().toISOString(),
			});

			process.exit(1);
		}
	}

	async syndicateLink(link) {
		const results = [];

		// Prepare content for different platforms
		const socialText =
			link.social_text || ContentProcessor.stripHtml(link.content_html);
		const relatedUrl = link.external_url || link.url;
		// For LinkedIn links, include full content with the external URL appended
		const linkedInContent = ContentProcessor.processContentForLinkedIn(
			link.content_html,
			false, // isPost = false
			link.url,
			relatedUrl,
		);

		// Generate screenshot URL
		const screenshotUrl = ContentProcessor.createScreenshotUrl(relatedUrl);

		// LinkedIn via IFTTT
		const linkedInPlatform = "linkedin";
		if (
			await this.cache.isPlatformSuccessful("links", link.id, linkedInPlatform)
		) {
			console.log("⏭️  Skipping LinkedIn - already posted successfully");
			results.push({
				platform: "LinkedIn (IFTTT)",
				success: true,
				skipped: true,
			});
		} else {
			try {
				console.log("📊 Posting to LinkedIn via IFTTT...");
				await this.sendToIFTTT("linkedin_link", {
					value1: link.title,
					value2: link.url,
					value3: linkedInContent,
				});
				await this.cache.markPlatformSuccess(
					"links",
					link.id,
					linkedInPlatform,
				);
				results.push({ platform: "LinkedIn (IFTTT)", success: true });
				console.log("✅ LinkedIn IFTTT webhook sent");
			} catch (error) {
				console.log("❌ LinkedIn IFTTT webhook failed:", error.message);
				await this.cache.markPlatformFailure(
					"links",
					link.id,
					linkedInPlatform,
					error.message,
				);
				results.push({
					platform: "LinkedIn (IFTTT)",
					success: false,
					error: error.message,
				});
			}
		}

		// Pinterest via IFTTT
		const pinterestPlatform = "pinterest";
		if (
			await this.cache.isPlatformSuccessful("links", link.id, pinterestPlatform)
		) {
			console.log("⏭️  Skipping Pinterest - already posted successfully");
			results.push({
				platform: "Pinterest (IFTTT)",
				success: true,
				skipped: true,
			});
		} else {
			try {
				console.log("📌 Posting to Pinterest via IFTTT...");
				await this.sendToIFTTT("pinterest_pin", {
					value1: link.title,
					value2: relatedUrl,
					value3: ContentProcessor.stripHtml(link.content_html || link.title),
				});
				await this.cache.markPlatformSuccess(
					"links",
					link.id,
					pinterestPlatform,
				);
				results.push({ platform: "Pinterest (IFTTT)", success: true });
				console.log("✅ Pinterest IFTTT webhook sent");
			} catch (error) {
				console.log("❌ Pinterest IFTTT webhook failed:", error.message);
				await this.cache.markPlatformFailure(
					"links",
					link.id,
					pinterestPlatform,
					error.message,
				);
				results.push({
					platform: "Pinterest (IFTTT)",
					success: false,
					error: error.message,
				});
			}
		}

		// Mastodon
		const mastodonPlatform = "mastodon";
		if (
			await this.cache.isPlatformSuccessful("links", link.id, mastodonPlatform)
		) {
			console.log("⏭️  Skipping Mastodon - already posted successfully");
			results.push({ platform: "Mastodon", success: true, skipped: true });
		} else {
			try {
				console.log("🐘 Posting to Mastodon...");
				const mastodonText = ContentProcessor.truncateText(
					`${socialText} ${relatedUrl}`,
					450,
				);
				const mastodonResult = await this.postToMastodon(mastodonText);
				await this.cache.markPlatformSuccess(
					"links",
					link.id,
					mastodonPlatform,
				);
				results.push({
					platform: "Mastodon",
					success: true,
					data: mastodonResult,
				});
				console.log("✅ Mastodon post successful");
			} catch (error) {
				console.log("❌ Mastodon post failed:", error.message);
				await this.cache.markPlatformFailure(
					"links",
					link.id,
					mastodonPlatform,
					error.message,
				);
				results.push({
					platform: "Mastodon",
					success: false,
					error: error.message,
				});

				// Fallback to IFTTT
				await this.sendToIFTTT("mastodon_link", {
					status: `${socialText} ${relatedUrl}`,
					guid: link.id,
				});
			}
		}

		// Buffer for Twitter and Bluesky
		const twitterPlatform = "twitter";
		const blueskyPlatform = "bluesky";

		const twitterDone = await this.cache.isPlatformSuccessful(
			"links",
			link.id,
			twitterPlatform,
		);
		const blueskyDone = await this.cache.isPlatformSuccessful(
			"links",
			link.id,
			blueskyPlatform,
		);

		if (twitterDone && blueskyDone) {
			console.log(
				"⏭️  Skipping Buffer - Twitter and Bluesky already posted successfully",
			);
			results.push({
				platform: "Buffer (Twitter/Bluesky)",
				success: true,
				skipped: true,
			});
		} else {
			try {
				console.log("🐦 Posting to Buffer (Twitter & Bluesky)...");
				const bufferText = ContentProcessor.truncateText(
					`${socialText} ${relatedUrl}`,
					260,
				);

				const profileIds = [];
				const profileMap = {};

				if (!twitterDone && process.env.BUFFER_TWITTER_PROFILE_ID) {
					profileIds.push(process.env.BUFFER_TWITTER_PROFILE_ID);
					profileMap[process.env.BUFFER_TWITTER_PROFILE_ID] = twitterPlatform;
				}

				if (!blueskyDone && process.env.BUFFER_BLUESKY_PROFILE_ID) {
					profileIds.push(process.env.BUFFER_BLUESKY_PROFILE_ID);
					profileMap[process.env.BUFFER_BLUESKY_PROFILE_ID] = blueskyPlatform;
				}

				if (profileIds.length > 0) {
					const bufferResults = await this.postToBuffer(bufferText, profileIds);

					// Track success/failure per profile
					for (const result of bufferResults) {
						const platform = profileMap[result.profileId];
						if (platform) {
							if (result.error) {
								await this.cache.markPlatformFailure(
									"links",
									link.id,
									platform,
									result.error,
								);
							} else {
								await this.cache.markPlatformSuccess(
									"links",
									link.id,
									platform,
								);
							}
						}
					}

					const allSucceeded = bufferResults.every((r) => !r.error);
					results.push({
						platform: "Buffer (Twitter/Bluesky)",
						success: allSucceeded,
						data: bufferResults,
					});
					console.log(
						allSucceeded
							? "✅ Buffer posts successful"
							: "⚠️  Some Buffer posts failed",
					);
				} else {
					console.log(
						"⚠️ No Buffer profile IDs configured or all already posted",
					);
				}
			} catch (error) {
				console.log("❌ Buffer posts failed:", error.message);
				if (!twitterDone) {
					await this.cache.markPlatformFailure(
						"links",
						link.id,
						twitterPlatform,
						error.message,
					);
				}
				if (!blueskyDone) {
					await this.cache.markPlatformFailure(
						"links",
						link.id,
						blueskyPlatform,
						error.message,
					);
				}
				results.push({
					platform: "Buffer",
					success: false,
					error: error.message,
				});

				// Fallback to IFTTT for both platforms
				await this.sendToIFTTT("twitter_link", {
					text: `${socialText} ${relatedUrl}`,
				});

				await this.sendToIFTTT("bluesky_link", {
					text: `${socialText} ${relatedUrl}`,
				});
			}
		}

		// Log results summary
		console.log("\n📊 Syndication Results:");
		results.forEach((result) => {
			const status = result.success ? "✅" : "❌";
			const skipped = result.skipped ? " (skipped - already successful)" : "";
			console.log(`${status} ${result.platform}${skipped}`);
			if (!result.success && result.error) {
				console.log(`   Error: ${result.error}`);
			}
		});

		return results;
	}
}

// Run the syndication if this file is executed directly
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
	const syndicator = new LinkSyndicator();
	syndicator.run();
}

export default LinkSyndicator;
