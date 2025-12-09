import pluginSEO from "eleventy-plugin-seo";
// import { DateTime } from "luxon";
// import upgrade_helper from "@11ty/eleventy-upgrade-help";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import pluginRss from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import embedCodePen from "@manustays/eleventy-plugin-codepen-iframe";
import eleventyPluginFilesMinifier from "@sherby/eleventy-plugin-files-minifier";
import embedEverything from "eleventy-plugin-embed-everything";
import imagesResponsiver from "eleventy-plugin-images-responsiver";
import readingTime from "eleventy-plugin-reading-time";
import svgContents from "eleventy-plugin-svg-contents";
import markdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import markdownit_attrs from "markdown-it-attrs";
import markdownit_footnote from "markdown-it-footnote";
import filters from "./_11ty/filters.js";
const markdown_options = {
	html: true,
	linkify: true,
	typographer: true,
	breaks: false,
};

//import gulp from "gulp";
//const {series} = gulp;
import fs from "fs";

import { readFile } from "fs/promises";
const seo_conf = JSON.parse(
	await readFile(new URL("./src/_data/seo.json", import.meta.url))
);

import dotenv from "dotenv";
dotenv.config();
const PRODUCTION = process.env.NODE_ENV === "production";

const EVENTS = JSON.parse(
	fs.readFileSync("./src/_data/speaking_engagements.json")
);
function getEventDate(id) {
	return EVENTS.filter((event) => event.id.toString() === id.toString())[0]
		.date;
}

export default async (config) => {
	// Cloudinary
	config.cloudinaryCloudName = "aarongustafson";
	config.hostname = "https://www.aaron-gustafson.com";

	// Markdown
	let md = markdownIt(markdown_options)
		.use(anchor, {
			permalink: anchor.permalink.ariaHidden({
				placement: "before",
			}),
		})
		.use(markdownit_attrs)
		.use(markdownit_footnote);
	md.renderer.rules.footnote_block_open = () =>
		'<hr class="footnotes-sep">\n' +
		'<section class="footnotes">\n' +
		'<h4 class="hidden">Footnotes</h4>\n' +
		'<ol class="footnotes-list">\n';
	md.renderer.rules.footnote_caption = (
		tokens,
		idx /*, options, env, slf*/
	) => {
		var n = Number(tokens[idx].meta.id + 1).toString();

		if (tokens[idx].meta.subId > 0) {
			n += ":" + tokens[idx].meta.subId;
		}

		return n;
	};
	config.setLibrary("md", md);

	// Layout aliases
	config.addLayoutAlias("base", "layouts/base.html");
	config.addLayoutAlias("blog", "layouts/blog.html");
	config.addLayoutAlias("home", "layouts/home.html");
	config.addLayoutAlias("link", "layouts/link.html");
	config.addLayoutAlias("page", "layouts/page.html");
	config.addLayoutAlias("post", "layouts/post.html");
	config.addLayoutAlias("tag", "layouts/tag.html");
	config.addLayoutAlias("talk", "layouts/talk.html");
	config.addLayoutAlias("tank", "layouts/tank.html");

	// Passthru
	config.addPassthroughCopy({ "src/static": "/" });

	// Plugins
	config.addPlugin(pluginSEO, seo_conf);
	// Load SVG plugin always (since templates depend on it) but optimize for production
	config.addPlugin(svgContents, PRODUCTION ? {
		// Cache SVG processing to improve performance in production
		cache: true
	} : {});
	config.addPlugin(EleventyHtmlBasePlugin, {
		baseHref: PRODUCTION ? "https://www.aaron-gustafson.com" : "",
	});
	config.addPlugin(embedEverything, {
		// Add more aggressive caching for better performance
		youtube: {
			options: {
				cacheText: true,
				cacheDuration: "*",
			},
		},
	});
	config.addPlugin(syntaxHighlight, {
		preAttributes: { tabindex: 0 },
	});
	config.addPlugin(readingTime);
	config.addPlugin(imagesResponsiver, {
		hero: {
			sizes: "(min-width:60em) 700px, (max-width: 60em) 100vw",
			resizedImageUrl: (src, width) => {
				return PRODUCTION
					? `https://res.cloudinary.com/aarongustafson/image/fetch/q_auto,f_auto,w_${width}/${src}`
					: src.replace(config.hostname, "");
			},
			attributes: {
				width: "960",
				height: "960",
				decoding: "async",
				fetchpriority: "high",
				loading: "eager",
			},
		},
		thumbnail: {
			sizes: "100px",
			resizedImageUrl: (src) => {
				return PRODUCTION
					? `https://res.cloudinary.com/aarongustafson/image/fetch/q_100,f_auto,w_100,h_100,c_fill/${encodeURIComponent(
							src
					  )}`
					: src.replace(config.hostname, "");
			},
			attributes: {
				loading: "lazy",
				width: "100",
				height: "100",
				decoding: "async",
				fetchpriority: "low",
			},
		},
		ignore: {},
		default: {
			sizes: "(min-width:60em) 700px, (max-width: 60em) 100vw",
			resizedImageUrl: (src, width) => {
				return PRODUCTION
					? `https://res.cloudinary.com/aarongustafson/image/fetch/q_auto,f_auto,w_${width}/${src}`
					: src.replace(config.hostname, "");
			},
			attributes: {
				loading: "lazy",
				decoding: "async",
				fetchpriority: "high",
			},
		},
	});
	config.addPlugin(embedCodePen);
	config.addPlugin(pluginRss, {
		posthtmlRenderOptions: {
			singleTags: ["img", "hr", "input"],
			closingSingleTag: "slash",
		},
	});
	// Remove duplicate syntax highlight plugin
	// config.addPlugin(syntaxHighlight); // This was duplicated
	// Only minify files in production and with better performance settings
	if (PRODUCTION) {
		config.addPlugin(eleventyPluginFilesMinifier, {
			// Optimize minification settings for better performance
			throttle: true,
			concurrency: 2, // Reduce concurrency to prevent memory spikes
			preserveSymlinks: false,
			// Only minify critical files
			html: {
				minifyCSS: false, // CSS is already minified by Gulp
				minifyJS: false,  // JS is already minified by Gulp
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				removeEmptyAttributes: true,
				caseSensitive: true,
				keepClosingSlash: true
			}
		});
	}

	// Filters
	config.addFilter(
		"getNewestCollectionItemDate",
		pluginRss.getNewestCollectionItemDate
	);
	config.addFilter("absoluteUrl", pluginRss.absoluteUrl);
	//config.addFilter("htmlToAbsoluteUrls", pluginRss.htmlToAbsoluteUrls);
	config.addFilter("dateToRfc3339", pluginRss.dateToRfc3339);
	config.addFilter("markdownify", (text) => {
		return md.renderInline(text);
	});
	Object.keys(filters).forEach((filterName) => {
		config.addFilter(filterName, filters[filterName]);
	});

	// Collections
	// Optimize: Use a shared sorting function and reuse results where possible
	const sortByDateDesc = (a, b) => b.date - a.date;
	
	config.addCollection("posts", (collectionApi) => {
		return collectionApi.getFilteredByGlob("**/posts/*.md").reverse();
	});
	config.addCollection("links", (collectionApi) => {
		return collectionApi.getFilteredByGlob("**/links/*.md").reverse();
	});
	config.addCollection("notebook", (collectionApi) => {
		// More efficient: combine the results directly rather than separate glob calls
		return collectionApi
			.getFilteredByGlob(["**/posts/*.md", "**/links/*.md"])
			.sort(sortByDateDesc);
	});
	
	config.addCollection("talks", (collectionApi) => {
		return collectionApi
			.getFilteredByGlob("**/talks/*.md")
			.sort(sortByDateDesc);
	});
	config.addCollection("articles", (collectionApi) => {
		return collectionApi
			.getFilteredByGlob("**/articles/*.md")
			.sort(sortByDateDesc);
	});
	config.addCollection("books", (collectionApi) => {
		return collectionApi
			.getFilteredByGlob("**/books/*.md")
			.sort(sortByDateDesc);
	});
	config.addCollection("press", (collectionApi) => {
		return collectionApi
			.getFilteredByGlob("**/press/*.md")
			.sort(sortByDateDesc);
	});
	config.addCollection("podcasts", (collectionApi) => {
		return collectionApi
			.getFilteredByGlob("**/podcasts/*.md")
			.sort(sortByDateDesc);
	});
	config.addCollection("feedAll", (collectionApi) => {
		return collectionApi
			.getFilteredByGlob([
				"**/posts/*.md",
				"**/links/*.md",
				"**/talks/*.md",
				"**/articles/*.md",
				"**/books/*.md",
				"**/podcasts/*.md",
				"**/press/*.md",
			])
			.sort(sortByDateDesc);
	});
	config.addCollection("sitemap", function (collectionApi) {
		// get unsorted items
		return collectionApi
			.getAll()
			.filter((item) => "sitemap" in item.data && item.data.sitemap === true)
			.sort((a, b) => {
				a = a.url.substring(1);
				b = b.url.substring(1);
				return a < b ? -1 : a > b ? 1 : 0;
			});
	});
	function filterTagList(tags) {
		return (tags || []).filter(
			(tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1
		);
	}
	config.addCollection("tags", function (collectionApi) {
		let tagSet = new Set();
		collectionApi.getAll().forEach((item) => {
			(item.data.tags || []).forEach((tag) => tagSet.add(tag));
		});
		tagSet = filterTagList([...tagSet]);
		tagSet.sort((a, b) => {
			return a.localeCompare(b, "en", { sensitivity: "base" });
		});
		// Only write cache file in production to avoid unnecessary I/O during dev
		if (PRODUCTION) {
			fs.writeFile(
				"./_cache/tags.json",
				JSON.stringify(tagSet, false, 2),
				(err) => {
					if (err) throw err;
				}
			);
		}
		return tagSet;
	});
	config.addCollection("series", function (collectionApi) {
		let series = {};
		collectionApi.getAll().forEach((item) => {
			if (
				"series" in item.data &&
				"tag" in item.data.series &&
				!(item.data.series.tag in series)
			) {
				series[item.data.series.tag] = item.data.series.name;
			}
		});
		
		// Only perform file operations in production
		if (PRODUCTION) {
			// Generate a series JSON
			fs.writeFile(
				"./_cache/series.json",
				JSON.stringify(series, false, 2),
				(err) => {
					if (err) throw err;
				}
			);
			// Build series files
			for (let tag in series) {
				let tagName = tag.replace("series-", "");
				let filename = `./src/series/${tagName}.md`;
				if (!fs.existsSync(filename)) {
					let content = `---\ntitle: "${series[tag]}"\ndescription: ""\ntag: ${tag}\n---`;
					fs.writeFile(filename, content, (err) => {
						if (err) throw err;
						console.log(`New series file created: ${filename}`);
					});
				}
			}
		}
		return series;
	});

	// Front Matter
	config.setFrontMatterParsingOptions({
		excerpt: true,
		excerpt_separator: "<!-- more -->",
	});

	// Nunjucks
	config.setNunjucksEnvironmentOptions({
		//throwOnUndefined: true,
		trimBlocks: true,
		lstripBlocks: true,
	});

	// Upgrade Helper
	// config.addPlugin(upgrade_helper);

	// Config
	return {
		markdownTemplateEngine: "njk",
		dataTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		dir: {
			input: "src",
			output: "dist",
		},
		// Enable incremental builds for faster development
		...(PRODUCTION ? {} : {
			ignores: [
				"src/**/*.draft.md",
				"src/_cache/**/*"
			]
		}),
		// Use faster template engines for development
		...(PRODUCTION ? {} : {
			pathPrefix: "/",
		})
	};
};
