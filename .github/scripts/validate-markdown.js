import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import yaml from "js-yaml";
import markdownIt from "markdown-it";
import markdownit_attrs from "markdown-it-attrs";
import markdownit_footnote from "markdown-it-footnote";

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: false,
})
  .use(markdownit_attrs)
  .use(markdownit_footnote);

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

function splitFrontMatter(source, filePath) {
  if (!source.startsWith("---\n")) {
    return { frontMatter: null, body: source };
  }

  const endMarker = "\n---\n";
  const endIndex = source.indexOf(endMarker, 4);
  if (endIndex === -1) {
    throw new Error(`Unclosed front matter block in ${filePath}`);
  }

  return {
    frontMatter: source.slice(4, endIndex),
    body: source.slice(endIndex + endMarker.length),
  };
}

function validateFile(filePath) {
  const source = readFileSync(filePath, "utf8");
  const { frontMatter, body } = splitFrontMatter(source, filePath);

  if (frontMatter !== null) {
    yaml.load(frontMatter, { filename: filePath });
  }

  md.render(body);
}

function runCli() {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args : ["src"];
  const files = [...new Set(targets.flatMap((target) => collectMarkdownFiles(target)))];
  const failures = [];

  for (const filePath of files) {
    try {
      validateFile(filePath);
    } catch (error) {
      failures.push({
        filePath,
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }

  if (failures.length === 0) {
    console.log(`Validated ${files.length} Markdown file${files.length === 1 ? "" : "s"}.`);
    return;
  }

  console.error(`Markdown validation failed for ${failures.length} file${failures.length === 1 ? "" : "s"}:`);
  for (const failure of failures) {
    console.error(`- ${path.relative(process.cwd(), failure.filePath)}`);
    console.error(`  ${failure.error.message}`);
  }

  process.exitCode = 1;
}

const entryPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;

if (entryPath && import.meta.url === entryPath) {
  runCli();
}