import fs from "node:fs";
import { convert } from "html-to-text";

export const metadataTargets = Object.freeze({
	metaDescription: 160,
	socialDescription: 200,
});

export function plainText(value = "") {
	const markdown = String(value)
		.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/[*_~]+/g, "")
		.replace(/\[\^\d+\]/g, "");

	return convert(markdown, {
		wordwrap: false,
		selectors: [
			{ selector: "a", options: { ignoreHref: true } },
			{ selector: "img", format: "skip" },
		],
	})
		.replace(/\s+/g, " ")
		.trim();
}

export function contentExcerpt(body = "") {
	const beforeMarker = String(body).split("<!-- more -->", 1)[0];
	const paragraphs = beforeMarker
		.split(/\r?\n\s*\r?\n/)
		.map((paragraph) => paragraph.trim())
		.filter(
			(paragraph) =>
				paragraph &&
				!paragraph.startsWith("<!--") &&
				!paragraph.startsWith("{%"),
		);
	return plainText(paragraphs[0] || "");
}

function sourceExcerpt(inputPath) {
	if (!inputPath) return "";
	const source = fs.readFileSync(inputPath, "utf8");
	const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "");
	return contentExcerpt(body);
}

function absoluteUrl(value, baseUrl) {
	if (!value) {
		return "";
	}
	return new URL(String(value), baseUrl).toString();
}

function imageType(image) {
	const pathname = image ? new URL(image).pathname.toLowerCase() : "";
	if (pathname.endsWith(".png")) return "image/png";
	if (pathname.endsWith(".webp")) return "image/webp";
	if (pathname.endsWith(".gif")) return "image/gif";
	if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) {
		return "image/jpeg";
	}
	return undefined;
}

function positiveInteger(value) {
	const number = Number.parseInt(value, 10);
	return Number.isInteger(number) && number > 0 ? number : undefined;
}

export function resolveMetadata(data = {}, { fallbackImage } = {}) {
	const site = data.site || {};
	const siteUrl = site.url || "";
	const siteName = plainText(site.title || "Aaron Gustafson");
	const rawTitle = plainText(data.title || siteName);
	const socialTitle = rawTitle || siteName;
	const divider = data.title_divider || " :: ";
	const documentTitle =
		rawTitle && rawTitle !== siteName
			? `${rawTitle}${divider}${siteName}`
			: siteName;
	const canUseSourceExcerpt =
		data.is_post || ["post", "link"].includes(data.body_class);
	const excerpt = plainText(
		data.excerpt ||
			data.page?.excerpt ||
			(canUseSourceExcerpt ? sourceExcerpt(data.page?.inputPath) : ""),
	);
	const fallbackDescription = plainText(site.description || "");
	const metaDescription = plainText(
		data.meta_description || data.description || excerpt || fallbackDescription,
	);
	const socialDescription = plainText(
		data.social_description ||
			data.meta_description ||
			data.description ||
			excerpt ||
			fallbackDescription,
	);
	const canonicalUrl = absoluteUrl(
		data.canonical_url || data.page?.url || "/",
		siteUrl,
	);
	const rawImage =
		data.social_image ||
		data.image ||
		data.og_image ||
		fallbackImage ||
		site.social_image ||
		site.logo;
	const image = absoluteUrl(rawImage, siteUrl);
	const isGeneratedCard = image.includes("/i/share-cards/");
	const isSiteLogo =
		image &&
		((site.social_image && image === absoluteUrl(site.social_image, siteUrl)) ||
			(site.logo && image === absoluteUrl(site.logo, siteUrl)));
	const imageWidth =
		positiveInteger(data.image_width || data.social_image_width) ||
		(isGeneratedCard ? 1200 : undefined) ||
		(isSiteLogo
			? positiveInteger(site.social_image_width || site.logo_width)
			: undefined);
	const imageHeight =
		positiveInteger(data.image_height || data.social_image_height) ||
		(isGeneratedCard ? 630 : undefined) ||
		(isSiteLogo
			? positiveInteger(site.social_image_height || site.logo_height)
			: undefined);
	const imageAlt = plainText(
		data.image_alt ||
			data.social_image_alt ||
			data.hero?.alt ||
			(isSiteLogo ? site.social_image_alt || site.logo_alt : "") ||
			(isGeneratedCard
				? `A share card with a crocheted doll of Aaron Gustafson and the title “${socialTitle}”.`
				: `Preview image for ${socialTitle}.`),
	);
	const type =
		data.ogtype ||
		(data.is_post || ["post", "link"].includes(data.body_class)
			? "article"
			: "website");

	return {
		documentTitle,
		socialTitle,
		metaDescription,
		socialDescription,
		canonicalUrl,
		type,
		siteName,
		locale: site.lang || "en_US",
		image,
		imageAlt,
		imageWidth,
		imageHeight,
		imageType: image ? imageType(image) : undefined,
		twitterCard: image ? "summary_large_image" : "summary",
		twitterSite: site.twitter?.username || "",
	};
}
