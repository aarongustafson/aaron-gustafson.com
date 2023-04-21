// Inspiration: https://www.stackbit.com/blog/jamstack-api-zapier-webhooks-2

const fs = require('fs');
const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN
});
const CACHE_FOLDER = "_cache";
const FILES = ["404s.yml","og_images.yml","tags.json","webmentions.json"];

// GitHub Config
const owner = "aarongustafson";
const	repo = "aaron-gustafson.com";
const message = `Updated as part of Netlify build [skip netlify]`;
const headers = {
	'X-GitHub-Api-Version': '2022-11-28'
};

exports.handler = async (event, context) => {
	await Promise.all(FILES.map(async (file) => {
		let local_path = `${__dirname}/../../${CACHE_FOLDER}/${file}`;
		let path = `${CACHE_FOLDER}/${file}`;
		let local_content = fs.readFileSync(local_path);
		let content = Buffer.from(local_content, 'utf-8').toString('base64');
		return octokit.request(
				'GET /repos/{owner}/{repo}/contents/{path}',
				{
					owner,
					repo,
					path,
					headers
				}
			)
			.then(res => {
				let sha = res.data.sha;
				const github_content = Buffer.from(res.data.content, 'base64').toString('utf-8');
				// Don’t push if it’s the same
				if ( local_content == github_content )
				{
					return {
						statusCode: 200,
						body: '{"success":"true"}'
					};
				}
				// else
				return octokit.request(
					'PUT /repos/{owner}/{repo}/contents/{path}',
					{
						owner,
						repo,
						path,
						message,
						content,
						sha
					}
				)
				.then(() => {
					return {
						statusCode: 200,
						body: '{"success":"true"}'
					};
				});
			});
	}));
};