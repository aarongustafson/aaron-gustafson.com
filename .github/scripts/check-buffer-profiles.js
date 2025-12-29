import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

async function checkBufferProfiles() {
	const accessToken = process.env.BUFFER_ACCESS_TOKEN;

	if (!accessToken) {
		console.error("❌ BUFFER_ACCESS_TOKEN not found in environment");
		process.exit(1);
	}

	console.log("🔍 Fetching Buffer profiles...\n");

	try {
		const response = await fetch("https://api.bufferapp.com/1/profiles.json", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		const profiles = await response.json();

		if (!profiles || profiles.length === 0) {
			console.log("⚠️  No Buffer profiles found");
			return;
		}

		console.log(`📊 Found ${profiles.length} Buffer profile(s):\n`);

		for (const profile of profiles) {
			console.log(`Profile ID: ${profile.id}`);
			console.log(`Service: ${profile.service}`);
			console.log(
				`Username: ${profile.formatted_username || profile.service_username}`,
			);
			console.log(`Status: ${profile.status || "unknown"}`);
			console.log(`Connected: ${profile.service ? "Yes" : "No"}`);

			// Check if profile is active and can post
			if (profile.disabled) {
				console.log(`⚠️  WARNING: This profile is DISABLED`);
			}
			if (profile.status === "disconnected") {
				console.log(`⚠️  WARNING: This profile is DISCONNECTED`);
			}

			console.log(`URL: https://publish.buffer.com/channels/${profile.id}`);
			console.log("---");
		}

		// Check environment variables
		console.log("\n🔧 Current environment configuration:");
		const twitterId = process.env.BUFFER_TWITTER_PROFILE_ID;
		const blueskyId = process.env.BUFFER_BLUESKY_PROFILE_ID;

		if (twitterId) {
			const twitterProfile = profiles.find((p) => p.id === twitterId);
			console.log(`\nTwitter Profile ID: ${twitterId}`);
			if (twitterProfile) {
				console.log(
					`  ✅ Found: ${twitterProfile.service} - ${twitterProfile.formatted_username || twitterProfile.service_username}`,
				);
				if (
					twitterProfile.disabled ||
					twitterProfile.status === "disconnected"
				) {
					console.log(
						`  ❌ ERROR: Profile is ${twitterProfile.disabled ? "disabled" : "disconnected"}`,
					);
				}
			} else {
				console.log(`  ❌ ERROR: Profile ID not found in your Buffer account`);
			}
		} else {
			console.log("\n⚠️  BUFFER_TWITTER_PROFILE_ID not set");
		}

		if (blueskyId) {
			const blueskyProfile = profiles.find((p) => p.id === blueskyId);
			console.log(`\nBluesky Profile ID: ${blueskyId}`);
			if (blueskyProfile) {
				console.log(
					`  ✅ Found: ${blueskyProfile.service} - ${blueskyProfile.formatted_username || blueskyProfile.service_username}`,
				);
				if (
					blueskyProfile.disabled ||
					blueskyProfile.status === "disconnected"
				) {
					console.log(
						`  ❌ ERROR: Profile is ${blueskyProfile.disabled ? "disabled" : "disconnected"}`,
					);
				}
			} else {
				console.log(`  ❌ ERROR: Profile ID not found in your Buffer account`);
			}
		} else {
			console.log("\n⚠️  BUFFER_BLUESKY_PROFILE_ID not set");
		}
	} catch (error) {
		console.error("❌ Error fetching Buffer profiles:", error.message);
		if (error.response?.data) {
			console.error(
				"API error details:",
				JSON.stringify(error.response.data, null, 2),
			);
		}
		process.exit(1);
	}
}

checkBufferProfiles();
