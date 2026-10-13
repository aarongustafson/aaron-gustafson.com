# This is Aaron Gustafson’s website

You can view it at [aaron-gustafson.com](https://www.aaron-gustafson.com).

## Getting started

Install the project dependencies:

```sh
npm install
```

Then start the local authoring server:

```sh
npm start
```

The site is built with Eleventy and Gulp. Most day-to-day work can be done with
the commands below.

## A typical authoring and publishing workflow

1. **Create content.** Use one of the `new:*` commands to scaffold a draft or
   content item.
2. **Write and preview.** Run `npm start` while editing. This skips share-card
   generation so incremental rebuilds stay fast.
3. **Check the work.** Run `npm run prose:fix`, `npm run markdown:check`, and
   `npm test`.
4. **Publish a draft.** Use `npm run publish:post` or
   `npm run publish:link` to move the selected draft into its published
   collection. Publishing a post also generates its share card and persists the
   card path in frontmatter.
5. **Build and deploy.** Run `npm run build` for a production build. A
   successful Netlify deployment triggers the syndication workflow, which
   shares newly published posts and links.

## Creating content

These interactive Plop generators create files from the project templates and
open them for editing:

| Command | Creates |
| --- | --- |
| `npm run new:post` | A blog post draft |
| `npm run new:link` | A link-post draft |
| `npm run new:event` | A speaking engagement |
| `npm run new:talk` | A talk |
| `npm run new:article` | An article appearance |
| `npm run new:book` | A book |
| `npm run new:podcast` | A podcast appearance |
| `npm run new:press` | A press appearance |
| `npm run new:citation` | A citation |

## Previewing the site

| Command | What it does |
| --- | --- |
| `npm start` | Builds assets, watches for changes, and serves Eleventy incrementally. Share-card generation is skipped for faster, more stable authoring. |
| `npm run start:cards` | Runs the same local server with share-card generation enabled. Use this when actively working on card layouts or generation. |
| `npm run netlify:dev` | Runs the site through Netlify Dev when local testing requires Netlify behavior. |
| `npm run serve` | Serves the existing `dist` directory at `http://127.0.0.1:8888` without rebuilding it. |

## Checking content and code

| Command | What it does |
| --- | --- |
| `npm run prose:fix` | Rewrites drafts and posts to use the project’s preferred typographic punctuation. Review the resulting changes before committing them. |
| `npm run prose:check` | Checks drafts and posts for punctuation that `prose:fix` would change, without modifying files. This check also runs in GitHub Actions. |
| `npm run markdown:check` | Validates Markdown and frontmatter throughout `src`. |
| `npm test` | Runs the Node test suite for site output, share cards, syndication, and supporting scripts. |
| `npm run debug` | Runs an Eleventy dry run with debug logging when a build or data-cascade issue needs investigation. |

## Managing share cards

Every post has one root-relative `image` value in frontmatter:
`/i/share-cards/<post-slug>.jpg`. External metadata and feeds turn that path
into an absolute production URL.

| Command | What it does |
| --- | --- |
| `npm run share-cards:dry-run` | Reports how many posts need an `image` value. It does not build cards or modify files. |
| `npm run share-cards:sync` | Builds missing text- or hero-based cards, verifies the output, and adds missing `image` values to post frontmatter. Existing image values and cards are left alone. |
| `npm run share-cards:force` | Clears the text and hero card caches, regenerates every card, verifies the output, and synchronizes frontmatter. Use this after changing card dimensions, design, cropping behavior, or generation code. |

Generated cards live in `src/static/i/share-cards`. Hero-based cards are
1280×669 JPEG derivatives; their original hero images are not modified.

## Publishing drafts

| Command | What it does |
| --- | --- |
| `npm run publish:post` | Prompts for a draft, moves it into the posts collection, then generates and synchronizes its share card. |
| `npm run publish:link` | Prompts for a draft and moves it into the links collection. |

Publishing a file does not deploy it by itself. Commit and push the resulting
changes through the normal Git workflow. After Netlify successfully deploys
`main`, GitHub Actions checks the live feeds and syndicates new content.

## Building and maintenance

| Command | What it does |
| --- | --- |
| `npm run build` | Runs the complete production build. The `prebuild` and `postbuild` lifecycle scripts run automatically before and after Eleventy. |
| `npm run build:fast` | Runs an incremental production build. This is useful for iteration, but a complete build is the safer final verification. |
| `npm run build:dev` | Runs a non-production Eleventy build without starting a server or watcher. |
| `npm run prebuild` | Runs the Gulp tasks that prepare assets for a production build. Normally invoked automatically by `npm run build`. |
| `npm run postbuild` | Runs the Gulp tasks that finish the built site. Normally invoked automatically by `npm run build`. |
| `npm run clean` | Removes and recreates `dist`. |
| `npm run clean:cache` | Removes the processed webmention caches so they can be rebuilt. |
| `npm run clean:full` | Clears both the processed webmention caches and `dist`. |
