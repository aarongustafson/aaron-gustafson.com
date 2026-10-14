import dotenv from "dotenv";
dotenv.config();


// Markdown
import markdownIt from "markdown-it";
import markdownit_attrs from "markdown-it-attrs";
import markdownit_footnote from "markdown-it-footnote";
import { plainText } from "../../_11ty/metadata.js";
import { tagsToShareCardText } from "../../_11ty/share-card-config.js";
const markdown_options = {
  html: true,
  linkify: true,
  typographer: true,
  breaks: false,
};
const md = markdownIt(markdown_options)
  .use(markdownit_attrs)
  .use(markdownit_footnote);

// Cache for processed excerpts to avoid re-processing markdown
const excerptCache = new Map();
const MAX_EXCERPT_CACHE_SIZE = 1000; // More than enough for current site

const isDevEnv = process.env.ELEVENTY_ENV === "development";
const todaysDate = new Date();

function showPost(data) {
  const isDraft = "draft" in data && data.draft !== false;
  const isFutureDate = data.page.date > todaysDate;
  //console.log('slug', data.page.fileSlug, 'draft', isDraft, 'future', isFutureDate);
  return isDevEnv || (!isDraft && !isFutureDate);
}

function tagsToColor(tags) {
  const colors = {
    abcdef: "82acd9",
    ghijkl: "22c655",
    mnopqrs: "f17ee8",
    tuvwxyz: "de973c",
  };
  const firstTag = (
    Array.isArray(tags)
      ? tags.find((tag) => typeof tag === "string" && tag.length > 0)
      : typeof tags === "string" && tags.length > 0
        ? tags
        : undefined
  ) || "a";
  const letter = firstTag.charAt(0).toLowerCase() || "a";
  for (let letters in colors) {
    if (letters.indexOf(letter) > -1) {
      return colors[letters];
    }
  }

  return colors.abcdef;
}

// Remove fragment-only links so excerpts don't emit dead anchors in listings
function stripFragmentLinks(text = "") {
  return text
    .replace(/\[([^\]]+)\]\(#([^\)]+)\)/gi, "$1")
    .replace(/<a\s+[^>]*href="#.*?"[^>]*>(.*?)<\/a>/gi, "$1");
}

export default {
  layout: "layouts/post.njk",
  body_class: "post",
  eleventyComputed: {
    eleventyExcludeFromCollections: (data) => (showPost(data) ? false : true),
    permalink: (data) =>
      showPost(data) ? `/notebook/${data.page.fileSlug}/` : false,
    excerpt: (data) => {
      let excerpt = "";
      let sourceText = "";

      if ("excerpt" in data.page) {
        sourceText = data.page.excerpt;
      } else if (data.description) {
        sourceText = data.description;
      }

      if (sourceText) {
        const sanitizedSource = stripFragmentLinks(sourceText);

        // Check cache first
        if (excerptCache.has(sanitizedSource)) {
          return excerptCache.get(sanitizedSource);
        }

        excerpt = md
          .renderInline(sanitizedSource)
          .replace(/\[\^\d+\]/gi, "") // remove footnotes
          .replace(/(<([^>]+)>)/gi, "") // remove HTML
          .trim();

        // Cache the processed excerpt with size limit
        if (excerptCache.size >= MAX_EXCERPT_CACHE_SIZE) {
          const firstKey = excerptCache.keys().next().value;
          excerptCache.delete(firstKey);
        }
        excerptCache.set(sanitizedSource, excerpt);
      }

      return excerpt;
    },
    hue: (data) => {
      return tagsToColor(data.tags);
    },
    image: async function (data) {
      if (data.image && process.env.FORCE_SHARE_CARDS !== "true") {
        return data.image;
      }
      if (data.hero) {
        return this.generateHeroShareCard(data.hero, data.page.fileSlug);
      }
      return this.generateShareCard(
        [plainText(data.title), tagsToShareCardText(data.tags)],
        data.page.fileSlug,
      );
    },
  },
};
