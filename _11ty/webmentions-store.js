let webmentions = null;

export function setWebmentionsData(data) {
	webmentions = data;
}

export function getWebmentionsForUrls(url, oldUrl) {
	if (!webmentions) {
		return null;
	}

	const currentMentionIds = webmentions.urlIndex[url] || [];
	const oldMentionIds =
		oldUrl !== "false" ? webmentions.urlIndex[oldUrl] || [] : [];
	const mentionIds = [...new Set([...currentMentionIds, ...oldMentionIds])];

	return mentionIds
		.map((id) => webmentions.compactData[id])
		.filter(Boolean)
		.sort((a, b) => a["wm-id"] - b["wm-id"]);
}
