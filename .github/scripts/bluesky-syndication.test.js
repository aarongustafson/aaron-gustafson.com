import test from "node:test";
import assert from "node:assert/strict";
import { SocialMediaAPI } from "./social-media-utils.js";

async function withEnvironment(values, run) {
	const previous = Object.fromEntries(
		Object.keys(values).map((key) => [key, process.env[key]]),
	);
	Object.assign(process.env, values);
	try {
		return await run();
	} finally {
		for (const [key, value] of Object.entries(previous)) {
			if (value === undefined) delete process.env[key];
			else process.env[key] = value;
		}
	}
}

test("direct Bluesky publishes a native card once, then reuses the same record on retry", async (t) => {
	await withEnvironment(
		{
			TEST_MODE: "false",
			ATP_IDENTIFIER: "example.com",
			ATP_APP_PASSWORD: "test-password",
			PDS_URL: "https://pds.example",
		},
		async () => {
			let stored;
			let writes = 0;
			const sharedUrl = "https://example.com/article/";
			t.mock.method(globalThis, "fetch", async (input, options) => {
				const url = new URL(input);
				if (
					url.pathname.endsWith("/createSession") ||
					url.pathname.endsWith(".createSession")
				) {
					return Response.json({
						did: "did:plc:example",
						accessJwt: "test-token",
					});
				}
				if (url.pathname.endsWith(".getRecord")) {
					return stored
						? Response.json(stored)
						: Response.json({ error: "RecordNotFound" }, { status: 400 });
				}
				if (url.href === sharedUrl) {
					return new Response(
						'<meta property="og:title" content="Article"><meta property="og:description" content="OG summary">',
					);
				}
				if (url.pathname.endsWith(".putRecord")) {
					writes++;
					const body = JSON.parse(options.body);
					assert.equal(body.swapRecord, null);
					assert.equal(body.record.embed.external.title, "Article");
					assert.equal(body.record.embed.external.description, "OG summary");
					assert.equal(body.record.embed.external.uri, sharedUrl);
					assert.equal(body.record.createdAt.length > 0, true);
					stored = {
						uri: `at://${body.repo}/${body.collection}/${body.rkey}`,
						cid: "post-cid",
						value: body.record,
					};
					return Response.json({ uri: stored.uri, cid: stored.cid });
				}
				throw new Error(`Unexpected request: ${url}`);
			});
			const api = new SocialMediaAPI();
			const text = `A useful article ${sharedUrl}`;
			const link = {
				id: "https://mysite.example/links/article/",
				publishedAt: "2026-11-05T00:00:00Z",
				url: sharedUrl,
			};
			const first = await api.postToBluesky(text, link);
			const retry = await api.postToBluesky(text, link);
			assert.equal(first.uri, retry.uri);
			assert.equal(writes, 1);
		},
	);
});

test("direct routing works without a Buffer token and never calls Buffer", async () => {
	await withEnvironment(
		{
			TEST_MODE: "false",
			BLUESKY_POSTING_MODE: "direct",
			BUFFER_BLUESKY_PROFILE_ID: "bluesky-profile",
			BUFFER_ACCESS_TOKEN: "",
		},
		async () => {
			const api = new SocialMediaAPI();
			let calls = 0;
			api.postToBluesky = async (_text, link) => {
				calls++;
				assert.equal(link.url, "https://example.com/article/");
				return {
					uri: "at://did:plc:example/app.bsky.feed.post/post",
					cid: "post-cid",
				};
			};
			const results = await api.postToBuffer("Text", ["bluesky-profile"], {
				id: "source-id",
				url: "https://example.com/article/",
			});
			assert.equal(calls, 1);
			assert.equal(results[0].profileId, "bluesky-profile");
			assert.equal(results[0].error, undefined);
		},
	);
});

test("direct failures are reported per platform, never treated as Buffer duplicate success", async () => {
	await withEnvironment(
		{
			TEST_MODE: "false",
			BLUESKY_POSTING_MODE: "direct",
			BUFFER_BLUESKY_PROFILE_ID: "bluesky-profile",
		},
		async () => {
			const api = new SocialMediaAPI();
			api.postToBluesky = async () => {
				throw new Error("duplicate post could not be verified");
			};
			const results = await api.postToBuffer("Text", ["bluesky-profile"], {
				id: "source-id",
				url: "https://example.com/article/",
			});
			assert.match(results[0].error, /could not be verified/);
			assert.equal(results[0].duplicateDetected, undefined);
		},
	);
});

test("test mode makes no direct Bluesky network calls", async (t) => {
	t.mock.method(globalThis, "fetch", () => {
		throw new Error("Unexpected network request");
	});
	const api = new SocialMediaAPI(true);
	const result = await api.postToBluesky("Text https://example.com/", {
		id: "source-id",
		url: "https://example.com/",
	});
	assert.equal(result.testMode, true);
});
