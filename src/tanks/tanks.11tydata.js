
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
    image: async function (data) {
      return this.generateShareCard(
        [data.title, tagsToString(data.tags)],
        data.page.fileSlug,
      );
    },
  },
};
