require('dotenv').config();
const fs = require('fs');
const EleventyFetch = require("@11ty/eleventy-fetch");
const CACHE_FILE_PATH = '_cache/og_images.yml';
const yaml = require('js-yaml');
let og_images = yaml.load(fs.readFileSync(CACHE_FILE_PATH));
const CACHE_404_PATH =  '_cache/404s.yml';
const cached404s = yaml.load(fs.readFileSync(CACHE_404_PATH));

function writeToCache( url, value, cache ) {
	cache = cache || CACHE_FILE_PATH;
	// make sure we don’t write more than once
	if ( ! (url in og_images) )
	{
		value = ( value === true || value == 404 ) ? value : `"${encodeURI(value)}"`;
		og_images[url] = value;
		fs.appendFile(cache, `${url}: ${value}\n`, err => {
			if (err) throw err;
			console.log(`>>> Opengraph images for ${url} cached`);
		});
	}
}

function is404ing(url) {
	return ( url in cached404s );
}

function archived(data) {
	let archive_url = 'https://web.archive.org/web/{{ DATE }}/{{ URL }}';
	let month = data.date.getUTCMonth()+1;
	month = month < 10 ? "0" + month : month;
	let day = data.date.getDay();
	day = day < 10 ? "0" + day : day;
	archive_url = archive_url.replace('{{ DATE }}', `${data.date.getUTCFullYear()}${month}${day}`)
													 .replace('{{ URL }}', data.ref_url );
	return archive_url;
}

module.exports = {
	layout: "layouts/link.html",
	permalink: "/notebook/{{ page.filePathStem }}/",
	body_class: "link",
	eleventyComputed: {
		is_404: (data) => {
			return is404ing(data.ref_url);
		},
		archived: (data) => {
			return is404ing(data.ref_url) ? archived(data) : false;
		},
		og_image: async (data) => {
			const url = data.ref_url;
			if ( url in og_images )
			{
				return ( og_images[url] === true || og_images[url] === "404" ) ? false : decodeURI(og_images[url]);
			}
			else
			{
				// don’t run if the limits have already been reached
				// no point checking 404s
				if ( 'is_404' in data ) {
					return false;
				}

				let og_image = false;
        // Try to parse the open graph data
        try {
          let response = await EleventyFetch(
            `https://www.aaron-gustafson.com/api/og-image/?key=${process.env.WEBMENTION_APP_TOKEN}&url=${url}`,
            {
              duration: "1y",
              type: "json"
            }
          );
          og_image = response.image;
          writeToCache(url, og_image);
        } catch(e) {
          console.log("Error with the OG Image service", e);
        }
        
				return og_image;
			}
		}
	}
};