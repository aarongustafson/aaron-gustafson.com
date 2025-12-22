// Inspiration: https://www.stackbit.com/blog/jamstack-api-zapier-webhooks-2

const fs = require("fs");
const path = require("path");
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
	auth: process.env.GITHUB_ACCESS_TOKEN,
	request: {
		headers: {
			"X-GitHub-Api-Version": "2022-11-28",
		},
	},
});
const CACHE_FOLDER = "_cache";
const FILES = ["404s.yml", "og_images.yml", "tags.json", "webmentions.json"];

// GitHub Config
const owner = "aarongustafson";
const repo = "aaron-gustafson.com";
const message = `Updated as part of Netlify build [skip netlify]`;

const readLocalFile = (file) => {
	const localPath = path.join(__dirname, "..", "..", CACHE_FOLDER, file);
	const localContent = fs.readFileSync(localPath, "utf-8");
	const encodedContent = Buffer.from(localContent, "utf-8").toString("base64");
	return {
		localContent,
		encodedContent,
		repoPath: `${CACHE_FOLDER}/${file}`,
	};
};

const fetchRemoteFile = async (repoPath) => {
	try {
		const response = await octokit.rest.repos.getContent({
			owner,
			repo,
			path: repoPath,
		});
		if (Array.isArray(response.data) || response.data.type !== "file") {
			throw new Error(`Unexpected GitHub content payload for ${repoPath}`);
		}
		return response.data;
	} catch (error) {
		if (error.status === 404) {
			return null;
		}
		throw error;
	}
};

const upsertRemoteFile = async ({ repoPath, encodedContent, sha }) => {
	await octokit.rest.repos.createOrUpdateFileContents({
		owner,
		repo,
		path: repoPath,
		message,
		content: encodedContent,
		sha,
	});
};

exports.handler = async () => {
	try {
		await Promise.all(
			FILES.map(async (file) => {
				const { localContent, encodedContent, repoPath } = readLocalFile(file);
				const remoteFile = await fetchRemoteFile(repoPath);

				if (remoteFile) {
					const remoteContent = Buffer.from(
						remoteFile.content,
						"base64",
					).toString("utf-8");
					if (remoteContent === localContent) {
						return;
					}
				}

				await upsertRemoteFile({
					repoPath,
					encodedContent,
					sha: remoteFile?.sha,
				});
			}),
		);

		return {
			statusCode: 200,
			body: '{"success":"true"}',
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: error.status || 500,
			body: JSON.stringify({
				success: false,
				message: error.message,
			}),
		};
	}
};
