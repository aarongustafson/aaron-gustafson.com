import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import yaml from "js-yaml";
import {
	contentExcerptSource,
	metadataTargets,
	plainText,
	resolveMetadata,
} from "../../_11ty/metadata.js";

const CONTENT_EXTENSIONS = new Set([".md", ".html", ".njk"]);
const EXCLUDED_DIRECTORIES = new Set([
	"_data",
	"_drafts",
	"_images",
	"_includes",
	"_javascript",
	"_styles",
	"appearances",
	"errors",
	"experiments",
	"feeds",
	"links",
	"posts",
	"publications",
	"static",
	"talks",
	"tanks",
	"temp",
]);

function splitFrontMatter(source, filePath) {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
	if (!match) {
		return { data: {}, body: source };
	}

	return {
		data: yaml.load(match[1], { filename: filePath }) || {},
		body: source.slice(match[0].length),
	};
}

function walk(directory, includeDirectory = () => true) {
	const files = [];
	for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
		const entryPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			if (includeDirectory(entry.name, entryPath)) {
				files.push(...walk(entryPath, includeDirectory));
			}
			continue;
		}
		if (entry.isFile() && CONTENT_EXTENSIONS.has(path.extname(entry.name))) {
			files.push(entryPath);
		}
	}
	return files;
}

function standaloneFiles(root) {
	const src = path.join(root, "src");
	return walk(
		src,
		(name, directory) =>
			directory === src ||
			(!name.startsWith("_") && !EXCLUDED_DIRECTORIES.has(name)),
	).filter((filePath) => {
		const relative = path.relative(src, filePath);
		const firstSegment = relative.split(path.sep)[0];
		return !EXCLUDED_DIRECTORIES.has(firstSegment);
	});
}

export function collectMetadataFiles(root = process.cwd()) {
	const posts = walk(path.join(root, "src/posts"));
	const links = walk(path.join(root, "src/links"));
	return [...posts, ...links, ...standaloneFiles(root)].sort();
}

function contentType(filePath, root) {
	const relative = path.relative(path.join(root, "src"), filePath);
	if (relative.startsWith(`posts${path.sep}`)) return "post";
	if (relative.startsWith(`links${path.sep}`)) return "link";
	return "page";
}

function pageUrl(filePath, root, type) {
	const src = path.join(root, "src");
	const relative = path.relative(src, filePath);
	const extension = path.extname(relative);
	const stem = relative.slice(0, -extension.length).replaceAll(path.sep, "/");
	const filename = path.basename(stem).replace(/^\d{4}-\d{2}-\d{2}-/, "");
	if (type === "post") {
		return `/notebook/${filename}/`;
	}
	if (type === "link") {
		return `/notebook/links/${filename}/`;
	}
	if (filename === "index") {
		const directory = path.dirname(stem).replaceAll(path.sep, "/");
		return directory === "." ? "/" : `/${directory}/`;
	}
	return `/${stem.replace(/\.html$/, "")}/`;
}

function siteData(root) {
	return JSON.parse(
		fs.readFileSync(path.join(root, "src/_data/site.json"), "utf8"),
	);
}

export function readMetadataRecord(filePath, root = process.cwd()) {
	const absolutePath = path.resolve(filePath);
	const source = fs.readFileSync(absolutePath, "utf8");
	const { data, body } = splitFrontMatter(source, absolutePath);
	const type = contentType(absolutePath, root);
	const excerptBody =
		type !== "page" || body.includes("<!-- more -->") ? body : "";
	const excerpt = contentExcerptSource(excerptBody);
	const resolved = resolveMetadata({
		...data,
		excerpt,
		body_class: type,
		is_post: type !== "page",
		page: { url: pageUrl(absolutePath, root, type) },
		site: siteData(root),
	});
	const values = {
		meta_description: resolved.metaDescription,
		social_description: resolved.socialDescription,
	};
	const targets = {
		meta_description: metadataTargets.metaDescription,
		social_description: metadataTargets.socialDescription,
	};
	const overLimit = Object.keys(values).filter(
		(field) => [...values[field]].length > targets[field],
	);

	return {
		filePath: absolutePath,
		relativePath: path.relative(root, absolutePath),
		url: resolved.canonicalUrl,
		contentType: type,
		title: plainText(data.title || ""),
		values,
		targets,
		overLimit,
	};
}

export function auditMetadataFiles(files, root = process.cwd()) {
	return files.map((filePath) => readMetadataRecord(filePath, root));
}

function newestFile(root, type) {
	const directory = path.join(root, "src", type);
	const files = walk(directory);
	if (files.length === 0) {
		throw new Error(`No publishable content found in ${directory}`);
	}
	return files.sort(
		(a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs,
	)[0];
}

function csvCell(value) {
	const text = String(value ?? "");
	return `"${text.replaceAll('"', '""')}"`;
}

export function writeAuditCsv(records, outputPath) {
	const fields = [
		"source_path",
		"url",
		"content_type",
		"page_title",
		"over_limit_fields",
		"current_meta_description",
		"current_meta_description_count",
		"meta_description_target",
		"proposed_meta_description",
		"proposed_meta_description_count",
		"current_social_description",
		"current_social_description_count",
		"social_description_target",
		"proposed_social_description",
		"proposed_social_description_count",
		"review_status",
		"review_notes",
	];
	const rows = records
		.filter((record) => record.overLimit.length > 0)
		.map((record) => {
			const value = record.values;
			const target = record.targets;
			return [
				record.relativePath,
				record.url,
				record.contentType,
				record.title,
				record.overLimit.join("|"),
				value.meta_description,
				[...value.meta_description].length,
				target.meta_description,
				"",
				"",
				value.social_description,
				[...value.social_description].length,
				target.social_description,
				"",
				"",
				"pending",
				"",
			];
		});
	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(
		outputPath,
		`${fields.map(csvCell).join(",")}\n${rows
			.map((row) => row.map(csvCell).join(","))
			.join("\n")}\n`,
	);
	return rows.length;
}

function printWarnings(records) {
	const warnings = records.filter((record) => record.overLimit.length > 0);
	for (const record of warnings) {
		console.warn(`Metadata length advisory: ${record.relativePath}`);
		for (const field of record.overLimit) {
			const count = [...record.values[field]].length;
			console.warn(
				`  - ${field}: ${count}/${record.targets[field]} characters`,
			);
		}
	}
	console.log(
		`Audited ${records.length} file${records.length === 1 ? "" : "s"}; ${warnings.length} exceeded an advisory target.`,
	);
}

function runCli() {
	const root = process.cwd();
	const args = process.argv.slice(2);
	const latestIndex = args.indexOf("--latest");
	const csvIndex = args.indexOf("--csv");
	let files;
	if (latestIndex !== -1) {
		const type = args[latestIndex + 1];
		if (!["posts", "links"].includes(type)) {
			throw new Error("--latest must be followed by posts or links");
		}
		files = [newestFile(root, type)];
	} else {
		const targets = args.filter(
			(argument, index) => argument !== "--csv" && index !== csvIndex + 1,
		);
		files =
			targets.length > 0
				? targets.flatMap((target) => {
						const resolved = path.resolve(target);
						return fs.statSync(resolved).isDirectory()
							? walk(resolved)
							: [resolved];
					})
				: collectMetadataFiles(root);
	}

	const records = auditMetadataFiles(files, root);
	printWarnings(records);
	if (csvIndex !== -1) {
		const outputPath = path.resolve(args[csvIndex + 1]);
		const count = writeAuditCsv(records, outputPath);
		console.log(
			`Wrote ${count} over-limit record${count === 1 ? "" : "s"} to ${outputPath}.`,
		);
	}
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
