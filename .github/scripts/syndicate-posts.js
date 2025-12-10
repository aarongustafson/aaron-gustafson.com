import axios from "axios";
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
			const response = await axios.get(cacheBustedUrl, {
				headers: {
					"Cache-Control": "no-cache",
					Pragma: "no-cache",
				},
			});
			const feed = response.data;

			if (!feed.items || feed.items.length === 0) {
				console.log("📭 No posts found in feed");
				console.log("Feed URL:", cacheBustedUrl);
				console.log("Response status:", response.status);
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
		const linkedInContent = ContentProcessor.processContentForLinkedIn(
			post.content_html,
		);

		// LinkedIn via IFTTT
		try {
			console.log("📊 Posting to LinkedIn via IFTTT...");
			await this.sendToIFTTT("linkedin_post", {
				value1: post.title,
				value2: post.url,
				value3: ContentProcessor.truncateText(linkedInContent, 200),
			});
			results.push({ platform: "LinkedIn (IFTTT)", success: true });
			console.log("✅ LinkedIn IFTTT webhook sent");
		} catch (error) {
			console.log("❌ LinkedIn IFTTT webhook failed:", error.message);
			results.push({
				platform: "LinkedIn (IFTTT)",
				success: false,
				error: error.message,
			});
		}

		// Mastodon
		try {
			console.log("🐘 Posting to Mastodon...");
			const mastodonText = ContentProcessor.truncateText(
				`${socialText} ${post.url}`,
				450,
			);
			const mastodonResult = await this.postToMastodon(mastodonText);
			results.push({
				platform: "Mastodon",
				success: true,
				data: mastodonResult,
			});
			console.log("✅ Mastodon post successful");
		} catch (error) {
			console.log("❌ Mastodon post failed:", error.message);
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

		// Buffer for Twitter and Bluesky
		try {
			console.log("🐦 Posting to Buffer (Twitter & Bluesky)...");
			const bufferText = ContentProcessor.truncateText(
				`${socialText} ${post.url}`,
				260,
			);

			const profileIds = [
				process.env.BUFFER_TWITTER_PROFILE_ID,
				process.env.BUFFER_BLUESKY_PROFILE_ID,
			].filter(Boolean);

			if (profileIds.length > 0) {
				const bufferResults = await this.postToBuffer(bufferText, profileIds);
				results.push({
					platform: "Buffer (Twitter/Bluesky)",
					success: true,
					data: bufferResults,
				});
				console.log("✅ Buffer posts successful");
			} else {
				console.log("⚠️ No Buffer profile IDs configured");
			}
		} catch (error) {
			console.log("❌ Buffer posts failed:", error.message);
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

		// Log results summary
		console.log("\n📊 Syndication Results:");
		results.forEach((result) => {
			const status = result.success ? "✅" : "❌";
			console.log(`${status} ${result.platform}`);
			if (!result.success) {
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
