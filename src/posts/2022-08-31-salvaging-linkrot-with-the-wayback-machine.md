---
title: "Salvaging linkrot with the Wayback Machine"
date: 2022-08-31 14:37:31 -07:00
comments: true
tags: ["this site", "URLs"]
description: "While making some updates to the site, I did a 404 scan of my link blog and the results were… less than awesome. So I decided to work some Eleventy magic to recover from them."
twitter_text: "While making some updates to the site, I did a 404 scan of my link blog and the results were… less than awesome. So I decided to work some @eleven_ty magic to recover from them."
hero:
  src: /i/posts/2022-08-31/hero.jpg
  credit: Aaron Gustafson × DALL·E
  alt: "A photograph of an anchor chain rusting and rotting away on a beach"
  url: https://labs.openai.com/s/zZJVuhOrUOcyEs6mGV4EMWIp
  offset: "100"
---

While making some updates to the site, I did a 404 scan of [my link blog](/notebook/links/) and the results were… less than awesome. So I decided to work some Eleventy magic to recover from them.

<!-- more -->

## Step 1: Log the 404s to a file

I make ample use of [Eleventy’s global data files](https://www.11ty.dev/docs/data-global/), but 404s didn’t feel like something I needed to have as part of the data cascade. Instead, I’m logging them to a YAML file in my `./_cache` folder. For simplicity, they get logged like this:

```yml
https://path.to/original/page/that-is-404ing/: true
```

I chose YAML as it’s about as bare-bones as you can get when it comes to file formats and is pretty easy to work with in the context of Eleventy.

## Step 2: Add an Eleventy data file to my links folder

If you’re not familiar, Eleventy allows you to create [directory-level data files](https://www.11ty.dev/docs/data-template-dir/) that can be used to augment file-level data. I was originally using it to define the <var>layout</var> and <var>permalink</var> front matter variables for all the links using the JSON option, but [as a JavaScript file, directory-level data becomes even more powerful](https://www.11ty.dev/docs/data-js/).

Setting up your data file is relatively straightforward using `module.exports`:

{% raw %}
```js
module.exports = {
  layout: "layouts/link.html",
  permalink: "/notebook/{{ page.filePathStem }}/",
  eleventyComputed: {
    custom_property: (data) => {
      return some_value_based_on_data;
    }
  }
};
```
{% endraw %}

Here I’m defining two static values (<var>layout</var> and <var>permalink</var>) and a computed value (the hypothetical <var>custom_property</var>).

## Step 3: Consult the 404 log

As I mentioned, the 404 logging happens separately and results in updates to `_cache/404.yml`. To make use of all this in the Eleventy data file, I need to set up a few things at the top of the file:

```js
const fs = require('fs');
const yaml = require('js-yaml');
const cached404s = yaml.load(fs.readFileSync('_cache/404s.yml'));
```

Here I’m bringing in Node’s File System and [JS-YAML](https://www.npmjs.com/package/js-yaml). Then I am loading the YAML file into memory as <var>cached404s</var>, leveraging those utilities.

Next up is defining a helper function to search <var>cached404s</var> for a match:

```js
function is404ing(url) {
  return ( url in cached404s );
}
```

This function takes the URL as an argument and returns `true` or `false`. Making use of this in the `eleventyComputed` section is straightforward:

{% raw %}
```js
module.exports = {
  layout: "layouts/link.html",
  permalink: "/notebook/{{ page.filePathStem }}/",
  eleventyComputed: {
    is_404: (data) => {
      return is404ing(data.ref_url);
    }
  }
};
```
{% endraw %}

In my case, <var>ref_url</var> is the front matter field storing the URL I’m linking to from my link blog, so I return the value of passing that to `is404ing()` as <var>is_404</var>.

## Step 4: Lean on the Wayback Machine

The next thing I want to do is generate a link that has a good chance of working for my readers. Thankfully the [Wayback Machine](https://web.archive.org/) has a predictable URL structure for entries and it’s pretty good about handgun redirects to the most temporally-proximate snapshot when you give it a date to work from. Knowing that, I set up another helper function:

{% raw %}
```js
function archived(data) {
  let archive_url = 'https://web.archive.org/web/{{ DATE }}/{{ URL }}';
  let month = data.date.getUTCMonth()+1;
  month = month < 10 ? "0" + month : month;
  let day = data.date.getDay();
  day = day < 10 ? "0" + day : day;
  archive_url = archive_url
                  .replace('{{ DATE }}', `${data.date.getUTCFullYear()}${month}${day}`)
                  .replace('{{ URL }}', data.ref_url );
  return archive_url;
}
```
{% endraw %}

Note: I know this isn’t the most elegant/efficient code, I wanted to show step-by-step what’s happening here.

This function takes the <var>data</var> object as an argument and composes a URL that points to a snapshot of the given page (<var>data.ref_url</var>) at the time I saved the link (<var>data.date</var>). The <var>data.date</var> value is already a JavaScript date, so it’s pretty easy to turn it into the format the Wayback Machine expects (YYYYMMDD). In the end, this method returns a URL that looks something like this:

> https://web.archive.org/web/20150102/http://andregarzia.com/posts/en/whatsappdoesntunderstandtheweb/

With that helper in place, I can make use of it within `eleventyComputed`:

{% raw %}
```js
module.exports = {
  layout: "layouts/link.html",
  permalink: "/notebook/{{ page.filePathStem }}/",
  eleventyComputed: {
    is_404: (data) => {
      return is404ing(data.ref_url);
    },
    archived: (data) => {
      return is404ing(data.ref_url) ? archived(data) : false;
    }
  }
};
```
{% endraw %}

Now every link in my link blog will have an <var>is_404</var> value that is `true` or `false` and an <var>archived</var> value that is either a valid Wayback Machine URL (if the page is 404-ing) or `false`.

## Step 5: Using these in the my template

I use Nunjucks for most of my site’s templating, but you can make use of these computed properties in any supporting templating language. Knowing if a linked URL is 404-ing allows me to

* display the title without a link,
* display the source without a link, and
* provide additional copy about the link’s 404 status and provide the Wayback Machine link instead.

I am only going to share code with you for that final bit as it should give you enough of a sense of how you can use these properties in the other contexts too.

{% raw %}
```liquid
{% if is_404 %}
  <p>This link is 404-ing{% if archived %}, but 
    <a rel="bookmark" href="{{ archived }}">you can view an 
    archived version on the Wayback Machine</a>{% endif %}.
  </p>
{% endif %}
```
{% endraw %}

Here you can see I am injecting a `footer` into the markup when the entry is 404-ing. Within that footer, I note the link’s status. Then I inject some additional text to point to the Wayback Machine’s archive of the page. It’s worth noting that I am being overly cautious here and only injecting the link if <var>post.data.archived</var> is truthy. This will ensure that the link won’t be shown if something fails in my code or I change how I am implementing the <var>archived</var> property.

## Crossing my fingers

Relying on an unverified URL, even one at the Wayback Machine, is risky, but so far this approach seems to be working. If you’ve got a link blog suffering from link rot, you might consider setting up something similar. Hopefully this will help jumpstart that project for you.
