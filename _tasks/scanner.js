var { SiteChecker } = require("broken-link-checker");

const siteChecker = new SiteChecker(
    { 
        excludeInternalLinks: false,
        excludeExternalLinks: false, 
        filterLevel: 0,
        acceptedSchemes: ["http", "https"],
        excludedKeywords: ["linkedin"]
    },
    {
        "error": (error) => {
            console.error(error);
        },
        "link": (result, customData) => {
            if(result.broken) {
                if(result.http.response && ![undefined, 200].includes(result.http.response.statusCode)) {
                    console.log(`${result.http.response.statusCode} => ${result.url.original}`);
                }
            }
        },
        "end": () => {
            console.log("COMPLETED!");
        }
    }
);

siteChecker.enqueue("http://localhost:8080/");
