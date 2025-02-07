import dotenv from "dotenv";
dotenv.config();

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
	layout: "layouts/talk.html",
	permalink: "/speaking-engagements/{{ page.fileSlug }}/",
	body_class: "talk",
	eleventyComputed: {
		twitter_text: (data) => {
			return data.description;
		},
		excerpt: (data) => {
			return md
				.renderInline(data.description)
				.replace(/\[\^\d+\]/gi, "") // remove footnotes
				.replace(/(<([^>]+)>)/gi, "") // remove HTML
				.trim();
		},
		hue: (data) => {
			return tagsToColor(data.tags);
		},
		image: (data) => {
			return `${data.site.url}/i/talks/${data.hero}`;
		},
	},
};
