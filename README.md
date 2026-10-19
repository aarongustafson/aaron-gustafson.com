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

| Command                | Creates               |
| ---------------------- | --------------------- |
| `npm run new:post`     | A blog post draft     |
| `npm run new:link`     | A link-post draft     |
| `npm run new:event`    | A speaking engagement |
| `npm run new:talk`     | A talk                |
| `npm run new:article`  | An article appearance |
| `npm run new:book`     | A book                |
| `npm run new:podcast`  | A podcast appearance  |
| `npm run new:press`    | A press appearance    |
| `npm run new:citation` | A citation            |

## Previewing the site

| Command               | What it does                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm start`           | Builds assets, watches for changes, and serves Eleventy incrementally. Share-card generation is skipped for faster, more stable authoring. |
| `npm run start:cards` | Runs the same local server with share-card generation enabled. Use this when actively working on card layouts or generation.               |
| `npm run netlify:dev` | Runs the site through Netlify Dev when local testing requires Netlify behavior.                                                            |
| `npm run serve`       | Serves the existing `dist` directory at `http://127.0.0.1:8888` without rebuilding it.                                                     |

## Checking content and code

| Command                        | What it does                                                                                                                            |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run prose:fix`            | Rewrites drafts and posts to use the project’s preferred typographic punctuation. Review the resulting changes before committing them.  |
| `npm run prose:check`          | Checks drafts and posts for punctuation that `prose:fix` would change, without modifying files. This check also runs in GitHub Actions. |
| `npm run markdown:check`       | Validates Markdown and frontmatter throughout `src`.                                                                                    |
| `npm run metadata:check`       | Reports advisory search and social metadata length issues without failing the build.                                                    |
| `npm run metadata:check:built` | Validates required, quoted metadata and known image properties in a production build.                                                   |
| `npm test`                     | Runs the Node test suite for site output, share cards, syndication, and supporting scripts.                                             |
| `npm run debug`                | Runs an Eleventy dry run with debug logging when a build or data-cascade issue needs investigation.                                     |

## Managing share cards

Every post has one root-relative `image` value in frontmatter:
`/i/share-cards/<post-slug>.jpg`. External metadata and feeds turn that path
into an absolute production URL.

| Command                       | What it does                                                                                                                                                                                             |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run share-cards:dry-run` | Reports how many posts need an `image` value. It does not build cards or modify files.                                                                                                                   |
| `npm run share-cards:sync`    | Builds missing text- or hero-based cards, verifies the output, and adds missing `image` values to post frontmatter. Existing image values and cards are left alone.                                      |
| `npm run share-cards:force`   | Clears the text and hero card caches, regenerates every card, verifies the output, and synchronizes frontmatter. Use this after changing card dimensions, design, cropping behavior, or generation code. |
| `npm run share-cards:post -- src/posts/YYYY-MM-DD-slug.md` | Generates or refreshes only that post’s text- or hero-based card and adds its missing `image` value, without building the site. Preserves custom images. |

The single-post command rebuilds the selected text card and reuses unchanged
hero cards. Add `--force` to regenerate a hero card too, without clearing other
cards’ cache entries, or `--dry-run` to report the selected post’s missing
image field without writing.
You can also pass `--post <path>` to the sync, force, and dry-run commands.

Generated cards live in `src/static/i/share-cards`. Hero-based cards are
1200×630 JPEG derivatives; their original hero images are not modified.

HTML pages without a `social_image`, `image`, or `og_image` automatically get
a titled card during the build, including listing, tag, and publication pages
and links without an external preview image. These cards use
`/i/share-cards/page-<url-hash>.jpg` so pagination and matching names in different
sections cannot overwrite each other or post cards. Their paths are computed
for social metadata, not written to frontmatter. Non-HTML outputs do not
generate cards; `npm start` still skips generation for faster previews.
Page cards are generated assets and are not committed; Netlify caches them
between builds. Generation finishes before the cards are copied into the
deployment output, including on the first build.

## Search and social metadata

Page metadata uses the complete `title` plus the site name for the document
`<title>`. Open Graph and X titles use the complete page title without the site
name. Content can override descriptions with `meta_description` and
`social_description` without changing the visible body copy. Generated post
cards use the post title for image alternative text; custom or external images
can provide `image_alt`.

The description length targets are editorial guidance rather than hard protocol
limits. `npm run metadata:check` reports them as warnings so older content does
not block a build. Add `-- --csv <path>` to write the over-limit descriptions
to a review CSV.

## Publishing drafts

| Command                | What it does                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run publish:post` | Prompts for a draft, moves it into the posts collection, generates and synchronizes its share card, then reports metadata length advisories. |
| `npm run publish:link` | Prompts for a draft, moves it into the links collection, then reports metadata length advisories.                                            |

Publishing a file does not deploy it by itself. Commit and push the resulting
changes through the normal Git workflow. After Netlify successfully deploys
`main`, GitHub Actions checks the live feeds and syndicates new content.

Publishing a post builds only the selected post’s share card, without running
Eleventy or generating other posts’ or pages’ images. If card generation fails,
the draft is retained and the error is reported.

## Building and maintenance

### Image optimization

The image task caches optimized bytes in `_cache/optimized-images/` with a
content- and optimizer-version-based index in `_cache/optimized-images.json`.
Both are generated, ignored by Git, and preserved by the existing Netlify
`_cache` plugin. An older index or a missing artifact requires one optimization
pass; subsequent builds reuse it until the source or optimizer changes.
Artifact paths include the source hash and optimizer signature, so a failed
build cannot replace the bytes referenced by an older index. Cache artifacts
and the index are published with atomic renames to avoid partial cache files.

Unchanged images and media are not rewritten in `src/static/i` or `dist/i`,
including on full builds. If `dist` is cleaned, it is repopulated from cached
artifacts without reoptimizing. The image summary reports optimization counts
and actual output writes.

`DISABLE_IMAGE_OPTIMIZATION=1` (also `true`) reuses matching cached artifacts
where available and otherwise copies originals. It does not overwrite the
optimized cache with originals, so switching back to optimization does not
invalidate previously cached work. Netlify currently uses this mode.

| Command               | What it does                                                                                                                      |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`       | Runs the complete production build. The `prebuild` and `postbuild` lifecycle scripts run automatically before and after Eleventy. |
| `npm run build:fast`  | Runs an incremental production build. This is useful for iteration, but a complete build is the safer final verification.         |
| `npm run build:dev`   | Runs a non-production Eleventy build without starting a server or watcher.                                                        |
| `npm run prebuild`    | Runs the Gulp tasks that prepare assets for a production build. Normally invoked automatically by `npm run build`.                |
| `npm run postbuild`   | Runs the Gulp tasks that finish the built site. Normally invoked automatically by `npm run build`.                                |
| `npm run clean`       | Removes and recreates `dist`.                                                                                                     |
| `npm run clean:cache` | Removes the processed webmention caches so they can be rebuilt.                                                                   |
| `npm run clean:full`  | Clears both the processed webmention caches and `dist`.                                                                           |
