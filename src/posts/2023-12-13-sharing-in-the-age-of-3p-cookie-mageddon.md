---
title: "Sharing in the Age of 3p Cookie-mageddon"
date: 2023-12-15 11:28:35 -07:00
comments: true
tags: ["HTML", "privacy", "progressive enhancement", "the web", "user experience", "web development"]
description: "Over a decade ago, I wrote up detailed instructions on how to enable users to share your content on social media without allowing them to be tracked by every social media site via cookies. In a few short weeks “third party” cookies will get the boot in Chromium-based browsers. If you’re still relying on third party share widgets on your site, now is a good time to replace them. Here’s how…"
twitter_text: "Are you still relying on third party share widgets? You should really stop that. Here’s how…"
hero:
  src: /i/posts/2023-12-15/hero.jpg
  credit: "Aaron Gustafson × Designer"
  alt: "Isolated picture of two humanoid robots. One is very large, the other one is small. The smaller one is handing the other a piece of paper with the word “share” on it to the larger robot. Style of a pulp science fiction novel cover."
  url: https://www.bing.com/images/create/isolated-picture-of-two-humanoid-robots-one-is-ve/1-657cb1bf085f4f57a3e271f6c22c9ba1?id=lweqQyJHIsCUx%2bCZPkiFfQ%3d%3d&view=detailv2&idpp=genimg&FORM=GCRIDP&mode=overlay
  offset: "0"
---

Over a decade ago, I wrote up [detailed instructions on how to enable users to share your content on social media without allowing them to be tracked by every social media site via cookies](https://blog.easy-designs.net/archives/dont-sell-out-your-users/). In a few short weeks [“third party” cookies will get the boot in Chromium-based browsers](https://developers.google.com/privacy-sandbox/blog/cookie-countdown-2023oct). If you’re still relying on third party share widgets on your site, your users may start seeing problems. Now is a good time to replace them with code that Just Works™. Here’s how…

<!-- more -->

## Sharing, the Old-fashioned Way

When it comes to sharing, there are myriad ways to do it. If you’re at all familiar with my work, it should come as no surprise that I always start with a universally-useable and accessible baseline and then [progressively enhance](/tags/progressive-enhancement) things from there. Thankfully, every social media site I commonly use (with the exception of the Fediverse) makes this pretty easy by providing a form that accepts inbound content via the query string.[^1] You can [try LinkedIn’s to see it in action](https://www.linkedin.com/cws/share?url=https://www.aaron-gustafson.com/notebook/rebuilding-a-php-app-using-isomorphic-javascript-with-eleventy-and-netlify/).

[^1]: Interesting side-note: If you own a form like this on your site, [it makes a great share target](/notebook/my-own-personal-pwa/).

Each service is a little different, but all function similarly. I support the following ones in this site:

<table>
<caption>Social Media Sites and Their Sharing URLs</caption>
<thead>
<tr>
<th scope="col">Site</th>
<th scope="col">Destination</th>
<th scope="col">URL</th>
<th scope="col">Optional Params</th>
</tr>
</thead>
<tbody>
<tr><th scope="row">Twitter / X</th><td>https://twitter.com/<wbr>intent/tweet</td><td><code>url</code></td><td></td></tr>
<tr><th scope="row">Hacker News</th><td>https://news.ycombinator.com/<wbr>submitlink</td><td><code>u</code></td><td><code>t</code> = the title you want to share </td></tr>
<tr><th scope="row">Facebook</th><td>http://www.facebook.com/<wbr>sharer.php</td><td><code>u</code></td><td></td></tr>
<tr><th scope="row">LinkedIn</th><td>https://www.linkedin.com/cws/share</td><td><code>url</code></td><td></td></tr>
<tr><th scope="row">Pinterest</th><td>http://pinterest.com/<wbr>pin/create/button/</td><td><code>url</code></td><td><code>media</code> = an image to share<br><code>description</code> = the text you want to share</td></tr>
</tbody>
</table>

Using this information, I created [a partial template for use on any page in this site](https://github.com/aarongustafson/aaron-gustafson.com/blob/main/src/_includes/partials/post/sharing.html) (though I mainly use it on blog posts right now). Each link includes useful text content (e.g., “Share on ______”) and a local SVG of the service’s icon. Here’s a simplified overview of the markup I use:

{% raw %}
```html
<ul class="social-links social-links--share">
  <li class="social-links__item">
    <a href="{{ SHARE URL }}" class="social-link" rel="nofollow">
      <svg>{{ SERVICE ICON }}</svg>
      <b class="social-link__text">Share on {{ SERVICE NAME }}</b>
    </a>
  </li>
</ul>
```
{% endraw %}

You can check out the baseline experience on this very page by disabling JavaScript.

<figure id="2023-12-14-01">

![](https://www.aaron-gustafson.com/i/posts/2023-12-15/1.png)

<figcaption>My baseline sharing component is a list of icon links.</figcaption>
</figure>

It’s worth noting that I have chosen not to enforce opening these links in a new tab. You can do that if you like, but on mobile devices I’d prefer the user just navigate to the share page directly. You may have a different preference, but if you decide to spawn a new tab, be sure your link text lets folks know that’s what will happen. I do include a [`rel="nofollow"`](https://developer.mozilla.org/docs/Web/HTML/Attributes/rel#nofollow) on the link, however, to prevent search spiders from indexing the share forms.

If you test out these links, you’ll notice many of the target forms will pick up a ton of information from your page automatically. By and large, this info is grabbed from your page’s [Open Graph data](https://developers.facebook.com/docs/opengraph/) ([stored in `meta` tags](https://developers.facebook.com/docs/sharing/webmasters#markup)) or [Linked Data](https://www.w3.org/TR/json-ld11/) (as [JSON-LD](https://json-ld.org/)). You can write that info to your page by hand or use a plugin to generate it for you automatically. There are a ton of options out there if you choose to go the later route (which I’d recommend).

## Enhancement Level 1: Popup Share

If you played around with any of the various share forms, you probably noticed that they are, by and large, designed as discrete interactions best-suited to a narrow window (e.g., mobile) or popup. To provide that experience, I’ve long-relied on a little bit of JavaScript to launch them in a new, appropriately-sized window:

```js
function popup( e ) {
  var $link = e.target;
  while ( $link.nodeName.toLowerCase() != "a" ) {
    $link = $link.parentNode;
  }
  e.preventDefault();
  var popup = window.open( $link.href, 'share',
    'height=500,width=600,status=no,toolbar=no,popup'
  );
  try {
    popup.focus();
    e.preventDefault();
  } catch(e) {}
}

var screen_width = "visualViewport" in window ?
      window.visualViewport.width : window.innerWidth,
    $links = document.querySelectorAll(
      '.social-links--share a'
    ),
    count = $links.length;

if ( screen_width > 600 ) {
  while ( count-- ) {
    $links[count].addEventListener('click', popup, false);
    $links[count].querySelector(
      '.social-link__text'
    ).innerHTML += " (in a popup)";
  }
}
```

The first chunk defines a new function called `popup()` that will act as the event listener. It takes the event (<var>e</var>) as an argument and then finds the associated link (bubbling up through the DOM as necessary in that `while` loop). Once it finds the link, the function opens a new popup window (using `window.open()`). Then, to check if the popup was blocked, it attempts (within the `try…catch`) to focus it. If the focus succeeds, which means the popup wasn’t blocked, the script prevents the link from navigating the user to the `href` (which is the default behavior, hence `e.preventDefault()`).

The second block defines a couple of variables we’ll need. First, it captures the current <var>screen_width</var> using either the window’s `visualViewport` (if available) or its `innerWidth` (which is more old school). Next it grabs the social links (<var>$links</var>) and counts them for looping purposes (<var>count</var>).

The final block is a conditional that checks to see if the <var>screen_width</var> is wider than 600px (an arbitrary width that just feels right… your mileage may vary). If the screen is wider than that threshold, it loops through the links,[^2] adds the click handler, and adds some text to the link label to let folks know it will open a popup.

[^2]: Why a reverse `while` loop? Well, the order of execution doesn’t matter and decrementing `while` loops are faster in some instances. It’s a micro-optimization that boosts perf on older browsers and lower-end chipsets.

And with that, the first layer of enhancement is complete: Users with JavaScript support who also happen to be using a wider browser window will get the popup share form if the popup is allowed. If the popup isn’t allowed, they’ll default to the baseline experience.

## Enhancement Level 2: OS Share

A few years back, browsers began participating in OS-level share activities. On one side, this allowed websites to share some data—URLs, text, files—to other apps on the device via `navigator.share()`. On the other side of the equation, Progressive Web Apps could advertise themselves—via the Manifest’s `share_target` member—as being able to receive content shared in this way.

Sharing a URL and text is [really well supported](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share#browser_compatibility). That said, it’s only been around a few years at this point and some browsers require an additional permission to use the API.[^3] For these reasons, it’s best to use the API as a progressive enhancement. Thankfully, it’s easy to test for support:

[^3]: Like many modern APIs, it also requires a secure connection (HTTPS).

```js
if ( "share" in navigator ) {
  // all good!
}
```

For my particular implementation, I’ve decided to swap out the individual links for a single button that, when clicked, will proffer the page’s details over to the OS’s share widget. Here’s the code I use to do that:

```js
var $links = document.querySelector('.social-links--share'),
    $parent = $links.parentNode,
    $button = document.createElement('button'),
    title = document.querySelector('h1.p-name,title').innerText,
    $description = document.querySelector(
      'meta[name="og:description"],meta[name="description"]'
    ),
    text = $description ? $description.getAttribute('content')
                        : '',
    url = window.location.href;

$button.innerHTML = 'Share <svg>…</svg>';
$button.addEventListener('click', function(e){
  navigator.share({ title, text, url });
});

$parent.insertBefore($button, $links);
$links.remove();
```

The first block sets up my variables:

* <var>$links</var> - A reference to the list (`ul`) of sharing links;
* <var>$parent</var> - the parent container of that list;
* <var>$button</var> - the button I’m going to swap in for the links;
* <var>title</var> - The page title (either from the page’s `h1` or `title` element);
* <var>$description</var> - A reference to a `meta` description element;
* <var>text</var> - The text content of that description, if one is found; and
* <var>url</var> - The URL to be shared.

The second block sets up the button by inserting the text "Share" and an SVG share icon and setting an event listener on it that will pass the collected info to `navigator.share()`.

The third and final block swaps out the link list for the button.

## Putting It All Together

The final step to putting this all together involves setting up the conditional that determines which enhancement is offered. To keep everything a bit cleaner, I’m also moving each of the enhancements into its own function:

```js
!(function(window, document, navigator){

  function prepForPopup() {
    // popup code
  }
  function popup() {
    // popup event handler
  }
  function swapForShareAPI() {
    // share button code
  }
  
  if ("share" in navigator ) {
    swapForShareAPI();
  } else {
    prepForPopup();  
  }

})(this, this.document, this.navigator);
```

With this setup in place, I can provide the optimal experience in browsers that support the web share API and a pretty decent fallback experience to browsers that don’t. And if none of these enhancements can be applied, users can still share my content to the places I’ve identified… no cookies or third-party widgets required.

You can [see (and play with) an isolated demo of this interface over on Codepen](https://codepen.io/aarongustafson/pen/eYxajwy).
