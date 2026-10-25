import fs from "node:fs";
import { compile } from "html-to-text";
import MarkdownIt from "markdown-it";
import attrs from "markdown-it-attrs";
import footnote from "markdown-it-footnote";

const markdown = new MarkdownIt({ html: true }).use(attrs).use(footnote);
markdown.renderer.rules.text = (tokens, index) =>
	markdown.utils.escapeHtml(tokens[index].content.replace(/\[\^[^\]]+\]/g, ""));
markdown.renderer.rules.footnote_ref = () => "";
markdown.core.ruler.after("footnote_tail", "metadata_footnotes", (state) => {
	const start = state.tokens.findIndex(
		(token) => token.type === "footnote_block_open",
	);
	if (start !== -1) state.tokens.length = start;
});
// Preserve Markdown image descriptions, but continue skipping raw HTML images.
markdown.renderer.rules.image = (tokens, index, options, env, renderer) =>
	renderer.renderInline(tokens[index].children, options, env);

const htmlToPlainText = compile({
	wordwrap: false,
	selectors: [
		{ selector: "a", options: { ignoreHref: true } },
		{ selector: "img", format: "skip" },
		...["h1", "h2", "h3", "h4", "h5", "h6"].map((selector) => ({
			selector,
			options: { uppercase: false },
		})),
	],
});

export const metadataTargets = Object.freeze({
	metaDescription: 160,
	socialDescription: 200,
});

export function plainText(value = "") {
	return htmlToPlainText(markdown.render(String(value)))
		.replace(/\s+/g, " ")
		.trim();
}

export function contentExcerptSource(body = "") {
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
	return paragraphs[0] || "";
}

export function contentExcerpt(body = "") {
	return plainText(contentExcerptSource(body));
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
	const rawTitle = data.title ? plainText(data.title) : siteName;
	const socialTitle = rawTitle || siteName;
	const divider = data.title_divider || " :: ";
	const documentTitle =
		rawTitle && rawTitle !== siteName
			? `${rawTitle}${divider}${siteName}`
			: siteName;
	const canUseSourceExcerpt =
		data.is_post || ["post", "link"].includes(data.body_class);
	const excerptSource = data.excerpt || data.page?.excerpt;
	const excerpt = excerptSource
		? plainText(excerptSource)
		: canUseSourceExcerpt
			? sourceExcerpt(data.page?.inputPath)
			: "";
	const fallbackDescription = plainText(site.description || "");
	const metaSource = data.meta_description || data.description;
	const socialSource = data.social_description || metaSource;
	const metaDescription = metaSource
		? plainText(metaSource)
		: excerpt || fallbackDescription;
	const socialDescription = socialSource
		? plainText(socialSource)
		: excerpt || fallbackDescription;
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
	const imageAltSource =
		data.image_alt ||
		data.social_image_alt ||
		data.hero?.alt ||
		(isSiteLogo ? site.social_image_alt || site.logo_alt : "");
	const imageAlt = imageAltSource
		? plainText(imageAltSource)
		: isGeneratedCard
			? `A share card with a crocheted doll of Aaron Gustafson and the title “${socialTitle}”.`
			: `Preview image for ${socialTitle}.`;
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
