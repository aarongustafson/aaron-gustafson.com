import axios from "axios";
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
			const response = await axios.get(cacheBustedUrl, {
				headers: {
					"Cache-Control": "no-cache",
					Pragma: "no-cache",
					Accept: "application/json",
				},
				responseType: "json",
			});

			console.log("Feed URL:", cacheBustedUrl);
			console.log("Response status:", response.status);
			console.log("Response content-type:", response.headers["content-type"]);

			const feed = response.data;

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
				console.log("Raw feed data (first 1000 chars):", JSON.stringify(feed).substring(0, 1000));
				return;
			}

			// Get links newer than last syndication time
			const newLinks = await this.cache.getItemsNewerThan(feed.items, "links");

			if (newLinks.length === 0) {
				console.log("✅ No new links to syndicate");
				return;
			}

			console.log(`🔗 Found ${newLinks.length} new link(s) to syndicate`);

			// Process each new link (most recent first)
			for (const link of newLinks) {
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
		const linkedInContent = ContentProcessor.processContentForLinkedIn(
			link.content_html,
		);
		const relatedUrl = link.external_url || link.url;

		// Generate screenshot URL
		const screenshotUrl = ContentProcessor.createScreenshotUrl(relatedUrl);

		// LinkedIn via IFTTT
		try {
			console.log("📊 Posting to LinkedIn via IFTTT...");
			await this.sendToIFTTT("linkedin_link", {
				value1: link.title,
				value2: relatedUrl,
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

		// Pinterest via IFTTT
		try {
			console.log("📌 Posting to Pinterest via IFTTT...");
			await this.sendToIFTTT("pinterest_pin", {
				value1: link.title,
				value2: relatedUrl,
				value3: ContentProcessor.stripHtml(link.content_html || link.title),
			});
			results.push({ platform: "Pinterest (IFTTT)", success: true });
			console.log("✅ Pinterest IFTTT webhook sent");
		} catch (error) {
			console.log("❌ Pinterest IFTTT webhook failed:", error.message);
			results.push({
				platform: "Pinterest (IFTTT)",
				success: false,
				error: error.message,
			});
		}

		// Mastodon
		try {
			console.log("🐘 Posting to Mastodon...");
			const mastodonText = ContentProcessor.truncateText(
				`${socialText} ${relatedUrl}`,
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
			await this.sendToIFTTT("mastodon_link", {
				status: `${socialText} ${relatedUrl}`,
				guid: link.id,
			});
		}

		// Buffer for Twitter and Bluesky
		try {
			console.log("🐦 Posting to Buffer (Twitter & Bluesky)...");
			const bufferText = ContentProcessor.truncateText(
				`${socialText} ${relatedUrl}`,
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
			await this.sendToIFTTT("twitter_link", {
				text: `${socialText} ${relatedUrl}`,
			});

			await this.sendToIFTTT("bluesky_link", {
				text: `${socialText} ${relatedUrl}`,
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
	const syndicator = new LinkSyndicator();
	syndicator.run();
}

export default LinkSyndicator;
