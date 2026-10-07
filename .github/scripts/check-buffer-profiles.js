import fetch from "node-fetch";
import dotenv from "dotenv";

import { BUFFER_API_ENDPOINT } from "./social-media-utils.js";

// Load environment variables from .env file
dotenv.config();

async function makeBufferRequest(accessToken, query, variables = {}) {
	const response = await fetch(BUFFER_API_ENDPOINT, {
		method: "POST",
		headers: {
			Authorization: "Bearer " + accessToken,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ query, variables }),
	});

	const data = await response.json();
	if (!response.ok || data.errors?.length > 0) {
		const messages = data.errors?.map((error) => error.message).join(", ");
		throw new Error(messages || data.message || data.error || `HTTP ${response.status}`);
	}

	return data.data;
}

async function checkBufferProfiles() {
	const accessToken = process.env.BUFFER_ACCESS_TOKEN;

	if (!accessToken) {
		console.error("❌ BUFFER_ACCESS_TOKEN not found in environment");
		process.exit(1);
	}

	console.log("🔍 Fetching Buffer channels...\n");

	try {
		let organizationId = process.env.BUFFER_ORGANIZATION_ID;

		// Only look the organization up when it isn't already configured.
		if (!organizationId) {
			const accountData = await makeBufferRequest(
				accessToken,
				`query GetOrganizations {
					account {
						organizations {
							id
							name
						}
					}
				}`,
			);
			const [primaryOrganization] = accountData?.account?.organizations || [];
			organizationId = primaryOrganization?.id;
		}

		let channels = [];
		if (organizationId) {
			const channelData = await makeBufferRequest(
				accessToken,
				`query GetChannels($organizationId: OrganizationId!) {
					channels(input: { organizationId: $organizationId }) {
						id
						name
						service
					}
				}`,
				{ organizationId },
			);
			channels = channelData?.channels || [];
		}

		if (!channels || channels.length === 0) {
			console.log("⚠️  No Buffer channels found");
			return;
		}

		console.log(`📊 Found ${channels.length} Buffer channel(s):\n`);

		for (const channel of channels) {
			console.log(`Channel ID: ${channel.id}`);
			console.log(`Service: ${channel.service || "unknown"}`);
			console.log(`Name: ${channel.name || "unknown"}`);
			console.log(`---`);
		}

		console.log("\n🔧 Current environment configuration:");
		const twitterId = process.env.BUFFER_TWITTER_PROFILE_ID;
		const blueskyId = process.env.BUFFER_BLUESKY_PROFILE_ID;

		if (twitterId) {
			const twitterChannel = channels.find((channel) => channel.id === twitterId);
			console.log(`\nTwitter Channel ID: ${twitterId}`);
			if (twitterChannel) {
				console.log(
					`  ✅ Found: ${twitterChannel.service} - ${twitterChannel.name || twitterChannel.service}`,
				);
			} else {
				console.log(`  ❌ ERROR: Channel ID not found in your Buffer account`);
			}
		} else {
			console.log("\n⚠️  BUFFER_TWITTER_PROFILE_ID not set");
		}

		if (blueskyId) {
			const blueskyChannel = channels.find((channel) => channel.id === blueskyId);
			console.log(`\nBluesky Channel ID: ${blueskyId}`);
			if (blueskyChannel) {
				console.log(
					`  ✅ Found: ${blueskyChannel.service} - ${blueskyChannel.name || blueskyChannel.service}`,
				);
			} else {
				console.log(`  ❌ ERROR: Channel ID not found in your Buffer account`);
			}
		} else {
			console.log("\n⚠️  BUFFER_BLUESKY_PROFILE_ID not set");
		}
	} catch (error) {
		console.error("❌ Error fetching Buffer channels:", error.message);
		process.exit(1);
	}
}

checkBufferProfiles();
