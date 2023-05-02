require('dotenv').config();

// Markdown
const markdownIt = require("markdown-it");
const markdown_options = {
	html: true,
	linkify: true,
	typographer: true,
	breaks: false
};
const md = markdownIt(markdown_options)
						.use(require("markdown-it-attrs"))
						.use(require('markdown-it-footnote'));

function tagsToColor( tags )
{
	const colors = {
		"abcdef": "82acd9",
		"ghijkl": "22c655",
		"mnopqrs": "f17ee8",
		"tuvwxyz": "de973c"
	};
	tags = tags || ["a"];
	const letter = tags[0].split("").shift().toLowerCase();
	for ( let letters in colors )
	{
		if ( letters.indexOf(letter) > -1 )
		{
			return colors[letters];
		}
	}
}

module.exports = {
	layout: "layouts/talk.html",
	permalink: "/speaking-engagements/{{ page.fileSlug }}/",
	body_class: "talk",
  eleventyComputed: {
		excerpt: (data) => {
			return md.renderInline( data.description )
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