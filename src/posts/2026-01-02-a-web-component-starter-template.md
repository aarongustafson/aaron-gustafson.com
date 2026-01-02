---
title: "A Production-Ready Web Component Starter Template"
date: 2026-01-02 00:06:37 +00:00
comments: true
tags:
  [
    "web components",
    "JavaScript",
    "open source",
    "developer tools",
    "best practices",
  ]
description: "I created a comprehensive starter template for creating production-ready web components with modern tooling, testing, and CI/CD—following Google's Custom Element Best Practices."
twitter_text: "Start building web components the right way with this production-ready template."
---

Creating a new web component from scratch involves a lot of boilerplate—testing setup, build configuration, linting, CI/CD, documentation structure, and more. After building — and refining/rebuilding — numerous web components, I’ve distilled all that work into a starter template that lets you focus on your component’s functionality rather than project setup. 

<!-- more -->

The [Web Component Starter Template](https://github.com/aarongustafson/web-component-starter) is based on the architecture and patterns I’ve refined across my web component work, incorporating [Google's Custom Element Best Practices](https://web.dev/articles/custom-elements-best-practices) and advice from other web components practitioners including the always-brilliant <a href="https://daverupert.com/">Dave Rupert</a>.

## What's included

The template provides everything you need to create a production-ready web component:

- **Interactive setup wizard** that scaffolds everything for your component.
- **Multiple import patterns** supporting both auto-define and manual registration.
- **Demo pages** for development, documentation, and CDN examples.
- **Code quality tools** including ESLint and Prettier with sensible defaults.
- **Modern testing setup** with Vitest, Happy DOM, and coverage reporting.
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

- Renames all files based on your component name,
- Updates all code and configuration templates with your details,
- Generates a proper README from the included template,
- Cleans up all template-specific files, and
- Initializes the git repository.

You’re left with a fully scaffolded repository, ready for you to develop your component.

## Flexible import patterns

One of the key features is support for multiple registration patterns. Users of your component can choose what works best:

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

The auto-define approach includes guards to ensure it only runs in browser environments and checks if `customElements` is available, making it safe for server-side rendered (SSR) scenarios.

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

## Automated publishing with OIDC

The template is configured for secure automated publishing to npm using OpenID Connect (OIDC), which is more secure than long-lived tokens. After you manually publish the first version and configure OIDC on npm, create a GitHub release and the workflow handles publishing automatically.

Manual publishing is still supported if you prefer that approach.

## Following best practices

The template bakes in best practices from the start:

- Shadow DOM with proper encapsulation
- Custom Elements v1 API
- Reflection of properties to attributes
- Lifecycle callbacks used appropriately
- Accessible patterns and ARIA support
- Progressive enhancement approach

The included [`WEB-COMPONENTS-BEST-PRACTICES.md` document](https://github.com/aarongustafson/web-component-starter/blob/main/WEB-COMPONENTS-BEST-PRACTICES.md) explains the reasoning behind each pattern, making it a learning resource as well as a starter template.

## Why I built this

After creating components like [form-obfuscator](https://github.com/aarongustafson/form-obfuscator), [tabbed-interface](https://github.com/aarongustafson/tabbed-interface), and several others, I found myself copying and adapting the same project structure each time. This template captures those patterns so I — and now you — can start building components faster.

If you build something with it, I’d love to hear about it!
