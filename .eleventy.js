const pluginSEO = require("eleventy-plugin-seo");
const widont = require("widont");
const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdown_options = {
  html: true,
  linkify: true,
  typographer: true,
  breaks: false
};
const pluginRss = require("@11ty/eleventy-plugin-rss");
const svgContents = require("eleventy-plugin-svg-contents");
const embedEverything = require("eleventy-plugin-embed-everything");
const embedCodePen = require("@manustays/eleventy-plugin-codepen-iframe");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const imagesResponsiver = require("eleventy-plugin-images-responsiver");
const readingTime = require('eleventy-plugin-reading-time');

module.exports = config => {

  // Cloudinary
  config.cloudinaryCloudName = "aarongustafson";
  config.hostname = "https://www.aaron-gustafson.com";

  // Markdown
  let md = markdownIt(markdown_options)
             .use(require("markdown-it-attrs"))
             .use(require('markdown-it-footnote'));
  config.setLibrary( "md", md );

  // Layout aliases
  config.addLayoutAlias("base", "layouts/base.html");
  config.addLayoutAlias("blog", "layouts/blog.html");
  config.addLayoutAlias("home", "layouts/home.html");
  config.addLayoutAlias("link", "layouts/link.html");
  config.addLayoutAlias("page", "layouts/page.html");
  config.addLayoutAlias("post", "layouts/post.html");
  config.addLayoutAlias("tag", "layouts/tag.html");
  config.addLayoutAlias("tank", "layouts/tank.html");

  // Passthru
  config.addPassthroughCopy({ "src/static": "/" });

  // Plugins
  config.addPlugin(pluginSEO, require("./src/_data/seo.json"));
  config.addPlugin(svgContents);
  config.addPlugin(embedEverything, {
    twitter: {
      options: {
        cacheText: true
      }
    }
  });
  config.addPlugin(syntaxHighlight);
  config.addPlugin(readingTime);
  config.addPlugin(imagesResponsiver, {
    default: {
      sizes: '100vw',
      resizedImageUrl: (src, width) => `https://res.cloudinary.com/aarongustafson/image/fetch/q_auto,f_auto,w_${width}/${src}`,
      attributes: {
        loading: 'lazy',
      }
    }
  });
  config.addPlugin(embedCodePen);
  config.addPlugin(pluginRss, {
    posthtmlRenderOptions: {
      singleTags: ['img', 'hr', 'input'],
      closingSingleTag: "slash"
    }
  });
  
  // Filters
  config.addFilter("getNewestCollectionItemDate", pluginRss.getNewestCollectionItemDate);
  config.addFilter("absoluteUrl", pluginRss.absoluteUrl);
  config.addFilter("htmlToAbsoluteUrls", pluginRss.htmlToAbsoluteUrls);
  config.addFilter("dateToRfc3339", pluginRss.dateToRfc3339);
  function parse_date( date ){
    if ( ! date ) {
      return DateTime.now();
    }
    // try JS
    var the_date = DateTime.fromJSDate(date);
    // then try ISO
    if ( the_date.invalid ) {
      the_date = DateTime.fromISO(date);
    }
    // fallback to SQL
    if ( the_date.invalid ) {
      the_date = DateTime.fromSQL(date);
    }
    return the_date;
  }
  config.addFilter("readable_date", date => {
    return parse_date( date ).toFormat("dd LLL yyyy");
  });
  config.addFilter("machine_date", date => {
    return parse_date( date ).toISO();
  });
  config.addFilter("markdownify", text => {
    return md.renderInline( text );
  });
  config.addFilter("widont", function(text) {
    return `${widont( text )}`;
  });
  config.addFilter("limit", function(array, limit) {
    return array.slice(0, limit);
  });
  config.addFilter("past", function(array) {
    const now = DateTime.now();
    return array
             .filter( el => DateTime.fromSQL( el.date ) <= now )
             .sort( (a,b) => {
               a = DateTime.fromSQL( a.date );
               b = DateTime.fromSQL( b.date );
               return a < b ? -1 : a > b ? 1 : 0;
             })
             .reverse();
  });
  config.addFilter("future", function(array) {
    const now = DateTime.now();
    return array
             .filter( el=> DateTime.fromSQL( el.date ) > now )
             .sort( (a,b) => {
               a = DateTime.fromSQL( a.date );
               b = DateTime.fromSQL( b.date );
               return a < b ? -1 : a > b ? 1 : 0;
             });
  });
  config.addFilter("minus", ( a, b ) => parseInt(a,10) - parseInt(b,10) );
  config.addFilter("content_type", path => {
    let type = "post";
    if ( path && path.indexOf("/links/") > -1 )
    {
      type = "link";
    }
    return type;
  });
  config.addFilter("path_in_scope", ( path, scope ) => {
    return path.indexOf( scope ) > -1;
  });
  
  // Collections
  config.addCollection("posts", collectionApi => {
    return collectionApi
             .getFilteredByGlob("**/posts/*.md")
             .reverse();
  });
  config.addCollection("links", collectionApi => {
    return collectionApi
             .getFilteredByGlob("**/links/*.md")
             .reverse();
  });
  config.addCollection("feedAll", collectionApi => {
    return collectionApi
             .getFilteredByGlob(["**/posts/*.md", "**/links/*.md"])
             // sort by date - descending
             .sort(function(a, b) {
               return b.date - a.date;
             });
  });
  config.addCollection("sitemap", function(collectionApi) {
    // get unsorted items
    return collectionApi
            .getAll()
            .filter( item => ( "sitemap" in item.data && item.data.sitemap === true ) )
            .sort( (a,b) => {
              a = a.url.substring( 1 );
              b = b.url.substring( 1 );
              return a < b ? -1 : a > b ? 1 : 0;
            });
  });
  function filterTagList(tags) {
    return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
  }
  config.addCollection("tags", function(collection) {
    let tagSet = new Set();
    collection.getAll()
      .forEach(item => {
        (item.data.tags || []).forEach(tag => tagSet.add(tag));
      });
    return filterTagList([...tagSet]);
  });

  // Front Matter
  config.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!-- more -->"
  });

  // Config
  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist"
    }
  };
};