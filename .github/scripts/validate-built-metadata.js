import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

function htmlFiles(directory) {
	return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const entryPath = path.join(directory, entry.name);
		if (entry.isDirectory()) return htmlFiles(entryPath);
		return entry.isFile() && entry.name.endsWith(".html") ? [entryPath] : [];
	});
}

function quotedMeta(html, attribute, value) {
	const pattern = new RegExp(
		`<meta\\s+${attribute}="${value.replaceAll(":", "\\:")}"\\s+content="([^"]*)"`,
		"i",
	);
	return html.match(pattern)?.[1];
}

function validateFile(filePath) {
	const html = fs.readFileSync(filePath, "utf8");
	if (
		!/<head[\s>]/i.test(html) ||
		!/<html[^>]+id="aaron-gustafson_com"/i.test(html) ||
		!/<meta\s+name="view-transition"/i.test(html)
	) {
		return null;
	}
	const errors = [];
	for (const property of ["og:title", "og:type", "og:url", "og:image"]) {
		if (!quotedMeta(html, "property", property)) {
			errors.push(`missing quoted ${property}`);
		}
	}
	for (const property of ["og:description", "og:site_name", "og:image:alt"]) {
		if (!quotedMeta(html, "property", property)) {
			errors.push(`missing quoted ${property}`);
		}
	}
	for (const name of [
		"description",
		"twitter:card",
		"twitter:title",
		"twitter:description",
		"twitter:image",
		"twitter:image:alt",
	]) {
		if (!quotedMeta(html, "name", name)) {
			errors.push(`missing quoted ${name}`);
		}
	}
	const canonical = html.match(
		/<link\s+rel="canonical"\s+href="([^"]+)"/i,
	)?.[1];
	if (!canonical?.startsWith("https://")) {
		errors.push("canonical URL is missing, unquoted, or non-absolute");
	}
	const image = quotedMeta(html, "property", "og:image");
	if (
		image?.includes("/i/share-cards/") ||
		image?.endsWith("/i/share-card.jpg")
	) {
		if (!quotedMeta(html, "property", "og:image:type")) {
			errors.push("known image is missing quoted og:image:type");
		}
		if (quotedMeta(html, "property", "og:image:width") !== "1200") {
			errors.push("generated image width is not 1200");
		}
		if (quotedMeta(html, "property", "og:image:height") !== "630") {
			errors.push("generated image height is not 630");
		}
	}
	return errors;
}

function runCli() {
	const target = path.resolve(process.argv[2] || "dist");
	const files = fs.statSync(target).isDirectory()
		? htmlFiles(target)
		: [target];
	const results = files
		.map((filePath) => ({ filePath, errors: validateFile(filePath) }))
		.filter((result) => result.errors !== null);
	const failures = results.filter((result) => result.errors.length > 0);
	if (failures.length > 0) {
		for (const failure of failures) {
			console.error(path.relative(process.cwd(), failure.filePath));
			for (const error of failure.errors) console.error(`  - ${error}`);
		}
		process.exitCode = 1;
		return;
	}
	console.log(
		`Validated metadata in ${results.length} HTML file${results.length === 1 ? "" : "s"}.`,
	);
}

const entryPath = process.argv[1]
	? pathToFileURL(path.resolve(process.argv[1])).href
	: null;

if (entryPath && import.meta.url === entryPath) {
	try {
		runCli();
	} catch (error) {
		console.error(error instanceof Error ? error.message : String(error));
		process.exitCode = 1;
	}
}
