import dotenv from "dotenv";
dotenv.config();

import { createGenerator } from "../../plugins/eleventy-plugin-share-card/index.js";

// Build-time share-card generator — composites text onto share-card.jpg locally.
// Images are written to src/static/i/share-cards/ and cached in _cache/share-cards.json
// so only posts whose title or tags have changed are regenerated.
const generateShareCard = createGenerator({
	baseImagePath: "./src/_images/share-card.jpg",
	outputDir: "./src/static/i/share-cards",
	outputUrlPath: "/i/share-cards",
	cacheFile: "./_cache/share-cards.json",
	imageWidth: 1280,
	imageHeight: 669,
	layers: [
		{
			// Post title — Source Serif Pro Bold, anchored to the bottom of the text area
			font: "Source Serif Pro",
			fontFallback: "serif",
			fontPath:
				"node_modules/@fontsource/source-serif-pro/files/source-serif-pro-latin-700-normal.woff2",
			fontSize: 72,
			fontWeight: 700,
			color: "#2C2825",
			x: 480,
			y: { from: "bottom", value: 205 },
			maxWidth: 760,
			lineSpacing: -18,
		},
		{
			// Hashtag tagline — Open Sans Light, anchored to the top of the text area
			font: "Open Sans",
			fontFallback: "sans-serif",
			fontPath:
				"node_modules/@fontsource/open-sans/files/open-sans-latin-300-normal.woff2",
			fontSize: 36,
			fontWeight: 300,
			color: "#505050",
			x: 480,
			y: { from: "top", value: 505 },
			maxWidth: 760,
			lineSpacing: -5,
			// constrainToWidth: use SVG transform scale (not textLength, which librsvg ignores)
			// actualWidthFactor: Open Sans 300 at 36px renders ~12% wider than the heuristic
			// estimate, so lines near maxWidth get a horizontal scale transform to fit.
			constrainToWidth: true,
			actualWidthFactor: 1.15,
		},
	],
});

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
const MAX_EXCERPT_CACHE_SIZE = 1000; // More than enough for current site

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

// Remove fragment-only links so excerpts don't emit dead anchors in listings
function stripFragmentLinks(text = "") {
	return text
		.replace(/\[([^\]]+)\]\(#([^\)]+)\)/gi, "$1")
		.replace(/<a\s+[^>]*href="#.*?"[^>]*>(.*?)<\/a>/gi, "$1");
}

export default {
	layout: "layouts/post.njk",
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
				const sanitizedSource = stripFragmentLinks(sourceText);

				// Check cache first
				if (excerptCache.has(sanitizedSource)) {
					return excerptCache.get(sanitizedSource);
				}

				excerpt = md
					.renderInline(sanitizedSource)
					.replace(/\[\^\d+\]/gi, "") // remove footnotes
					.replace(/(<([^>]+)>)/gi, "") // remove HTML
					.trim();

				// Cache the processed excerpt with size limit
				if (excerptCache.size >= MAX_EXCERPT_CACHE_SIZE) {
					const firstKey = excerptCache.keys().next().value;
					excerptCache.delete(firstKey);
				}
				excerptCache.set(sanitizedSource, excerpt);
			}

			return excerpt;
		},
		hue: (data) => {
			return tagsToColor(data.tags);
		},
		image: async (data) => {
			if (data.hero) {
				return `${data.site.url}${data.hero.src}`;
			}
			// Generate (or return cached) share-card image locally — no Cloudinary needed.
			return generateShareCard(
				[data.title, tagsToString(data.tags)],
				data.page.fileSlug,
			);
		},
	},
};
