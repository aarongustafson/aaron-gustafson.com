require('dotenv').config();

const getShareImage = require("@jlengstorf/get-share-image").default;

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

const isDevEnv = process.env.ELEVENTY_ENV === 'development';
const todaysDate = new Date();

function showPost(data) {
	const isDraft = 'draft' in data && data.draft !== false;
	const isFutureDate = data.page.date > todaysDate;
	return isDevEnv || (!isDraft && !isFutureDate);
}

function tagsToString( tags )
{
	var non_alpha_numeric = /[^a-zA-z0-9]/g;
	tags = tags || [];
	tags = tags.slice(0,3);  // no more than 3
	tags = tags.map( tag => {
		return "#" + tag.toLowerCase().replace( non_alpha_numeric, "-" );
	} );
	return tags.join(" ");
}

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
	layout: "layouts/post.html",
	eleventyComputed: {
		eleventyExcludeFromCollections: data => showPost(data) ? false : true,
		permalink: data => showPost(data) ? `/notebook/${ data.page.fileSlug }/` : false,
		excerpt: (data) => {
			let excerpt = "";
			if ( "excerpt" in data.page )
			{
				excerpt = md.renderInline( data.page.excerpt )
										.replace(/\[\^\d+\]/gi, "") // remove footnotes
										.replace(/(<([^>]+)>)/gi, "") // remove HTML
										.trim();
			}
			return excerpt;
		},
		hue: (data) => {
			return tagsToColor(data.tags);
		},
		image: (data) => {
			if (data.hero) {
				return `${data.site.url}${data.hero.src}`;
			}
			else
			{
				return getShareImage({
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
			}
		},
	},
};