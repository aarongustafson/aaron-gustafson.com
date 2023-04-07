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
const date = new Date();
const message = `Netlify Build ${date.toUTCString()} [skip netlify]`;
const headers = {
	'X-GitHub-Api-Version': '2022-11-28'
};

exports.handler = async (event, context) => {
	await Promise.all(FILES.map(async (file) => {
		let local_path = `${__dirname}/../../${CACHE_FOLDER}/${file}`;
		let path = `${CACHE_FOLDER}/${file}`;
		let content = Buffer.from(fs.readFileSync(local_path), 'utf-8').toString('base64');
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
				.then((res) => {
					return {
						statusCode: 200,
						body: '{"success":"true"}'
					};
				});
			});
	}));
};