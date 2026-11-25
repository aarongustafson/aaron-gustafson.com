---
title: "A Production-Ready Web Component Starter Template"
date: 2026-01-02 00:06:37 +00:00
last_updated_at: 2026-11-25 18:52:55 +00:00
comments: true
tags:
  [
    "web components",
    "JavaScript",
    "open source",
    "developer tools",
    "best practices",
  ]
description: "I created a comprehensive starter template for creating production-ready web components with modern tooling, testing, and CI/CD—following Google’s Custom Element Best Practices."
twitter_text: "Start building web components the right way with this production-ready template."
atUri: "at://did:plc:6rmgrvblxflqh34omwywu6ib/site.standard.document/3mxrnvzpgiz2n"
image: "/i/share-cards/a-web-component-starter-template.jpg"
meta_description: "I built a production-ready web-component starter with modern tooling, testing, and CI/CD based on Google’s best practices."
social_description: "I created a comprehensive starter template for creating production-ready web components with modern tooling, testing, and CI/CD—following Google’s Custom Element Best Practices."
---

Starting a new web component from scratch usually means rebuilding the same scaffolding: test setup, build configuration, linting, CI/CD, docs, and all the rest. After building—and rebuilding—more components than I care to count, I pulled those patterns into a starter template so you can spend your time on component behavior instead of project plumbing.

<!-- more -->

The [Web Component Starter Template](https://github.com/aarongustafson/web-component-starter) is based on architecture and patterns I’ve refined across recent projects. It incorporates [Google’s Custom Element Best Practices](https://web.dev/articles/custom-elements-best-practices) and advice from other web component practitioners, including the always-brilliant <a href="https://daverupert.com/">Dave Rupert</a>.

## What’s included

The template includes most everything you need to ship a production-ready web component:

- **Interactive setup wizard** that scaffolds everything for your component.
- **Multiple import patterns** supporting both auto-define and manual registration.
- **Demo pages** for development, documentation, and CDN examples.
- **Light DOM by default**, preserving authored content, native form controls, and document styles.
- **TypeScript declarations** and a Custom Elements Manifest for editor and tooling support.
- **Code quality tools** including ESLint and Prettier with sensible defaults.
- **Unit and browser tests** with Vitest, Happy DOM, Playwright, and coverage reporting.
- **CI/CD workflows** for GitHub Actions with automated testing and npm publishing.
- **Publishing ready** with proper npm package configuration and OIDC support.

## Quick start with interactive setup

Getting started is straightforward. If you’re a GitHub user, you can create a new repository directly from the template. Alternatively, clone it locally:

```bash
git clone https://github.com/aarongustafson/web-component-starter.git my-component
cd my-component
npm install
npm run setup
```

The setup wizard asks for your component name and description, then automatically:

- Renames the component, declaration, and component test files,
- Updates the listed source and configuration placeholders with your details,
- Generates a proper README from the included template,
- Removes the one-time setup files and command,
- Installs dependencies, and
- Initializes Git and creates an initial commit only if there’s no existing `.git` directory.

You’re left with a scaffolded repository, ready for you to develop your component. Setup retains the contributor instructions, demo editing guide, shared demo checks, and versioning helpers. It doesn’t create a GitHub repository or change an existing remote. Review the generated files and replace the example documentation with your component’s actual behavior.

## Flexible import patterns

One of the key features is support for multiple registration patterns. Folks can choose what works best for them:

**Manual registration for full control:**

```javascript
import { ComponentNameElement } from '@yourscope/component-name';

customElements.define('my-custom-name', ComponentNameElement);
```

**Auto-define for convenience:**

```javascript
import '@yourscope/component-name/define.js';
```

**Or call the helper directly:**

```javascript
import { defineComponentName } from '@yourscope/component-name/define.js';

defineComponentName();
```

The registration helper checks for a browser custom-element registry and skips an already registered tag. That doesn’t make the module safe to import during server-side rendering (SSR), though: the component class extends `HTMLElement` when the module is evaluated. Keep these imports in browser-only code.

## Testing made easy

The template includes a comprehensive testing setup using Vitest:

```javascript
import { describe, it, expect } from 'vitest';

describe('MyComponent', () => {
  it('should render', () => {
    const el = document.createElement('my-component');
    expect(el).toBeInstanceOf(HTMLElement);
  });
});
```

Happy DOM provides a lightweight browser environment, and the included scripts support:

- Watch mode for development: `npm test`
- Single run for CI: `npm run test:run`
- Interactive UI: `npm run test:ui`
- Coverage reports: `npm run test:coverage`

Happy DOM is useful, but it isn’t a substitute for checking browser behavior. The starter also includes Playwright tests for Chromium, Firefox, and WebKit:

```bash
npx playwright install chromium firefox webkit
npm run test:browser
```

Those tests check native form participation, labels, focus during upgrade, `hidden`, and the no-JavaScript fallback. Unit tests cover properties assigned before definition and preservation of authored content through rendering and reconnection. You’ll still need tests for your own enhancement and a keyboard and assistive-technology review.

## Demos that preserve the example

The full demo pages now show Code and Live example tabs, with Code selected initially—unless someone has already started interacting with the live example while the enhancement loads. A page-level toggle switches every example back to the linear code-and-example view and saves that preference. Printing shows both.

The live component stays in a permanent host when the presentation changes. Toggling the demo shouldn’t reconnect a nested component, clear a file selection, or reset something you were trying out. If the optional tab enhancement fails, the linear examples remain available.

The shared demo shell also supplies Copy controls and optional syntax highlighting. Component examples and component-specific styles remain yours to edit; shared layout and enhancement files have integrity checks so they don’t quietly drift between projects. Run `npm run demo:check` and follow the retained [demo editing guide](https://github.com/aarongustafson/web-component-starter/blob/main/demo/README.md) when changing them. There isn’t a standalone automatic updater for existing projects.

## Automated publishing with OIDC

The template uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) with OpenID Connect (OIDC), avoiding a long-lived npm token. Publish the first version manually, then configure a trusted publisher on npm for your repository’s `publish.yml` workflow.

For subsequent versions, run `npm version patch` (or `minor` or `major`) from a clean working tree. The version helper updates the versioned esm.sh demo URLs, and npm creates a commit and version tag. The `postversion` script then runs `git push --follow-tags`—so this command pushes, not just versions locally.

The publishing workflow runs on a pushed `v*` tag, **not** a GitHub release. It verifies the tag against the package version, runs lint and unit tests, and publishes with provenance. You can also run the workflow manually; it defaults to a dry run.

Manual publishing is still supported if you prefer that approach.

## Following best practices

The template bakes in best practices from the start:

- Light DOM that preserves authored children; Shadow DOM is an explicit choice when encapsulation is needed
- Custom Elements v1 API
- Reflection of properties to attributes
- Lifecycle callbacks used appropriately
- Native semantics without adding unnecessary roles or tab stops
- Progressive enhancement approach

The included [`WEB-COMPONENTS-BEST-PRACTICES.md` document](https://github.com/aarongustafson/web-component-starter/blob/main/WEB-COMPONENTS-BEST-PRACTICES.md) explains the reasoning behind each pattern, making it a learning resource as well as a starter template.

The example component deliberately does very little: `render()` records initialization rather than replacing your HTML or inventing a widget. You supply the behavior, semantics, and tests the actual component needs.

## Why I built this

After creating components like [form-obfuscator](https://github.com/aarongustafson/form-obfuscator), [tabbed-interface](https://github.com/aarongustafson/tabbed-interface), and several others, I kept copying and adapting the same project structure. This template captures those patterns so I—and now you—can start faster without skipping the fundamentals.

If you build something with it, I’d love to hear about it!

## Update 2026-11-25

The starter now defaults to light DOM and includes browser tests, declarations, and shared demo infrastructure. I updated the setup and publishing instructions too, including the automatic push performed by `npm version`, and corrected the earlier claim that guarded registration made imports server-safe.
