import { createGenerator } from "../../plugins/eleventy-plugin-share-card/index.js";

const generateShareCard = createGenerator({
	baseImagePath: "./src/_images/share-card.jpg",
	outputDir: "./src/static/i/share-cards",
	outputUrlPath: "/i/share-cards",
	cacheFile: "./_cache/share-cards.json",
	imageWidth: 1280,
	imageHeight: 669,
	layers: [
		{
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
			constrainToWidth: true,
			actualWidthFactor: 1.15,
		},
	],
});

function tagsToString(tags) {
	var non_alpha_numeric = /[^a-zA-z0-9]/g;
	tags = tags || [];
	tags = tags.map((tag) => {
		return "#" + tag.toLowerCase().replace(non_alpha_numeric, "-");
	});
	return tags.join(" ");
}

export default {
	layout: "layouts/tank.njk",
	permalink: "/tanks/{{ page.fileSlug }}/",
	eleventyComputed: {
		image: async (data) => {
			return generateShareCard(
				[data.title, tagsToString(data.tags)],
				data.page.fileSlug,
			);
		},
	},
};
