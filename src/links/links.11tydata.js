import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import yaml from "js-yaml";

const CACHE_FILE_PATH = "_cache/og_images.yml";
let og_images = yaml.load(fs.readFileSync(CACHE_FILE_PATH));
const CACHE_404_PATH = "_cache/404s.yml";
const cached404s = yaml.load(fs.readFileSync(CACHE_404_PATH));

function normalizeOgImageUrl(imageUrl, pageUrl) {
  if (!imageUrl || imageUrl === true || imageUrl === "false" || imageUrl === "404") {
    return false;
  }

  const value = String(imageUrl).trim();
  if (!value) {
    return false;
  }

  try {
    const page = new URL(pageUrl);

    if (value.startsWith("//")) {
      const withoutSlashes = value.replace(/^\/+/, "");
      // Keep true protocol-relative URLs external, but treat //path as a site-root path.
      if (/^[^/]+\.[^/]+(?:\/|$)/.test(withoutSlashes)) {
        return `https://${withoutSlashes}`;
      }
      return `${page.origin}/${withoutSlashes}`;
    }

    if (value.startsWith("/")) {
      return `${page.origin}${value}`;
    }

    return new URL(value, page).toString();
  } catch {
    return false;
  }
}

async function fetchOgImageFromService(url) {
  const endpoint = new URL("https://www.aaron-gustafson.com/api/og-image/");
  endpoint.searchParams.set("key", process.env.WEBMENTION_APP_TOKEN);
  endpoint.searchParams.set("url", url);

  const response = await fetch(endpoint.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    console.warn(
      `[og-image] Skipping ${url}: service returned ${response.status} ${response.statusText}`,
    );
    return false;
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    console.warn(`[og-image] Skipping ${url}: service response was not valid JSON`);
    return false;
  }

  if (!payload || typeof payload.image !== "string") {
    return false;
  }

  return payload.image;
}

async function hasSuccessfulImageResponse(imageUrl) {
  try {
    let response = await fetch(imageUrl, {
      method: "HEAD",
      redirect: "follow",
    });

    if (response.ok) {
      return true;
    }

    // Some hosts block HEAD even when the image exists.
    if (response.status === 405 || response.status === 501) {
      response = await fetch(imageUrl, {
        method: "GET",
        redirect: "follow",
        headers: {
          Range: "bytes=0-0",
        },
      });

      return response.ok;
    }

    return false;
  } catch {
    return false;
  }
}

function writeToCache(url, value, cache) {
  cache = cache || CACHE_FILE_PATH;
  // make sure we don’t write more than once
  if (!(url in og_images)) {
    value = value === false ? true : value;
    value = value === true || value == 404 ? value : `"${encodeURI(value)}"`;
    og_images[url] = value;
    fs.appendFile(cache, `${url}: ${value}\n`, (err) => {
      if (err) throw err;
      console.log(`>>> Opengraph images for ${url} cached`);
    });
  }
}

function is404ing(url) {
  return url in cached404s;
}

function archived(data) {
  let archive_url = "https://web.archive.org/web/{{ DATE }}/{{ URL }}";
  let month = data.date.getUTCMonth() + 1;
  month = month < 10 ? "0" + month : month;
  let day = data.date.getDay();
  day = day < 10 ? "0" + day : day;
  archive_url = archive_url
    .replace("{{ DATE }}", `${data.date.getUTCFullYear()}${month}${day}`)
    .replace("{{ URL }}", data.ref_url);
  return archive_url;
}

export default {
  layout: "layouts/link.njk",
  permalink: "/notebook/{{ page.filePathStem }}/",
  body_class: "link",
  eleventyComputed: {
    is_404: (data) => {
      return is404ing(data.ref_url);
    },
    archived: (data) => {
      return is404ing(data.ref_url) ? archived(data) : false;
    },
    og_image: async (data) => {
      const url = data.ref_url;
      if (url in og_images) {
        const cachedValue = og_images[url];
        if (
          cachedValue === true ||
          cachedValue === "false" ||
          cachedValue === "404"
        ) {
          return false;
        }

        return (
          normalizeOgImageUrl(decodeURI(String(cachedValue)), url) || false
        );
      } else {
        // don’t run if the limits have already been reached
        // no point checking 404s
        if ("is_404" in data) {
          return false;
        }

        let og_image = false;
        // Try to parse the open graph data
        if (process.env.WEBMENTION_APP_TOKEN) {
          try {
            const rawOgImage = await fetchOgImageFromService(url);
            const normalizedOgImage = normalizeOgImageUrl(rawOgImage, url);

            if (normalizedOgImage) {
              const isSuccessful = await hasSuccessfulImageResponse(
                normalizedOgImage,
              );
              if (isSuccessful) {
                og_image = normalizedOgImage;
              } else {
                console.warn(
                  `[og-image] Skipping ${url}: image URL returned non-success response (${normalizedOgImage})`,
                );
              }
            }

            writeToCache(url, og_image);
          } catch (e) {
            console.log("Error with the OG Image service", e);
          }
        } else {
          // Skip OG image fetching if token is not available (local dev)
          console.log(
            `Skipping OG image fetch for ${url} (no WEBMENTION_APP_TOKEN)`,
          );
        }

        return og_image;
      }
    },
  },
};
