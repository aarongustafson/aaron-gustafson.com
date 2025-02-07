import SiteChecker from "broken-link-checker";
import fs from "fs";
import yaml from "js-yaml";
const CACHE_404_PATH = "./_cache/404s.yml";
var cached404s = yaml.load(fs.readFileSync(CACHE_404_PATH));

function writeToCache(url) {
	fs.appendFile(CACHE_404_PATH, `${url}: true\n`, (err) => {
		if (err) throw err;
	});
	cached404s[url] = true;
}

const siteChecker = new SiteChecker(
	{
		excludeInternalLinks: false,
		excludeExternalLinks: false,
		filterLevel: 0,
		acceptedSchemes: ["http", "https"],
		excludedKeywords: [
			"linkedin.com",
			"barnesandnoble.com",
			"codementor.io",
			"codepen.io",
		],
		cacheResponses: true,
		retryHeadCodes: [403],
		retryHeadFail: false,
		userAgent:
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
	},
	{
		error: (error) => {
			console.error(error);
		},
		link: (result, customData) => {
			if (result.broken && result.http.response) {
				const status_code = result.http.response.statusCode;
				if (
					status_code != undefined &&
					status_code.toString().indexOf("40") > -1
				) {
					console.log(`${status_code} => ${result.url.original}`);
					if (status_code == 404 && !(result.url.original in cached404s)) {
						console.log(`>>> Adding ${result.url.original} to the 404 cache`);
						writeToCache(result.url.original);
					}
				}
			}
			//clearTimeout(timeout);
			//timeout = setTimeout(() => {
			// broken-link-checker may not finish -- refer:
			// * https://github.com/stevenvachon/broken-link-checker/issues/90
			// It does however seem to always get stuck almost at the end.
			// After waiting 30 seconds for the next link to be processed,
			// we'll exit.
			//	finish();
			//}, 30000) // 30 seconds
		},
		end: () => {
			console.log("COMPLETED!");
			//finish();
		},
	}
);

siteChecker.enqueue("https://www.aaron-gustafson.com/");
