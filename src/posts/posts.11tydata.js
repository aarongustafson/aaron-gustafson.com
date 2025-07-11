import dotenv from "dotenv";
dotenv.config();

import getShareImage from "@jlengstorf/get-share-image";

// Cache for generated share images to avoid regeneration
const shareImageCache = new Map();

// Markdown
import markdownIt from "markdown-it";
import markdownit_attrs from "markdown-it-attrs";
import markdownit_footnote from "markdown-it-footnote";
const markdown_options = {
	html: true,
	linkify: true,
	typographer: true,
	breaks: false,
};
const md = markdownIt(markdown_options)
	.use(markdownit_attrs)
	.use(markdownit_footnote);

// Cache for processed excerpts to avoid re-processing markdown
const excerptCache = new Map();

const isDevEnv = process.env.ELEVENTY_ENV === "development";
const todaysDate = new Date();

function showPost(data) {
	const isDraft = "draft" in data && data.draft !== false;
	const isFutureDate = data.page.date > todaysDate;
	//console.log('slug', data.page.fileSlug, 'draft', isDraft, 'future', isFutureDate);
	return isDevEnv || (!isDraft && !isFutureDate);
}

function tagsToString(tags) {
	var non_alpha_numeric = /[^a-zA-z0-9]/g;
	tags = tags || [];
	tags = tags.slice(0, 3); // no more than 3
	tags = tags.map((tag) => {
		return "#" + tag.toLowerCase().replace(non_alpha_numeric, "-");
	});
	return tags.join(" ");
}

function tagsToColor(tags) {
	const colors = {
		abcdef: "82acd9",
		ghijkl: "22c655",
		mnopqrs: "f17ee8",
		tuvwxyz: "de973c",
	};
	tags = tags || ["a"];
	const letter = tags[0].split("").shift().toLowerCase();
	for (let letters in colors) {
		if (letters.indexOf(letter) > -1) {
			return colors[letters];
		}
	}
}

export default {
	layout: "layouts/post.html",
	body_class: "post",
	eleventyComputed: {
		eleventyExcludeFromCollections: (data) => (showPost(data) ? false : true),
		permalink: (data) =>
			showPost(data) ? `/notebook/${data.page.fileSlug}/` : false,
		excerpt: (data) => {
			let excerpt = "";
			let sourceText = "";
			
			if ("excerpt" in data.page) {
				sourceText = data.page.excerpt;
			} else if (data.description) {
				sourceText = data.description;
			}
			
			if (sourceText) {
				// Check cache first
				if (excerptCache.has(sourceText)) {
					return excerptCache.get(sourceText);
				}
				
				excerpt = md
					.renderInline(sourceText)
					.replace(/\[\^\d+\]/gi, "") // remove footnotes
					.replace(/(<([^>]+)>)/gi, "") // remove HTML
					.trim();
				
				// Cache the processed excerpt
				excerptCache.set(sourceText, excerpt);
			}
			
			return excerpt;
		},
		hue: (data) => {
			return tagsToColor(data.tags);
		},
		image: (data) => {
			if (data.hero) {
				return `${data.site.url}${data.hero.src}`;
			} else {
				// Create cache key from title + tags to avoid regenerating identical images
				const cacheKey = `${data.title}-${tagsToString(data.tags)}`;
				
				if (shareImageCache.has(cacheKey)) {
					return shareImageCache.get(cacheKey);
				}
				
				const shareImage = getShareImage({
					cloudName: "aarongustafson",
					imagePublicID: "share-card",
					tagline: tagsToString(data.tags),
					taglineColor: "505050",
					taglineFont: "Open Sans",
					// light, -5 line spacing
					taglineExtraConfig: "_light_line_spacing_-5",
					taglineFontSize: 36,
					taglineGravity: "north_west",
					taglineLeftOffset: 480,
					taglineTopOffset: 505,
					textAreaWidth: 760,
					title: data.title,
					titleFont: "Source Serif Pro",
					titleFontSize: 72,
					titleGravity: "south_west",
					// 700 weight, -18 line spacing
					titleExtraConfig: "_700_line_spacing_-18",
					titleLeftOffset: 480,
					titleBottomOffset: 205,
					textColor: "2C2825",
				});
				
				shareImageCache.set(cacheKey, shareImage);
				return shareImage;
			}
		},
	},
};
