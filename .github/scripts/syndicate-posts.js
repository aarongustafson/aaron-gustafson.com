import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { ContentProcessor, SocialMediaAPI } from "./social-media-utils.js";

class PostSyndicator extends SocialMediaAPI {
	constructor() {
		const testMode =
			process.env.TEST_MODE === "true" || process.argv.includes("--test");
		super(testMode);
	}
	async run() {
		try {
			console.log("🚀 Starting post syndication...");

			const feedUrl = process.env.POSTS_FEED_URL;
			console.log(`📡 Fetching posts from: ${feedUrl}`);

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
				console.log("📭 No posts found in feed");
				console.log(
					"Raw feed data (first 1000 chars):",
					JSON.stringify(feed).substring(0, 1000),
				);
				return;
			}

			// Get posts that are not yet fully processed
			const newPosts = await this.cache.getUnprocessedItems(feed.items, "posts");

			if (newPosts.length === 0) {
				console.log("✅ No new posts to syndicate");
				return;
			}

			console.log(`📝 Found ${newPosts.length} new post(s) to syndicate`);

			// Limit the number of posts processed per run to avoid flooding platforms.
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
			newPosts.sort((a, b) => {
				const aHasFailure = Object.values(
					cacheStatus.posts[a.id]?.platforms || {},
				).some((p) => !p.success);
				const bHasFailure = Object.values(
					cacheStatus.posts[b.id]?.platforms || {},
				).some((p) => !p.success);
				if (aHasFailure && !bHasFailure) return 1;
				if (!aHasFailure && bHasFailure) return -1;
				return 0;
			});

			const postsToProcess = limit > 0 ? newPosts.slice(0, limit) : newPosts;
			if (limit > 0 && newPosts.length > limit) {
				console.log(
					`⏳ Processing ${postsToProcess.length} of ${newPosts.length} post(s) this run (MAX_ITEMS_PER_RUN=${limit}). Remaining will be posted in future runs.`,
				);
			}

			// Process each new post (most recent first)
			for (const post of postsToProcess) {
				console.log(`📝 Processing post: ${post.title}`);
				await this.syndicatePost(post);
			}

			// Update last syndicated time after processing all posts
			await this.cache.updateLastSyndicatedTime("posts");

			console.log("✅ Post syndication completed successfully");
		} catch (error) {
			console.error("❌ Error during post syndication:", error.message);

			// Send error notification to IFTTT if configured
			await this.sendToIFTTT("syndication_error", {
				type: "posts",
				error: error.message,
				timestamp: new Date().toISOString(),
			});

			process.exit(1);
		}
	}

	async syndicatePost(post) {
		const results = [];

		// Prepare content for different platforms
		const socialText =
			post.social_text || ContentProcessor.stripHtml(post.content_html);
		// For LinkedIn posts, prefer the feed summary/excerpt so long-form and
		// highly technical posts don't turn into unwieldy wall-of-text updates.
		const linkedInContent = ContentProcessor.processContentForLinkedIn(
			post.summary || post.content_html,
			true, // isPost = true
			post.url,
		);

		// LinkedIn via IFTTT
		const linkedInPlatform = "linkedin";
		if (
			await this.cache.isPlatformSuccessful("posts", post.id, linkedInPlatform)
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
				await this.sendToIFTTT("linkedin_post", {
					value1: post.title,
					value2: post.url,
					value3: linkedInContent,
				});
				await this.cache.markPlatformSuccess(
					"posts",
					post.id,
					linkedInPlatform,
				);
				results.push({ platform: "LinkedIn (IFTTT)", success: true });
				console.log("✅ LinkedIn IFTTT webhook sent");
			} catch (error) {
				console.log("❌ LinkedIn IFTTT webhook failed:", error.message);
				await this.cache.markPlatformFailure(
					"posts",
					post.id,
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

		// Mastodon
		const mastodonPlatform = "mastodon";
		if (
			await this.cache.isPlatformSuccessful("posts", post.id, mastodonPlatform)
		) {
			console.log("⏭️  Skipping Mastodon - already posted successfully");
			results.push({ platform: "Mastodon", success: true, skipped: true });
		} else {
			try {
				console.log("🐘 Posting to Mastodon...");
				const mastodonText = ContentProcessor.truncateText(
					`${socialText} ${post.url}`,
					450,
				);
				const mastodonResult = await this.postToMastodon(mastodonText);
				await this.cache.markPlatformSuccess(
					"posts",
					post.id,
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
					"posts",
					post.id,
					mastodonPlatform,
					error.message,
				);
				results.push({
					platform: "Mastodon",
					success: false,
					error: error.message,
				});

				// Fallback to IFTTT
				await this.sendToIFTTT("mastodon_post", {
					status: `${socialText} ${post.url}`,
					guid: post.id,
				});
			}
		}

		// Buffer for Twitter and Bluesky
		const twitterPlatform = "twitter";
		const blueskyPlatform = "bluesky";

		const twitterDone = await this.cache.isPlatformSuccessful(
			"posts",
			post.id,
			twitterPlatform,
		);
		const blueskyDone = await this.cache.isPlatformSuccessful(
			"posts",
			post.id,
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
			// Track whether postToBuffer was actually called so the catch block
			// knows whether Buffer may have already queued the posts. If Buffer was
			// called we must NOT also send via IFTTT – that would create duplicates.
			let bufferCalled = false;
			try {
				console.log("🐦 Posting to Buffer (Twitter & Bluesky)...");
				const bufferText = ContentProcessor.truncateText(
					`${socialText} ${post.url}`,
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
					// Set only after postToBuffer returns so that a pre-request throw
					// (e.g. missing BUFFER_ACCESS_TOKEN) leaves bufferCalled false and
					// the catch block can fall back to IFTTT correctly.
					bufferCalled = true;

					// Track success/failure per profile
					for (const result of bufferResults) {
						const platform = profileMap[result.profileId];
						if (platform) {
							if (result.error) {
								await this.cache.markPlatformFailure(
									"posts",
									post.id,
									platform,
									result.error,
								);
							} else {
								await this.cache.markPlatformSuccess(
									"posts",
									post.id,
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
						"posts",
						post.id,
						twitterPlatform,
						error.message,
					);
				}
				if (!blueskyDone) {
					await this.cache.markPlatformFailure(
						"posts",
						post.id,
						blueskyPlatform,
						error.message,
					);
				}
				results.push({
					platform: "Buffer",
					success: false,
					error: error.message,
				});

				// Only fall back to IFTTT when Buffer was never called (i.e. the
				// error occurred before postToBuffer). If Buffer was already called the
				// posts may have been queued successfully; sending via IFTTT as well
				// would create duplicates. Items with failed cache state will be
				// retried via Buffer on the next run.
				// Check each platform independently: only fall back for platforms that
				// had not already been successfully posted before this run.
				if (!bufferCalled) {
					if (!twitterDone) {
						await this.sendToIFTTT("twitter_post", {
							text: `${socialText} ${post.url}`,
						});
					}

					if (!blueskyDone) {
						await this.sendToIFTTT("bluesky_post", {
							text: `${socialText} ${post.url}`,
						});
					}
				}
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
	const syndicator = new PostSyndicator();
	syndicator.run();
}

export default PostSyndicator;
