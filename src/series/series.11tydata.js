export default {
	layout: "layouts/series.njk",
	permalink: "/notebook/series/{{ page.fileSlug }}/",
	eleventyComputed: {
		title: (data) => {
			return `Series: ${data.title}`;
		},
	},
};
