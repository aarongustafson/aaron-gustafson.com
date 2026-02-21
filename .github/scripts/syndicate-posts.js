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

			// Get posts newer than last syndication time
			const newPosts = await this.cache.getItemsNewerThan(feed.items, "posts");

			if (newPosts.length === 0) {
				console.log("✅ No new posts to syndicate");
				return;
			}

			console.log(`📝 Found ${newPosts.length} new post(s) to syndicate`);

			// Process each new post (most recent first)
			for (const post of newPosts) {
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
		// For LinkedIn posts, pass full content and let processContentForLinkedIn
		// handle truncation within LinkedIn's 3000-char limit
		const linkedInContent = ContentProcessor.processContentForLinkedIn(
			post.content_html,
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

				// Fallback to IFTTT for both platforms
				await this.sendToIFTTT("twitter_post", {
					text: `${socialText} ${post.url}`,
				});

				await this.sendToIFTTT("bluesky_post", {
					text: `${socialText} ${post.url}`,
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
	const syndicator = new PostSyndicator();
	syndicator.run();
}

export default PostSyndicator;
