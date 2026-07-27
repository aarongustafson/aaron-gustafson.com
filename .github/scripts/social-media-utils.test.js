import test from "node:test";
import assert from "node:assert/strict";

import { SocialMediaAPI } from "./social-media-utils.js";

test("buildBufferGraphQLRequest uses the Buffer GraphQL API payload", () => {
	const originalToken = process.env.BUFFER_ACCESS_TOKEN;
	const originalOrganizationId = process.env.BUFFER_ORGANIZATION_ID;

	process.env.BUFFER_ACCESS_TOKEN = "abc123";
	process.env.BUFFER_ORGANIZATION_ID = "org-123";

	try {
		const api = new SocialMediaAPI(true);
		const request = api.buildBufferGraphQLRequest(
			"Hello from Buffer",
			"org-123",
			"channel-456",
		);

		assert.equal(request.method, "POST");
		assert.equal(request.headers.Authorization, "Bearer " + process.env.BUFFER_ACCESS_TOKEN);
		assert.equal(request.headers["Content-Type"], "application/json");

		const body = JSON.parse(request.body);
		assert.match(body.query, /createPost/);
		assert.equal(body.variables.organizationId, "org-123");
		assert.equal(body.variables.channelId, "channel-456");
		assert.equal(body.variables.text, "Hello from Buffer");
	} finally {
		if (originalToken === undefined) {
			delete process.env.BUFFER_ACCESS_TOKEN;
		} else {
			process.env.BUFFER_ACCESS_TOKEN = originalToken;
		}

		if (originalOrganizationId === undefined) {
			delete process.env.BUFFER_ORGANIZATION_ID;
		} else {
			process.env.BUFFER_ORGANIZATION_ID = originalOrganizationId;
		}
	}
});
