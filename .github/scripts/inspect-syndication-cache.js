import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

const CACHE_FILE = path.join(".github", "cache", "syndication-status.json");
const DEFAULT_SAMPLE_POST_ID =
	"https://www.aaron-gustafson.com/notebook/never-lose-form-progress-again/";

function countItems(collection = {}) {
	return Object.keys(collection).length;
}

function countFullySuccessfulItems(collection = {}) {
	return Object.values(collection).filter((itemStatus) => {
		const platforms = Object.values(itemStatus?.platforms || {});
		return platforms.length > 0 && platforms.every((platform) => platform.success);
	}).length;
}

async function main() {
	const samplePostId = process.argv[2] || DEFAULT_SAMPLE_POST_ID;

	try {
		const content = await fs.readFile(CACHE_FILE, "utf8");
		const hash = crypto.createHash("sha256").update(content).digest("hex");
		const size = Buffer.byteLength(content, "utf8");
		const cache = JSON.parse(content);

		console.log(`cache_file=${CACHE_FILE}`);
		console.log(`cache_size_bytes=${size}`);
		console.log(`cache_sha256=${hash}`);
		console.log(`posts_total=${countItems(cache.posts)}`);
		console.log(`posts_fully_successful=${countFullySuccessfulItems(cache.posts)}`);
		console.log(`links_total=${countItems(cache.links)}`);
		console.log(`links_fully_successful=${countFullySuccessfulItems(cache.links)}`);

		const samplePost = cache.posts?.[samplePostId];
		if (samplePost) {
			console.log(`sample_post_id=${samplePostId}`);
			console.log(
				`sample_post_platforms=${Object.keys(samplePost.platforms || {}).sort().join(",")}`,
			);
		} else {
			console.log(`sample_post_missing=${samplePostId}`);
		}
	} catch (error) {
		console.log(`cache_file_missing=${CACHE_FILE}`);
		console.log(`cache_error=${error.message}`);
	}
}

main().catch((error) => {
	console.error("Failed to inspect syndication cache:", error.message);
	process.exit(1);
});