import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import {
	postSlugFromPath,
	shareCardOptions,
} from "../../_11ty/share-card-config.js";

export function parseFrontmatter(source, filePath) {
	const newline = source.includes("\r\n") ? "\r\n" : "\n";
	const lines = source.split(/\r?\n/);
	if (lines[0] !== "---") {
		throw new Error(`Missing frontmatter in ${filePath}`);
	}

	const closingLine = lines.indexOf("---", 1);
	if (closingLine < 0) {
		throw new Error(`Unclosed frontmatter in ${filePath}`);
	}

	const raw = lines.slice(1, closingLine).join(newline);
	const data = yaml.load(raw, { filename: filePath }) || {};
	return { data, closingLine, lines, newline };
}

export function insertImageFrontmatter(source, image, filePath) {
	const { data, closingLine, lines, newline } = parseFrontmatter(
		source,
		filePath,
	);
	if (data.image) {
		return source;
	}

	lines.splice(closingLine, 0, `image: "${image}"`);
	return lines.join(newline);
}

function writeFileAtomically(filePath, contents) {
	const temporary = `${filePath}.tmp-${process.pid}`;
	const mode = fs.statSync(filePath).mode & 0o7777;
	fs.writeFileSync(temporary, contents, { mode });
	fs.chmodSync(temporary, mode);
	fs.renameSync(temporary, filePath);
}

export function syncPostImages({
	postsDir = "src/posts",
	outputDir = shareCardOptions.outputDir,
	outputUrlPath = shareCardOptions.outputUrlPath,
	dryRun = false,
	validateOutput = true,
} = {}) {
	const files = fs
		.readdirSync(postsDir)
		.filter((file) => file.endsWith(".md"))
		.sort();
	const summary = {
		posts: files.length,
		updated: 0,
		skipped: 0,
		missingOutputs: [],
	};

	for (const file of files) {
		const filePath = path.join(postsDir, file);
		const source = fs.readFileSync(filePath, "utf8");
		const { data } = parseFrontmatter(source, filePath);
		if (data.image) {
			summary.skipped++;
			continue;
		}

		const slug = postSlugFromPath(file);
		const image = `${outputUrlPath.replace(/\/$/, "")}/${slug}.jpg`;
		const output = path.join(outputDir, `${slug}.jpg`);
		if (!fs.existsSync(output)) {
			summary.missingOutputs.push(output);
			if (validateOutput) {
				continue;
			}
		}

		const updated = insertImageFrontmatter(source, image, filePath);
		if (!dryRun) {
			writeFileAtomically(filePath, updated);
		}
		summary.updated++;
	}

	if (validateOutput && summary.missingOutputs.length > 0) {
		throw new Error(
			`Missing ${summary.missingOutputs.length} generated share card(s):\n${summary.missingOutputs.join("\n")}`,
		);
	}

	return summary;
}
