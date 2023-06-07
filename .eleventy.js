const pluginSEO = require("eleventy-plugin-seo");
//const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdown_options = {
	html: true,
	linkify: true,
	typographer: true,
	breaks: false
};
const anchor = require('markdown-it-anchor');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const svgContents = require("eleventy-plugin-svg-contents");
const embedEverything = require("eleventy-plugin-embed-everything");
const embedCodePen = require("@manustays/eleventy-plugin-codepen-iframe");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const imagesResponsiver = require("eleventy-plugin-images-responsiver");
const readingTime = require('eleventy-plugin-reading-time');
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
//const { series } = require("gulp");
const fs = require('fs');
require('dotenv').config();
const PRODUCTION = process.env.NODE_ENV === "production";

const EVENTS = JSON.parse(fs.readFileSync("./src/_data/speaking_engagements.json"));
function getEventDate(id){
	return EVENTS.filter(event=>event.id.toString()===id.toString())[0].date;
}

module.exports = config => {

	// Cloudinary
	config.cloudinaryCloudName = "aarongustafson";
	config.hostname = "https://www.aaron-gustafson.com";

	// Markdown
	let md = markdownIt(markdown_options)
						 .use( anchor, {
							 permalink: anchor.permalink.ariaHidden({
								 placement: 'before'
							 })
							})
						 .use(require("markdown-it-attrs"))
						 .use(require('markdown-it-footnote'));
	md.renderer.rules.footnote_caption = (tokens, idx/*, options, env, slf*/) => {
		var n = Number(tokens[idx].meta.id + 1).toString();

		if (tokens[idx].meta.subId > 0) {
			n += ':' + tokens[idx].meta.subId;
		}

		return n;
	};
	config.setLibrary( "md", md );

	// Layout aliases
	config.addLayoutAlias("base", "layouts/base.html");
	config.addLayoutAlias("blog", "layouts/blog.html");
	config.addLayoutAlias("home", "layouts/home.html");
	config.addLayoutAlias("link", "layouts/link.html");
	config.addLayoutAlias("page", "layouts/page.html");
	config.addLayoutAlias("post", "layouts/post.html");
	config.addLayoutAlias("tag",  "layouts/tag.html");
	config.addLayoutAlias("talk", "layouts/talk.html");
	config.addLayoutAlias("tank", "layouts/tank.html");

	// Passthru
	config.addPassthroughCopy({ "src/static": "/" });

	// Plugins
	config.addPlugin(pluginSEO, require("./src/_data/seo.json"));
	config.addPlugin(svgContents);
	// config.addPlugin(EleventyHtmlBasePlugin, {
	// 	baseHref: PRODUCTION ? "https://www.aaron-gustafson.com" : ""
	// });
	config.addPlugin(embedEverything, {
		twitter: {
			options: {
				cacheText: true
			}
		}
	});
	config.addPlugin(syntaxHighlight, {
    preAttributes: { tabindex: 0 }
  });
	config.addPlugin(readingTime);
	config.addPlugin(imagesResponsiver, {
		hero: {
			sizes: '700px, (max-width: 60em) 100vw',
			resizedImageUrl: (src, width) => {
				return PRODUCTION ? `https://res.cloudinary.com/aarongustafson/image/fetch/q_auto,f_auto,w_${width}/${src}` : src.replace(config.hostname,"");
			},
			attributes: {
				width: "960",
				height: "960",
				decoding: "async",
				crossorigin: "anonymous",
				fetchpriority: "high"
			},
		},
		thumbnail: {
			sizes: '100px',
			resizedImageUrl: (src) => {
				return PRODUCTION ? `https://res.cloudinary.com/aarongustafson/image/fetch/q_100,f_auto,w_100,h_100,c_fill/${src}` : src.replace(config.hostname,"");
			},
			attributes: {
				loading: 'lazy',
				width: "100",
				height: "100",
				decoding: "async",
				crossorigin: "anonymous",
				fetchpriority: "low"
			},
		},
		default: {
			sizes: '700px, (max-width: 60em) 100vw',
			resizedImageUrl: (src, width) => {
				return PRODUCTION ? `https://res.cloudinary.com/aarongustafson/image/fetch/q_auto,f_auto,w_${width}/${src}` : src.replace(config.hostname,"");
			},
			attributes: {
				loading: 'lazy',
				decoding: "async",
				crossorigin: "anonymous",
				fetchpriority: "high"
			},
		},
	});
	config.addPlugin(embedCodePen);
	config.addPlugin(pluginRss, {
		posthtmlRenderOptions: {
			singleTags: ['img', 'hr', 'input'],
			closingSingleTag: "slash"
		}
	});
	config.addPlugin(syntaxHighlight);
	config.addPlugin(eleventyPluginFilesMinifier);
	
	// Filters
	config.addFilter("getNewestCollectionItemDate", pluginRss.getNewestCollectionItemDate);
	config.addFilter("absoluteUrl", pluginRss.absoluteUrl);
	config.addFilter("htmlToAbsoluteUrls", pluginRss.htmlToAbsoluteUrls);
	config.addFilter("dateToRfc3339", pluginRss.dateToRfc3339);
	config.addFilter("markdownify", text => {
		return md.renderInline( text );
	});
	const filters = require('./_11ty/filters');
	Object.keys(filters).forEach(filterName => {
		config.addFilter(filterName, filters[filterName]);
	});
	
	// Collections
	config.addCollection("posts", collectionApi => {
		return collectionApi
						 .getFilteredByGlob("**/posts/*.md")
						 .reverse();
	});
	config.addCollection("links", collectionApi => {
		return collectionApi
						 .getFilteredByGlob("**/links/*.md")
						 .reverse();
	});
	config.addCollection("talks", collectionApi => {
		return collectionApi
						 .getFilteredByGlob("**/talks/*.md")
						 // sort by date - descending
						 .sort(function(a, b) {
							return b.date - a.date;
						 });
	});
	config.addCollection("feedAll", collectionApi => {
		return collectionApi
						 .getFilteredByGlob(["**/posts/*.md", "**/links/*.md", "**/talks/*.md"])
						 // sort by date - descending
						 .sort(function(a, b) {
							return b.date - a.date;
						 });
	});
	config.addCollection("sitemap", function(collectionApi) {
		// get unsorted items
		return collectionApi
						.getAll()
						.filter( item => ( "sitemap" in item.data && item.data.sitemap === true ) )
						.sort( (a,b) => {
							a = a.url.substring( 1 );
							b = b.url.substring( 1 );
							return a < b ? -1 : a > b ? 1 : 0;
						});
	});
	function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
	}
	config.addCollection("tags", function(collectionApi) {
		let tagSet = new Set();
		collectionApi.getAll()
			.forEach(item => {
				(item.data.tags || []).forEach(tag => tagSet.add(tag));
			});
		tagSet = filterTagList([...tagSet]);
		tagSet.sort((a,b)=>{
			return a.localeCompare(b, 'en', {'sensitivity': 'base'});
		});
		// Generate a series JSON
		fs.writeFile("./_cache/tags.json", JSON.stringify(tagSet,false, 2), err => {
			if (err) throw err;
		});
		return tagSet;
	});
	config.addCollection("series", function(collectionApi) {
		let series = {};
		collectionApi.getAll()
			.forEach(item => {
				if ( "series" in item.data &&
						 "tag" in item.data.series &&
						 ! ( item.data.series.tag in series ) )
				{
					series[item.data.series.tag] = item.data.series.name;
				}
			});
		// Generate a series JSON
		fs.writeFile("./_cache/series.json", JSON.stringify(series, false, 2), err => {
			if (err) throw err;
		});
		// Build series files
		for ( let tag in series ) {
			let tagName = tag.replace("series-", "");
			let filename = `./src/series/${tagName}.md`;
			if (!fs.existsSync(filename)) {
				let content = `---\ntitle: "${series[tag]}"\ndescription: ""\ntag: ${tag}\n---`;
				fs.writeFile(filename, content, err => {
					if (err) throw err;
					console.log(`New series file created: ${filename}`);
				});
			}
		}
		return series;
	});

	// Front Matter
	config.setFrontMatterParsingOptions({
		excerpt: true,
		excerpt_separator: "<!-- more -->"
	});

	// Nunjucks
	config.setNunjucksEnvironmentOptions({
		//throwOnUndefined: true,
		trimBlocks: true,
		lstripBlocks: true
	});

	// Upgrade Helper
	// config.addPlugin(require("@11ty/eleventy-upgrade-help"));

	// Config
	return {
		markdownTemplateEngine: "njk",
		dataTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		dir: {
			input: "src",
			output: "dist"
		}
	};
};