const INTERVAL_MINUTES = 60 * 60 * 1000;
import JSONFeedStream from "./JSONFeedStream.js";

export default async function latestLinks() {
	const body = JSONFeedStream(
		"https://www.aaron-gustafson.com/feeds/latest-links.json",
		INTERVAL_MINUTES,
	);
	return new Response(body, {
		headers: {
			"Content-Type": "text/event-stream",
		},
	});
}
