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
   collection. Publishing a post also generates its share card, checks metadata,
   and runs Sequoia to publish new or changed posts to AT Protocol.
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

## Theme preferences

The color-theme button opens a native dialog containing
[`@aarongustafson/theme-switcher`](https://www.npmjs.com/package/@aarongustafson/theme-switcher).
Its default choices are System, Light, and Dark, with the demo's decorative
monitor, sun, and moon icons alongside the visible labels. Theme changes apply
immediately without closing the dialog, so keyboard users can explore the choices.
Close and Escape dismiss it without reverting the selected preference.
The authored fieldset legend also provides the dialog's accessible name, without
a duplicate heading.

For a consistent upper-right dialog close control, use a command button with an
accessible label. Shared dialog styles position the control and provide a 44px target:

```html
<button type="button" commandfor="dialog-id" command="close" aria-label="Close">&times;</button>
```

The component owns ongoing theme state and saves the choice under the
`theme-switcher` localStorage key. A small script before the stylesheet restores
that preference to avoid a theme flash. When there is no valid new preference,
it migrates the former `darkmode=true/false` cookie to Dark/Light. The cookie is
removed only after the new preference is verified in storage. If storage is
blocked, the old choice still applies for the current page and the cookie is
retained for another visit; errors are reported in the console.

Theme colors are semantic CSS custom properties in
[`src/_styles/base/_theme.scss`](src/_styles/base/_theme.scss), selected through
`html[data-theme]`. System follows `prefers-color-scheme`; an explicit Light or
Dark choice takes precedence. Without JavaScript, the page follows the OS and
the inactive chooser stays hidden.

The script task copies both the theme-switcher and form-multi-switch npm modules
to local assets, alongside the site integration modules in
[`src/_javascript/theme/`](src/_javascript/theme/). The base layout supplies the
import map. These ES modules are copied without legacy concatenation/minification;
no external component CDN is required.

Run the focused integration tests with:

```sh
node --test .github/scripts/theme-switcher.test.js
```

## Checking content and code

The service worker versions its long-lived cache from built CSS, JavaScript
(including local component modules), and worker source—not posts or other HTML.
It fetches a complete fresh asset set before offering the refresh banner.
Cached HTML is refreshed silently in the background for the next visit, subject
to the existing data-saving settings. Run the cache and bundle regression tests
with `node --test .github/scripts/serviceworker.test.js .github/scripts/scripts-build.test.js`.

| Command                        | What it does                                                                                                                            |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run prose:fix`            | Rewrites drafts and posts to use the project’s preferred typographic punctuation, preserving code, template syntax, and HTML/Markdown attributes. Review the resulting changes before committing them. |
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
Hero cards read originals from `src/_images` when available and fall back to
static-only assets, so publishing a new hero does not require a tracked copy.

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

## Managing AT Protocol publishing with Sequoia

Sequoia publishes blog posts as Standard.site documents on AT Protocol. The CLI
is installed with `npm install`; no global installation is needed.
The existing `sequoia.json` config points at `src/posts` and the site's
publication, so there is no need to run `sequoia init` again.

| Command | What it does |
| ------- | ------------ |
| `npm run sequoia -- --help` | Lists all Sequoia commands. |
| `npm run sequoia:auth` | Signs in with an AT Protocol handle and app password. |
| `npm run sequoia:login` | Signs in using browser-based OAuth instead. |
| `npm run sequoia:dry-run` | Previews what would be published without making changes. |
| `npm run sequoia:publish` | Publishes new or changed posts to AT Protocol. |
| `npm run sequoia:sync` | Restores local state from existing AT Protocol records. |
| `npm run sequoia:update` | Interactively updates local config or the AT Protocol publication record. |

Before publishing for the first time:

1. Sign in with `npm run sequoia:auth` or `npm run sequoia:login`.
2. If working in a fresh checkout or missing `.sequoia-state.json`, run
   `npm run sequoia:sync` to restore state before publishing.
For normal publishing, run `npm run publish:post`. After moving the selected
draft, generating its share card, and checking metadata, this runs
`npm run sequoia:publish`. Sequoia scans all of `src/posts`, so it can publish
other new or changed posts too, not just the selected draft. For a separate
preview, run `npm run sequoia:dry-run` before publishing; the selected draft
will not appear in that preview until it is moved into `src/posts`.

AT Protocol publishing happens locally before site deployment and is separate
from post-deployment social syndication. Sequoia writes `atUri` values into
post frontmatter; commit those changes along with the post and share card,
then push to GitHub to trigger Netlify. AT Protocol records may briefly link
to a website page that is not live yet. `.sequoia-state.json` is
already ignored by Git. Keep app passwords and OAuth credentials out of the
repository.

Pass extra CLI options after `--`, for example
`npm run sequoia:sync -- --dry-run` or
`npm run sequoia:publish -- --help`. The site's base layout already renders
the `site.standard.publication` link on every page using the publication URI
in `sequoia.json`, and the `site.standard.document` link on posts with an
`atUri`. Keep the publication verification endpoint at
`src/static/.well-known/site.standard.publication` in sync if that URI changes.
`sequoia:inject` is not needed for normal publishing. Deploy these links before
sharing a website URL in Bluesky so its composer can discover the records for
enhanced cards.

## Search and social metadata

Page metadata uses the complete `title` plus the site name for the document
`<title>`. Open Graph and X titles use the complete page title without the site
name. Content can override descriptions with `meta_description` and
`social_description` without changing the visible body copy. Generated post
cards use the post title for image alternative text; custom or external images
can provide `image_alt`.

The shared plain-text helper renders Markdown before converting HTML to text.
Inline code such as `` `<input>` `` therefore retains its literal brackets in
metadata and share-card text, while actual HTML formatting, link destinations,
and footnotes are omitted. Markdown image descriptions are retained; raw HTML
images are skipped. Derived plain-text fallbacks are not converted a second time.
`twitter_text` remains plain social copy, not Markdown: use `<input>` without
backticks there unless literal backticks are wanted.

The description length targets are editorial guidance rather than hard protocol
limits. `npm run metadata:check` reports them as warnings so older content does
not block a build. Add `-- --csv <path>` to write the over-limit descriptions
to a review CSV.

## Publishing drafts

| Command                | What it does                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run publish:post` | Prompts for a draft, moves it into the posts collection, generates and synchronizes its share card, reports metadata length advisories, then publishes new or changed posts to AT Protocol through Sequoia. |
| `npm run publish:link` | Prompts for a draft, moves it into the links collection, then reports metadata length advisories.                                            |

Publishing a file does not deploy it by itself. Commit and push the resulting
changes through the normal Git workflow. After Netlify successfully deploys
`main`, GitHub Actions checks the live feeds and syndicates new content.

Publishing a post builds only the selected post’s share card, without running
Eleventy or generating other posts’ or pages’ images. If card generation fails,
the draft is retained and the error is reported.

Sequoia runs only after draft publishing and metadata checking succeed.
If AT Protocol publishing fails, the post has already been moved into
`src/posts`; fix the reported issue (for example, sign in with
`npm run sequoia:auth`) and retry with `npm run sequoia:publish`, not
`npm run publish:post`. Review the resulting `atUri` changes before committing.
Link publishing does not run Sequoia.

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

The image task writes only to `dist/i`, never to tracked files in `src/static/i`.
Eleventy excludes static duplicates of managed source images from passthrough
copying and finishes image processing after other copies, so originals cannot
overwrite optimized output. Static-only assets, including generated share
cards, are still copied normally. The development server serves the built
files, and Eleventy watches `src/_images` for image changes.

Unchanged output images and media are not rewritten, including on full builds.
If `dist` is cleaned, it is repopulated from cached artifacts without
reoptimizing. The image summary reports optimization counts and actual output
writes. Running `npm start` does not replace tracked images with optimized
versions or create new tracked copies of source images.

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
