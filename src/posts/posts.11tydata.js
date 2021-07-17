const getShareImage = require("@jlengstorf/get-share-image").default;

function tagsToString( tags )
{
  var non_alpha_numeric = /[^a-zA-z0-9]/g
  tags = tags || [];
  tags = tags.map( tag => {
    return "#" + tag.toLowerCase().replace( non_alpha_numeric, "-" );
  } );
  return tags.join(" ");
}

module.exports = {
  layout: "layouts/post.html",
  permalink: "/notebook/{{ page.fileSlug }}/",
  eleventyComputed: {
    image: (data) => {
      return getShareImage({
        cloudName: "aarongustafson",
        imagePublicID: "share-card_xvdf2w",
        tagline: tagsToString(data.tags),
        taglineColor: "505050",
        taglineFont: "Open Sans",
        // light, 760px wide
        taglineExtraConfig: "_light_w_760",
        taglineFontSize: 36,
        taglineGravity: "north_west",
        taglineLeftOffset: 480,
        taglineTopOffset: 495,
        textAreaWidth: 600,
        title: data.title,
        titleFont: "Source Serif Pro",
        titleFontSize: 64,
        titleGravity: "south_west",
        // 600 weight, 760px wide, -10 line spacing
        titleExtraConfig: "_600_w_760_line_spacing_-15",
        titleLeftOffset: 480,
        titleBottomOffset: 205,
        textColor: "2C2825",
      });
    },
  },
};