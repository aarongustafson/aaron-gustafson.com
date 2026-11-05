import test from "node:test";
import assert from "node:assert/strict";
import {
	AtprotoClient,
	blueskyLinkFacet,
	blueskyPostKey,
	buildBlueskyEmbed,
	parseAtUri,
	parseLinkMetadata,
} from "./atproto.js";

const publicationUri = "at://did:plc:example/site.standard.publication/blog";
const documentUri = "at://did:plc:example/site.standard.document/article";
const url = "https://example.com/notebook/article/";

test("link metadata reads Open Graph, entities, relative images, and standard.site references", () => {
	const metadata = parseLinkMetadata(
		`
		<meta content="A &amp; B" property="og:title">
		<meta name="twitter:title" content="Fallback">
		<meta property="og:description" content="A &quot;quoted&quot; description.">
		<meta property="og:image" content="/i/card.jpg">
		<link rel="site.standard.document" href="${documentUri}">
		<link rel="site.standard.publication" href="${publicationUri}">
	`,
		url,
	);
	assert.deepEqual(metadata, {
		url,
		title: "A & B",
		description: 'A "quoted" description.',
		image: "https://example.com/i/card.jpg",
		documentUri,
		publicationUri,
	});
});

test("ordinary links can use Twitter metadata without pretending to be standard.site documents", () => {
	const metadata = parseLinkMetadata(
		'<meta name="twitter:title" content="External"><meta name="description" content="Summary">',
		url,
	);
	assert.equal(metadata.title, "External");
	assert.equal(metadata.description, "Summary");
	assert.equal(metadata.documentUri, undefined);
});

test("enhanced Bluesky embeds include current document/publication CIDs and an uploaded image", async () => {
	const records = {
		[documentUri]: {
			uri: documentUri,
			cid: "document-cid",
			value: { site: publicationUri, path: "/notebook/article/" },
		},
		[publicationUri]: {
			uri: publicationUri,
			cid: "publication-cid",
			value: { url: "https://example.com" },
		},
	};
	const blob = {
		$type: "blob",
		ref: { $link: "image-cid" },
		mimeType: "image/jpeg",
		size: 123,
	};
	const embed = await buildBlueskyEmbed(
		{
			getRecord: async (uri) => records[uri],
			uploadImage: async () => blob,
		},
		{
			url,
			title: "Article",
			description: "Summary",
			documentUri,
			image: "https://example.com/card.jpg",
		},
	);
	assert.equal(embed.$type, "app.bsky.embed.external");
	assert.deepEqual(embed.external.associatedRefs, [
		{ uri: documentUri, cid: "document-cid" },
		{ uri: publicationUri, cid: "publication-cid" },
	]);
	assert.equal(embed.external.thumb, blob);
});

test("incorrect standard.site document paths fail explicitly", async () => {
	await assert.rejects(
		() =>
			buildBlueskyEmbed(
				{
					getRecord: async (uri) =>
						uri === documentUri
							? {
									value: {
										site: publicationUri,
										path: "/notebook//2026-01-01-article",
									},
								}
							: { value: { url: "https://example.com" } },
				},
				{ url, documentUri },
			),
		/document URL does not match/,
	);
});

test("ordinary external cards do not invent standard.site references", async () => {
	const embed = await buildBlueskyEmbed(
		{},
		{ url, title: "Article", description: "Summary" },
	);
	assert.equal(embed.external.associatedRefs, undefined);
});

test("standalone standard.site documents use their HTTPS site without requiring a publication", async () => {
	const embed = await buildBlueskyEmbed(
		{
			getRecord: async () => ({
				uri: documentUri,
				cid: "doc-cid",
				value: { site: "https://example.com", path: "/notebook/article/" },
			}),
		},
		{ url, title: "Article", description: "Summary", documentUri },
	);
	assert.deepEqual(embed.external.associatedRefs, [
		{ uri: documentUri, cid: "doc-cid" },
	]);
});

test("documents in a publication subdirectory retain that subdirectory", async () => {
	const embed = await buildBlueskyEmbed(
		{
			getRecord: async (uri) =>
				uri === documentUri
					? {
							uri: documentUri,
							cid: "doc-cid",
							value: { site: publicationUri, path: "/article/" },
						}
					: {
							uri: publicationUri,
							cid: "pub-cid",
							value: { url: "https://example.com/blog" },
						},
		},
		{
			url: "https://example.com/blog/article/",
			title: "Article",
			description: "Summary",
			documentUri,
		},
	);
	assert.equal(embed.external.associatedRefs.length, 2);
});

test("a publisher reuses its own standard.site cover blob without fetching a missing OG image", async () => {
	const blob = {
		$type: "blob",
		ref: { $link: "cover-cid" },
		size: 123,
		mimeType: "image/jpeg",
	};
	const embed = await buildBlueskyEmbed(
		{
			did: "did:plc:example",
			getRecord: async (uri) =>
				uri === documentUri
					? {
							uri: documentUri,
							cid: "doc-cid",
							value: {
								site: publicationUri,
								path: "/notebook/article/",
								coverImage: blob,
							},
						}
					: {
							uri: publicationUri,
							cid: "pub-cid",
							value: { url: "https://example.com" },
						},
			uploadImage: async () => {
				throw new Error("Unnecessary image upload");
			},
		},
		{
			url,
			title: "Article",
			description: "Summary",
			documentUri,
			image: "https://example.com/missing.jpg",
		},
	);
	assert.equal(embed.external.thumb, blob);
});

test("syndication keys are stable valid TIDs anchored to the source publication date", () => {
	const date = "2026-11-05T00:00:00Z";
	const key = blueskyPostKey("source-id", date);
	assert.match(
		key,
		/^[234567abcdefghij][234567abcdefghijklmnopqrstuvwxyz]{12}$/,
	);
	assert.equal(key, blueskyPostKey("source-id", date));
	assert.notEqual(key, blueskyPostKey("another-source-id", date));
	const alphabet = "234567abcdefghijklmnopqrstuvwxyz";
	const value = [...key].reduce(
		(result, character) => (result << 5n) | BigInt(alphabet.indexOf(character)),
		0n,
	);
	assert.equal(Number((value >> 10n) / 1000n), Date.parse(date));
	assert.throws(
		() => blueskyPostKey("source-id", undefined),
		/publication date/,
	);
});

test("Bluesky facets use UTF-8 bytes, not JavaScript string indices", () => {
	const text = `A \u{1f642} link: ${url}`;
	const facet = blueskyLinkFacet(text, url);
	assert.equal(facet.index.byteStart, Buffer.byteLength("A \u{1f642} link: "));
	assert.equal(facet.index.byteEnd, Buffer.byteLength(text));
	assert.equal(
		Buffer.from(text)
			.subarray(facet.index.byteStart, facet.index.byteEnd)
			.toString(),
		url,
	);
	assert.throws(
		() => blueskyLinkFacet("Truncated URL", url),
		/complete shared URL/,
	);
});

test("public record discovery never forwards the publishing access token", async () => {
	const calls = [];
	const client = new AtprotoClient({
		fetchImpl: async (input, options) => {
			calls.push({ url: String(input), options });
			return Response.json(
				calls.length === 1
					? {
							service: [
								{
									id: "#atproto_pds",
									serviceEndpoint: "https://other.example",
								},
							],
						}
					: { uri: documentUri, cid: "record-cid", value: {} },
			);
		},
	});
	client.accessJwt = "private-token";
	await client.getRecord(documentUri);
	assert.equal(calls[1].options.headers.Authorization, undefined);
	assert.match(calls[1].url, /^https:\/\/other\.example\/xrpc\//);
});

test("AT Protocol failures retain an error code for safe retry handling", async () => {
	const client = new AtprotoClient({
		fetchImpl: async () =>
			Response.json(
				{ error: "RecordNotFound", message: "Missing" },
				{ status: 400 },
			),
	});
	await assert.rejects(() => client.request("com.atproto.repo.getRecord"), {
		code: "RecordNotFound",
	});
});

test("AT URI parsing rejects incomplete references", () => {
	assert.deepEqual(parseAtUri(documentUri), {
		repo: "did:plc:example",
		collection: "site.standard.document",
		rkey: "article",
	});
	assert.throws(() => parseAtUri("https://example.com"), /Invalid AT URI/);
});

test("oversized card images are resized below Bluesky's exact 1 MB limit", async () => {
	const { default: sharp } = await import("sharp");
	const { randomBytes } = await import("node:crypto");
	const source = await sharp(randomBytes(1800 * 1200 * 3), {
		raw: { width: 1800, height: 1200, channels: 3 },
	})
		.png()
		.toBuffer();
	assert.ok(source.length > 1000000);
	let uploaded = false;
	const client = new AtprotoClient({
		fetchImpl: async (url, options) => {
			if (String(url) === "https://example.com/large.png") {
				return new Response(source, {
					headers: { "content-type": "image/png" },
				});
			}
			assert.ok(options.body.length <= 1000000);
			assert.equal(options.headers["Content-Type"], "image/jpeg");
			const metadata = await sharp(options.body).metadata();
			assert.ok(metadata.width <= 1200);
			assert.ok(metadata.height <= 1200);
			uploaded = true;
			return Response.json({
				blob: {
					$type: "blob",
					ref: { $link: "image-cid" },
					size: options.body.length,
					mimeType: "image/jpeg",
				},
			});
		},
	});
	client.accessJwt = "test-token";
	const blob = await client.uploadImage("https://example.com/large.png");
	assert.equal(uploaded, true);
	assert.ok(blob.size <= 1000000);
});
