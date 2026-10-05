import test from "node:test";
import assert from "node:assert/strict";

import { SocialMediaAPI } from "./social-media-utils.js";

function withBufferToken(run) {
	const originalToken = process.env.BUFFER_ACCESS_TOKEN;
	process.env.BUFFER_ACCESS_TOKEN = "abc123";

	try {
		return run();
	} finally {
		if (originalToken === undefined) {
			delete process.env.BUFFER_ACCESS_TOKEN;
		} else {
			process.env.BUFFER_ACCESS_TOKEN = originalToken;
		}
	}
}

test("buildBufferGraphQLRequest matches the documented createPost input", () => {
	withBufferToken(() => {
		const api = new SocialMediaAPI(true);
		const request = api.buildBufferGraphQLRequest(
			"Hello from Buffer",
			"channel-456",
		);

		assert.equal(request.method, "POST");
		assert.equal(request.headers.Authorization, "Bearer abc123");
		assert.equal(request.headers["Content-Type"], "application/json");

		const body = JSON.parse(request.body);

		assert.match(body.query, /createPost/);
		assert.match(body.query, /CreatePostInput!/);

		// createPost takes a top-level `text` and no organizationId; the
		// `content: { text }` + organizationId form belongs to the Ideas API.
		assert.doesNotMatch(body.query, /organizationId/);
		assert.doesNotMatch(body.query, /content\s*:\s*\{/);

		// Success and failure members must both be selected so failures stay
		// distinguishable; Buffer's own generated query names concrete error
		// types rather than the MutationError interface.
		assert.match(body.query, /on PostActionSuccess/);
		assert.match(body.query, /on InvalidInputError/);
		assert.match(body.query, /on LimitReachedError/);

		// schedulingType and mode are both required by the schema.
		assert.deepEqual(body.variables, {
			input: {
				channelId: "channel-456",
				text: "Hello from Buffer",
				schedulingType: "automatic",
				mode: "addToQueue",
			},
		});
	});
});

test("extractBufferPost returns the post on PostActionSuccess", () => {
	const api = new SocialMediaAPI(true);
	const post = api.extractBufferPost({
		data: {
			createPost: {
				__typename: "PostActionSuccess",
				post: { id: "post-1", text: "Hello", status: "queued" },
			},
		},
	});

	assert.equal(post.id, "post-1");
	assert.equal(post.status, "queued");
});

test("extractBufferPost throws on a typed InvalidInputError returned with HTTP 200", () => {
	const api = new SocialMediaAPI(true);

	// Buffer answers 200 even when the mutation fails, so this must not be
	// mistaken for a successful post.
	assert.throws(
		() =>
			api.extractBufferPost({
				data: {
					createPost: {
						__typename: "InvalidInputError",
						message: "Text is required",
					},
				},
			}),
		/Text is required/,
	);
});

test("extractBufferPost throws on a top-level system error", () => {
	const api = new SocialMediaAPI(true);

	assert.throws(
		() =>
			api.extractBufferPost({
				data: { createPost: null },
				errors: [
					{ message: "Unauthorized", extensions: { code: "UNAUTHORIZED" } },
				],
			}),
		/Unauthorized/,
	);
});

test("duplicate detection recognises a typed error message", () => {
	const api = new SocialMediaAPI(true);
	let thrown;

	try {
		api.extractBufferPost({
			data: {
				createPost: { message: "You already queued that one recently" },
			},
		});
	} catch (error) {
		thrown = error;
	}

	assert.ok(thrown, "a duplicate response must still be surfaced as an error");
	assert.equal(
		api.isBufferDuplicateError(
			thrown.message,
			thrown.bufferData?.data?.createPost?.message,
		),
		true,
	);
});
