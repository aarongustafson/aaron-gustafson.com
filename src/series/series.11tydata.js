export default {
	layout: "layouts/series.html",
	permalink: "/notebook/series/{{ page.fileSlug }}/",
	eleventyComputed: {
		title: (data) => {
			return `Series: ${data.title}`;
		},
	},
};
