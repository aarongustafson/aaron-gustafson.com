---
title: "A Production-Ready Web Component Starter Template"
date: 2026-01-02 00:06:37 +00:00
last_updated_at: 2026-11-25 20:03:33 +00:00
comments: true
tags:
  [
    "web components",
    "JavaScript",
    "open source",
    "developer tools",
    "best practices",
  ]
description: "After copying the same setup between web components, I pulled it into a starter template with tests, demos, and npm publishing workflows."
twitter_text: "I kept copying the same setup between web components, so I made a starter template."
atUri: "at://did:plc:6rmgrvblxflqh34omwywu6ib/site.standard.document/3mxrnvzpgiz2n"
image: "/i/share-cards/a-web-component-starter-template.jpg"
meta_description: "I pulled the setup I kept copying between web components into a starter template with tests, demos, and npm publishing workflows."
social_description: "After copying the same setup between web components, I pulled it into a starter template with tests, demos, and npm publishing workflows."
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
- Replaces the component-name and description placeholders,
- Generates a proper README from the included template,
- Removes the one-time setup files and command,
- Installs dependencies, and
- Initializes Git and creates an initial commit only if there’s no existing `.git` directory.

That takes care of the repetitive bits. The contributor instructions, demo guide, checks, and versioning helpers stay in place for you to use as you develop. You’ll still need to review the generated files and write the documentation for what your component actually does. Setup won’t create a GitHub repository or change an existing remote for you.

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

The helper won’t try to register the same tag twice, and it checks that a browser registry is available before registering anything. There’s an important caveat, though: the class still extends `HTMLElement` as soon as you import the module. If you’re rendering on the server, keep that import in your browser-only code. The registration guard won’t save you from a missing `HTMLElement`.

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

Of course, a simulated DOM can only tell us so much. For things like native form behavior and focus, the starter also includes [Playwright](https://playwright.dev/) tests in Chromium, Firefox, and WebKit:

```bash
npx playwright install chromium firefox webkit
npm run test:browser
```

These check that forms and labels still work, that upgrading the element doesn’t steal focus, and that the original HTML remains useful without JavaScript. The unit tests also cover setting properties before an element is defined and keeping its content intact when it reconnects. They give you a starting point, not a clean bill of health for whatever you build. You’ll need to test your component’s behavior, including with a keyboard and assistive technology.

## Demos that preserve the example

I’ve also been working on the demos that accompany these components. The full demo pages now let you switch between the code and the live example using tabs, or turn the tabs off to see both together. The page remembers your preference, and printing includes both views.

There’s a less visible detail here that matters more than the tabs: switching views leaves the live component in place. If you’ve selected a file or filled in a field, you shouldn’t lose that work because you wanted to look at the code. Likewise, if you start using an example before the tabs finish loading, the enhancement keeps that example open rather than hiding it. Otherwise, Code is selected first.

Copy buttons and syntax highlighting are included too. If the optional enhancements fail, the code and live examples are still there. The common demo files are shared across projects, with checks to catch accidental differences. If you want to change those, the [demo editing guide](https://github.com/aarongustafson/web-component-starter/blob/main/demo/README.md) explains what belongs where and how to run `npm run demo:check`. Existing projects won’t update themselves.

## Automated publishing with OIDC

The template uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) with OpenID Connect (OIDC), avoiding a long-lived npm token. Publish the first version manually, then configure a trusted publisher on npm for your repository’s `publish.yml` workflow.

After that, you can publish a new version by running `npm version patch` (or `minor` or `major`) from a clean working tree. Along with npm’s version commit and tag, the setup updates the esm.sh demo URLs to match.

One thing to be aware of: **this also pushes the commit and tag**. The starter’s `postversion` script runs `git push --follow-tags`, which triggers publishing when the tag begins with `v`. You don’t need to create a GitHub release. The workflow checks the version, runs lint and unit tests, then publishes with provenance. If you’d rather check the process first, a manual workflow run defaults to a dry run.

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

The example component deliberately does very little. Its `render()` method records that it initialized; it doesn’t replace your HTML, add roles, or create a shadow root. I’d rather start there and add what a component needs than ask you to undo assumptions that don’t fit. Shadow DOM is still an option, but it’s a choice to make for the component you’re building.

## Why I built this

After creating components like [form-obfuscator](https://github.com/aarongustafson/form-obfuscator), [tabbed-interface](https://github.com/aarongustafson/tabbed-interface), and several others, I kept copying and adapting the same project structure. This template captures those patterns so I—and now you—can start faster without skipping the fundamentals.

If you build something with it, I’d love to hear about it!

## Update 2026-11-25

As I’ve continued working on these components, I’ve brought more of that work back into the starter: light DOM by default, browser tests, type declarations, and the shared demos described above. I also corrected two things in this post: publishing starts from a pushed version tag, not a GitHub release, and the registration guard doesn’t make the modules safe to import on a server.
