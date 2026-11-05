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
    const mastodonCalls = [];
    const bufferCalls = [];

    syndicator.cache = {
      isPlatformSuccessful: async () => false,
      markPlatformSuccess: async () => { },
      markPlatformFailure: async () => { },
    };
    syndicator.sendToIFTTT = async (event, payload) => {
      iftttCalls.push({ event, payload });
      return { event, payload };
    };
    syndicator.postToMastodon = async (text) => {
      mastodonCalls.push(text);
      return { id: "mastodon-post" };
    };
    syndicator.postToBuffer = async (...args) => {
      bufferCalls.push(args);
      return [];
    };

    const post = {
      id: "post-1",
      title: "Long post",
      excerpt: "This is the excerpt.",
      summary: "This is the summary.",
      content_html: "<p>This is the full body and should not be used.</p>",
      social_text: "A lengthy introduction. ".repeat(35),
      url: "https://www.aaron-gustafson.com/notebook/posts/long-post/",
    };

    await syndicator.syndicatePost(post);

    const linkedInCall = iftttCalls.find(({ event }) => event === "linkedin_post");
    assert.ok(linkedInCall);
    assert.equal(linkedInCall.payload.value3, "This is the excerpt.");
    assert.notEqual(linkedInCall.payload.value3, post.content_html);
    assert.ok(mastodonCalls[0].endsWith(post.url));
    assert.ok(mastodonCalls[0].length <= 450);
    assert.equal(bufferCalls.length, 0);
  } finally {
    process.env.TEST_MODE = env.TEST_MODE;
    process.env.BUFFER_TWITTER_PROFILE_ID = env.BUFFER_TWITTER_PROFILE_ID;
    process.env.BUFFER_BLUESKY_PROFILE_ID = env.BUFFER_BLUESKY_PROFILE_ID;
  }
});

test("post syndication preserves its URL and passes the page's social overrides to Buffer", async () => {
  const keys = ["TEST_MODE", "BUFFER_TWITTER_PROFILE_ID", "BUFFER_BLUESKY_PROFILE_ID"];
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  process.env.TEST_MODE = "true";
  process.env.BUFFER_TWITTER_PROFILE_ID = "twitter-profile";
  process.env.BUFFER_BLUESKY_PROFILE_ID = "bluesky-profile";
  try {
    const syndicator = new PostSyndicator();
    const calls = [];
    syndicator.cache = {
      isPlatformSuccessful: async (_type, _id, platform) => ["linkedin", "mastodon"].includes(platform),
      markPlatformSuccess: async () => {},
      markPlatformFailure: async () => {},
    };
    syndicator.postToBuffer = async (...args) => { calls.push(args); return []; };
    const post = {
      id: "post-id",
      title: "Article",
      date_published: "2026-11-05T00:00:00Z",
      url: "https://example.com/notebook/article/",
      social_text: "A lengthy introduction. ".repeat(35),
      _social: { title: "Social title", description: "Social description", image: "https://example.com/custom.jpg" },
    };
    await syndicator.syndicatePost(post);
    assert.ok(calls[0][0].endsWith(post.url));
    assert.ok(calls[0][0].length <= 260);
    assert.deepEqual(calls[0][2], { id: post.id, publishedAt: post.date_published, url: post.url, ...post._social });
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
