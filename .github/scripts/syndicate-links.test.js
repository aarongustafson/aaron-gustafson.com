import test from "node:test";
import assert from "node:assert/strict";

import LinkSyndicator from "./syndicate-links.js";
import { ContentProcessor } from "./social-media-utils.js";

test("truncateTextPreservingUrl keeps the external URL in shortened link posts", () => {
	const socialText =
		"A useful look at GitHub’s accessibility agent experiment and what it takes to make these systems genuinely helpful rather than merely busy.";
	const relatedUrl =
		"https://github.blog/ai-and-ml/github-copilot/building-a-general-purpose-accessibility-agent-and-what-we-learned-in-the-process/";

	const result = ContentProcessor.truncateTextPreservingUrl(
		socialText,
		relatedUrl,
		260,
	);

	assert.ok(result.endsWith(relatedUrl));
	assert.ok(result.length <= 260);
	assert.notEqual(result, `${socialText} ${relatedUrl}`);
});

test("link syndication sends LinkedIn the external URL instead of the local permalink", async () => {
	const env = {
		TEST_MODE: process.env.TEST_MODE,
		BUFFER_TWITTER_PROFILE_ID: process.env.BUFFER_TWITTER_PROFILE_ID,
		BUFFER_BLUESKY_PROFILE_ID: process.env.BUFFER_BLUESKY_PROFILE_ID,
	};

	process.env.TEST_MODE = "true";
	process.env.BUFFER_TWITTER_PROFILE_ID = "twitter-profile";
	process.env.BUFFER_BLUESKY_PROFILE_ID = "bluesky-profile";

	try {
		const syndicator = new LinkSyndicator();
		const iftttCalls = [];

		syndicator.cache = {
			isPlatformSuccessful: async () => false,
			markPlatformSuccess: async () => {},
			markPlatformFailure: async () => {},
		};
		syndicator.sendToIFTTT = async (event, payload) => {
			iftttCalls.push({ event, payload });
			return { event, payload };
		};
		syndicator.postToMastodon = async () => ({ id: "mastodon-post" });
		syndicator.postToBuffer = async () => [];

		const link = {
			id: "link-1",
			title: "GitHub accessibility agent",
			social_text:
				"A useful look at GitHub’s accessibility agent experiment and what it takes to make these systems genuinely helpful rather than merely busy.",
			content_html: "<p>Interesting link.</p>",
			url: "https://www.aaron-gustafson.com/notebook/links/github-accessibility-agent/",
			external_url:
				"https://github.blog/ai-and-ml/github-copilot/building-a-general-purpose-accessibility-agent-and-what-we-learned-in-the-process/",
		};

		await syndicator.syndicateLink(link);

		const linkedInCall = iftttCalls.find(({ event }) => event === "linkedin_link");
		assert.ok(linkedInCall);
		assert.equal(linkedInCall.payload.value2, link.external_url);
	} finally {
		process.env.TEST_MODE = env.TEST_MODE;
		process.env.BUFFER_TWITTER_PROFILE_ID = env.BUFFER_TWITTER_PROFILE_ID;
		process.env.BUFFER_BLUESKY_PROFILE_ID = env.BUFFER_BLUESKY_PROFILE_ID;
	}
});
