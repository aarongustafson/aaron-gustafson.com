const pluginSEO = require("eleventy-plugin-seo");
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
const { series } = require("gulp");

module.exports = config => {

  // Cloudinary
  config.cloudinaryCloudName = "aarongustafson";
  config.hostname = "https://www.aaron-gustafson.com";

  // Markdown
  let md = markdownIt(markdown_options)
             .use(require("markdown-it-anchor"),{permalink: true})
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
  config.addPlugin(syntaxHighlight);
  
  // Filters
  config.addFilter("getNewestCollectionItemDate", pluginRss.getNewestCollectionItemDate);
  config.addFilter("absoluteUrl", pluginRss.absoluteUrl);
  config.addFilter("htmlToAbsoluteUrls", pluginRss.htmlToAbsoluteUrls);
  config.addFilter("dateToRfc3339", pluginRss.dateToRfc3339);
  config.addFilter("markdownify", text => {
    return md.renderInline( text );
  });
  const filters = require('./_11ty/filters');
  Object.keys(filters).forEach(filterName => {
    config.addFilter(filterName, filters[filterName]);
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
  config.addCollection("tags", function(collectionApi) {
    let tagSet = new Set();
    collectionApi.getAll()
      .forEach(item => {
        (item.data.tags || []).forEach(tag => tagSet.add(tag));
      });
    return filterTagList([...tagSet]);
  });
  config.addCollection("series", function(collectionApi) {
    let series = {};
    collectionApi.getAll()
      .forEach(item => {
        if ( "series" in item.data &&
             ! ( item.data.series.tag in series ) )
        {
          series[item.data.series.tag] = item.data.series.name;
        }
      });
    return series;
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