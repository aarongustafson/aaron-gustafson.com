import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DISPLAY_FRONTMATTER_KEYS = new Set([
	"title",
	"description",
	"twitter_text",
	"subtitle",
	"name",
	"alt",
	"credit",
	"caption",
	"excerpt",
	"summary",
]);

function maskSegments(text) {
	const masked = [];
	let output = text;

	const patterns = [
		/`[^`]*`/g,
		/\{\{[\s\S]*?\}\}/g,
		/\{%[\s\S]*?%\}/g,
		/\{#[\s\S]*?#\}/g,
		/<[^>]+>/g,
		/https?:\/\/[^\s)]+/g,
	];

	for (const pattern of patterns) {
		output = output.replace(pattern, (match) => {
			const token = `\u0000${masked.length}\u0000`;
			masked.push(match);
			return token;
		});
	}

	return { output, masked };
}

function unmaskSegments(text, masked) {
	return text.replace(/\u0000(\d+)\u0000/g, (_match, index) => masked[Number(index)]);
}

function isOpeningQuote(previous) {
	return !previous || /[\s([{\u2014\u2013]/u.test(previous);
}

function typographPlainText(text) {
	const { output, masked } = maskSegments(text);
	let result = "";

	for (let index = 0; index < output.length; index += 1) {
		const character = output[index];
		const previous = result.at(-1) ?? "";
		const next = output[index + 1] ?? "";

		if (character === "'" && /[\p{L}\p{N}]/u.test(previous) && /[\p{L}\p{N}]/u.test(next)) {
			result += "’";
			continue;
		}

		if (character === '"') {
			result += isOpeningQuote(previous) ? "“" : "”";
			continue;
		}

		if (character === "'") {
			result += isOpeningQuote(previous) ? "‘" : "’";
			continue;
		}

		result += character;
	}

	result = result.replace(/\s--\s/g, " — ");

	return unmaskSegments(result, masked);
}

function typographFrontmatterLine(line) {
	const match = line.match(/^(\s*)([A-Za-z0-9_-]+)(\s*:\s*)"([^"]*)"(\s*)$/u);
	if (!match) {
		return line;
	}

	const [, indent, key, separator, value, suffix] = match;
	if (!DISPLAY_FRONTMATTER_KEYS.has(key)) {
		return line;
	}

	return `${indent}${key}${separator}"${typographPlainText(value)}"${suffix}`;
}

export function typographMarkdown(content) {
	const lines = content.split("\n");
	const updated = [];
	let inFrontmatter = lines[0] === "---";
	let inFence = false;

	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index];

		if (index === 0 && line === "---") {
			updated.push(line);
			continue;
		}

		if (inFrontmatter) {
			if (line === "---") {
				inFrontmatter = false;
				updated.push(line);
				continue;
			}

			updated.push(typographFrontmatterLine(line));
			continue;
		}

		if (/^```/u.test(line)) {
			inFence = !inFence;
			updated.push(line);
			continue;
		}

		if (inFence || /^\s{4,}/u.test(line)) {
			updated.push(line);
			continue;
		}

		updated.push(typographPlainText(line));
	}

	return updated.join("\n");
}

function collectMarkdownFiles(targetPath) {
	const absolutePath = path.resolve(targetPath);
	const stats = statSync(absolutePath);

	if (stats.isFile()) {
		return absolutePath.endsWith(".md") ? [absolutePath] : [];
	}

	const files = [];
	for (const entry of readdirSync(absolutePath, { withFileTypes: true })) {
		if (entry.name.startsWith(".")) {
			continue;
		}

		const entryPath = path.join(absolutePath, entry.name);
		if (entry.isDirectory()) {
			files.push(...collectMarkdownFiles(entryPath));
			continue;
		}

		if (entry.isFile() && entry.name.endsWith(".md")) {
			files.push(entryPath);
		}
	}

	return files;
}

export function processMarkdownFiles(targets, { write = false } = {}) {
	const files = [...new Set(targets.flatMap((target) => collectMarkdownFiles(target)))];
	const changedFiles = [];

	for (const filePath of files) {
		const original = readFileSync(filePath, "utf8");
		const updated = typographMarkdown(original);

		if (original === updated) {
			continue;
		}

		if (write) {
			writeFileSync(filePath, updated, "utf8");
		}

		changedFiles.push(filePath);
	}

	return changedFiles;
}

function runCli() {
	const args = process.argv.slice(2);
	const write = args.includes("--write");
	const targets = args.filter((arg) => !arg.startsWith("--"));
	const selectedTargets = targets.length > 0 ? targets : ["src/_drafts", "src/posts"];
	const changedFiles = processMarkdownFiles(selectedTargets, { write });

	if (changedFiles.length === 0) {
		console.log("No typographic punctuation changes needed.");
		return;
	}

	const action = write ? "Updated" : "Needs typographic punctuation review";
	for (const filePath of changedFiles) {
		console.log(`${action}: ${path.relative(process.cwd(), filePath)}`);
	}

	if (!write) {
		process.exitCode = 1;
	}
}

const entryPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;

if (entryPath && import.meta.url === entryPath) {
	runCli();
}