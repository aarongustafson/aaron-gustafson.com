var { SiteChecker } = require("broken-link-checker");
const fs = require('fs');
const yaml = require('js-yaml');
const CACHE_404_PATH =  './_cache/404s.yml';
const cached404s = yaml.load(fs.readFileSync(CACHE_404_PATH));
var new404s = [];

function writeToCache() {
  let appendString = '';
	new404s.forEach( url => {
		appendString += `${url}: true\n`;
	});
  fs.appendFile(CACHE_404_PATH, appendString, err => {
    if (err) throw err;
    console.log(`>>> ${new404s.length} 404s cached`);
  });
}

const siteChecker = new SiteChecker(
		{ 
			excludeInternalLinks: false,
			excludeExternalLinks: false, 
			filterLevel: 0,
			acceptedSchemes: ["http", "https"],
			excludedKeywords: [],
			cacheResponses: true,
			retryHeadCodes: [403],
			retryHeadFail: false,
			userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"
		},
		{
			"error": (error) => {
				console.error(error);
			},
			"link": (result, customData) => {
				console.log(`Checking ${result.url.original}`);
				if(result.broken) {
					const response = result.http.response;
					if ( response &&
							 response.statusCode != undefined &&
							 response.statusCode.toString().indexOf('40') > -1 ) {
						console.log(`${result.http.response.statusCode} => ${result.url.original}`);
						if ( response.statusCode == 404 &&
								 !( result.url.original in cached404s ) ) {
							console.log(`>>> Adding ${result.url.original} to the 404 cache`);
							new404s.push( result.url.original );
						}
					}
				}
			},
			"end": () => {
				console.log("COMPLETED!");
				writeToCache();
			}
		}
);

siteChecker.enqueue("https://www.aaron-gustafson.com/");
