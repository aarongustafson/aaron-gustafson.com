require('dotenv').config();
const fs = require('fs');
const CACHE_FILE_PATH = '_cache/og_images.yml';
const yaml = require('js-yaml');
let og_images = yaml.load(fs.readFileSync(CACHE_FILE_PATH));
const current_month = new Date().getMonth() + 1;
const CACHE_404_PATH =  '_cache/404s.yml';
const cached404s = yaml.load(fs.readFileSync(CACHE_404_PATH));
const ogs = require('open-graph-scraper');

async function getOpenGraphImage(url) {
	const data = await ogs({
		url,
		fetchOptions: {
			headers: {
				'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
			}
		}
	});
	
	// happy path
	if ( data.success ) {
		return data.ogImage.url;
	}

	console.log(`>>> Could not gather OpenGraph image`);
	return false;
}

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
				og_image = await getOpenGraphImage(url);

				// Backup: Personal screenshot service
				//if ( og_image === false ) {
				//	og_image = `https://screenshots.aaron-gustafson.com/${encodeURI(url)}/`;
				//}

				writeToCache(url, og_image);
				return og_image;
			}
		}
	}
};