---
title: "Rebuilding a PHP App using Isomorphic JavaScript with Eleventy & Netlify"
date: 2023-02-03 13:40:59 -07:00
comments: true
tags: ["mobile", "progressive enhancement", "progressive web apps", "web development"]
description: "Back in the early days of the iPhone, I created tipr.mobi, a tip calculator that always produces a palindrome total. This is an overview of the minimal work I did to make it a modern web app that can run without a traditional back-end."
twitter_text: "Wherein I migrate @tipr from a #PHP-based mobile web app to a #serverless #PWA."
redirect_from: "/notebook/rebuilding-a-php-app-using-isometric-javascript-with-eleventy-and-netlify/"
hero:
  src: /i/posts/2023-02-03/hero.jpg
  credit: Aaron Gustafson × DALL·E
  alt: "Painting of a cute red robot looking at itself in a full-body mirror."
  url: https://labs.openai.com/s/nvIjXSOq3ZcoaLFMNacLUlJD
  offset: "75"
crossposted:
  Codementor: https://www.codementor.io/@aarongustafson/rebuilding-a-php-app-using-isomorphic-javascript-with-eleventy-netlify-23cfltqu1v/
---

Back in the early days of the iPhone, I created [Tipr](https://tipr.mobi), a tip calculator that always produces a palindrome total.[^1] This is an overview of the minimal work I did to make it a modern web app that can run without a traditional back-end.

<!-- more -->

## What I had to work with

The previous iteration of Tipr was built in my hotel room while I was on site doing some consulting for a certain Silicon Valley company. I was rocking a [Palm Treo 650](https://wikipedia.org/wiki/Treo_650) at the time and that day a few of my colleagues had lined up to wait for the release of [the very first iPhone](https://wikipedia.org/wiki/IPhone_(1st_generation)). At the time, web apps were the only way to get an "app" on the iPhone as there was no SDK or even an App Store.

<figure id="2023-02-02-02">

![](https://www.aaron-gustafson.com/i/posts/2023-02-03/iphone.jpg){width=696}{height=928}

<figcaption>Tipr on the 1st generation iPhone, in the hands of Micah Alpern, June 2007.</figcaption>
</figure>

I did a lot of PHP development back in the day, so armed with all of the mobile web development best practices of the day, I set about building the site and making it speedy. Some of the notable features of Tipr included:

* Inlining CSS & JS file contents into the HTML.
* Using [PHP output buffers](https://www.php.net/manual/en/book.outcontrol.php) to compress the HTML on the server before sending it over the wire.
* Server side processing in PHP.
* Client side processing via <abbr aria-label="XMLHttpRequest" title="XMLHttpRequest">XHR</abbr> to a PHP-driven API.

At the time, most of these approaches were very new. As an industry, we weren’t doing a whole lot to ensure peak performance on mobile because most people’s mobile browsers were pretty crappy. This was the heyday of Usablenet’s "mobile friendly" bolt-on and WAP. Then came Mobile Safari.

<figure id="2023-02-02-03">

![](https://www.aaron-gustafson.com/i/posts/2023-02-03/app-store.png){width=696}{height=472}

<figcaption>Tipr in the original Apple App Store, back when web apps were first class citizens on iPhone OS.</figcaption>
</figure>

## A lot has changed since 2007

The Tipr site has remained largely untouched since I built it in the Summer of 2007. That October, I added a theme switcher that made the site [pink for October](https://pinkforoctober.org/) (Breast Cancer Awareness Month). I added a free text message-based interface using the then-free [TextMarks](https://www.textmarks.com/) service and [a Twitter bot](https://twitter.com/tipr) as well. But as far as the web interface went, it remained largely untouched.

Here are a handful of things that have come to the web in the intervening years:

* HTML5 Form Validation API
* SVG support
* CSS3
* Media Queries
* Web App Manifest
* Service Worker (and its precursor the AppCache)
* Flexbox
* CSS Grid

Phew, that’s a lot! While I haven’t made upgrades in all these areas, I did sprinkle in a few, mainly to make it a true PWA and boost performance.

## Moving from PHP to a "static" site

Much of my work over the last few years has been in the world of static site generators (e.g., [Jekyll](https://jekyllrb.com/), [Eleventy](https://www.11ty.dev/)). I’m quite enamored of [Eleventy](https://www.11ty.dev/), having used it for a number of projects at this point. Since I know it really well, it made sense to use it for this project too. The installation steps are minimal and I already had a library of configuration options, plugins, and filters to roll with.

While in the process of migrating to Eleventy, I also took the opportunity to

* Swap raster graphics for SVGs,
* Set up a Web App Manifest,
* Add a Service Worker, and
* Update the site’s `meta` info to reflect current best practices.

I also swapped out the PHP logic that governed the pink color theme for [a simple `script` in the `head` of the every page](https://github.com/aarongustafson/tipr.mobi/blob/main/src/_includes/layouts/base.html#L7-L12). Since the color change is an enhancement, rather than a necessity, I didn’t feel like it was something I needed to manage another way.

The greatest challenge in moving Tipr over to a static site was setting up the tip calculation engine, which had been in PHP to ensure it would work even if JavaScript wasn’t available.

## Migrating the core logic to isomorphic JavaScript

When I originally built Tipr, JavaScript on the back-end wasn’t a thing. That’s why the core tip calculation engine was built in PHP. At the time, even <abbr aria-label="XMLHttpRequest" title="XMLHttpRequest">XHR</abbr> was in its infancy, so the fact that I could use PHP to do the calculations for both the server-side—for when JavaScript wasn’t available—and client-side—when it was—was pretty amazing.

Today, JavaScript is ubiquitous across the whole stack, which made it the logical choice for building out the revised tip calculator. As with the original, I needed the calculation to work on the client side if it could—saving a round trip to the server—but to also have the ability to fall back to a traditional form submission if the client-side approach wasn’t feasible. That would be possible by having client-side JavaScript for the form itself, with the server-side piece handled by [Netlify’s Edge Functions](https://docs.netlify.com/edge-functions/overview/) (integrated through [Eleventy’s Edge plugin](https://www.11ty.dev/blog/eleventy-edge/)).

From an architectural standpoint, I really didn’t want to have my logic duplicated in each place, so I began to play around with ensconcing the calculation logic in a JavaScript include, so I could import it into the form page itself _and_ a JavaScript module that the Edge Function could use.

You can view [Tipr’s source on GitHub](https://github.com/aarongustafson/tipr.mobi), but here’s a basic rundown of the relevant directories and files:

```txt
netlify
  edge-functions
    tipr.js
src
  _includes
    js
      tipr.js
  j
    process.njk
  index.html
netlify.toml
```

### `src/_includes/js/tipr.js`

This file contains the central logic of the tip calculator. It’s written in vanilla JavaScript with the intent that it would be understandable by the widest possible assortment of browsers out there.

### `src/index.html`

The homepage of the site is also home to the tip calculation form. Below the form is an embedded `script` element containing the logic for interacting with the DOM for the client-side version of the tip calculator. I include the logic at the top of that `script`:

{% raw %}
```njk
<script>
  {% include "js/tipr.js" %}
  
  // The rest of the JavaScript logic
</script>
```
{% endraw %}

### `src/j/process.njk`

This file exists solely to export the JavaScript logic from the include in a way that it can be consumed by the Edge Function. It will render a new JavaScript file called "process.js" and turns the central processing logic into a JavaScript module that [Deno](https://deno.land/) can use (Deno powers Netlify’s Edge Functions):

{% raw %}
```njk
---
layout: false
permalink: /j/process.js
---

{% include "js/tipr.js" %}

export { process };
```
{% endraw %}

### `netlify/edge-functions/tipr.js`

We define Edge Functions for use with Netlify in the `netlify/edge-functions` folder. To make use of the core JavaScript logic in the Edge Function, I can import it from the module created above before using it in the function itself:

{% raw %}
```js
import { process } from "./../../_site/j/process.js";

function setCookie(context, name, value) {
	context.cookies.set({
		name,
		value,
		path: "/",
		httpOnly: true,
		secure: true,
		sameSite: "Lax",
	});
}

export default async (request, context) => {
	let url = new URL(request.url);

	// Save to cookie, redirect back to form
	if (url.pathname === "/process/" && request.method === "POST")
	{
		if ( request.headers.get("content-type") === "application/x-www-form-urlencoded" )
		{
			let body = await request.clone().formData();
			let postData = Object.fromEntries(body);

			let result = process( postData.check, postData.percent );

			setCookie( context, "check", result.check );
			setCookie( context, "tip", result.tip );
			setCookie( context, "total", result.total );

			return new Response(null, {
				status: 302,
				headers: {
					location: "/results/",
				}
			});
		}
	}

	return context.next();
};
```
{% endraw %}

What’s happening here is that when a request comes in to this Edge Function, the default export will be executed. Most of this code is directly lifted from [Netlify’s Edge Functions demo site](https://edge-functions-examples.netlify.app/). I grab the form data, pass it into the `process` function, and then set browser cookies for each of the returned values before redirecting the request to [the result page](https://github.com/aarongustafson/tipr.mobi/blob/main/src/results.html).

On that page, I use Eleventy’s Edge plugin to render the check, tip, and total amounts:

{% raw %}
```njk
{% edge %}
	{% set check = eleventy.edge.cookies.check %}
	{% set tip = eleventy.edge.cookies.tip %}
	{% set total = eleventy.edge.cookies.total %}
	<tr id="check">
		<th scope="row">Check&nbsp;</th>
		<td>${{ check }}</td>
	</tr>
	<tr id="tip">
		<th scope="row">Tip&nbsp;</th>
		<td>${{ tip }}</td>
	</tr>
	<tr id="total">
		<th scope="row">Total&nbsp;</th>
		<td>${{ total }}</td>
	</tr>
{% endedge %}
```
{% endraw %}

Side note: The cookies get reset using [a separate Edge Function](https://github.com/aarongustafson/tipr.mobi/blob/main/netlify/edge-functions/reset.js).

### `netlify.toml`

To wire up the Edge Functions, we use put a `netlify.toml` file in the root of the project. Configuration is pretty straightforward: you tell it the Edge Function you want to use and the path to associate it with. You can choose to associate it with a unique path or run the Edge Function on every path.

Here’s an excerpt from [Tipr’s `netlify.toml`](https://github.com/aarongustafson/tipr.mobi/blob/main/netlify.toml) as it pertains to the Edge Function above:

```toml
[[edge_functions]]
function = "tipr"
path = "/process/"
```

This tells Netlify to route requests to `/process/` through `netlify/edge-functions/tipr.js`. Then all that was left to do was wire up the `form` to use that endpoint as its `action`:

```html
<form id="calc" method="post" action="/process/">
```

### Isometric Edges

It took a fair bit of time to figure this all out, but I’m pretty excited by the possibilities of this approach for building more static isomorphic apps. Oh, and the new site… [is fast](https://speedlify.aaron-gustafson.com/apps/).


[^1]: Why a palindrome? Well, it makes it pretty easy to detect tip fraud because all restaurant totals will always be the same forwards & backwards. It’s a little easier than a checksum.
