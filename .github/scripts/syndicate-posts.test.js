import test from "node:test";
import assert from "node:assert/strict";

import PostSyndicator from "./syndicate-posts.js";

test("post syndication sends the excerpt to LinkedIn when available", async () => {
  const env = {
    TEST_MODE: process.env.TEST_MODE,
    BUFFER_TWITTER_PROFILE_ID: process.env.BUFFER_TWITTER_PROFILE_ID,
    BUFFER_BLUESKY_PROFILE_ID: process.env.BUFFER_BLUESKY_PROFILE_ID,
  };

  process.env.TEST_MODE = "true";
  delete process.env.BUFFER_TWITTER_PROFILE_ID;
  delete process.env.BUFFER_BLUESKY_PROFILE_ID;

  try {
    const syndicator = new PostSyndicator();
    const iftttCalls = [];

    syndicator.cache = {
      isPlatformSuccessful: async () => false,
      markPlatformSuccess: async () => { },
      markPlatformFailure: async () => { },
    };
    syndicator.sendToIFTTT = async (event, payload) => {
      iftttCalls.push({ event, payload });
      return { event, payload };
    };
    syndicator.postToMastodon = async () => ({ id: "mastodon-post" });
    syndicator.postToBuffer = async () => [];

    const post = {
      id: "post-1",
      title: "Long post",
      excerpt: "This is the excerpt.",
      summary: "This is the summary.",
      content_html: "<p>This is the full body and should not be used.</p>",
      url: "https://www.aaron-gustafson.com/notebook/posts/long-post/",
    };

    await syndicator.syndicatePost(post);

    const linkedInCall = iftttCalls.find(({ event }) => event === "linkedin_post");
    assert.ok(linkedInCall);
    assert.equal(linkedInCall.payload.value3, "This is the excerpt.");
    assert.notEqual(linkedInCall.payload.value3, post.content_html);
  } finally {
    process.env.TEST_MODE = env.TEST_MODE;
    process.env.BUFFER_TWITTER_PROFILE_ID = env.BUFFER_TWITTER_PROFILE_ID;
    process.env.BUFFER_BLUESKY_PROFILE_ID = env.BUFFER_BLUESKY_PROFILE_ID;
  }
});
