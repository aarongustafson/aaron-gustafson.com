---
title: "Adaptive Images in ExpressionEngine with CE Image"
date: 2014-11-21 18:18:23 -05:00
comments: true
tags:
  [
    "web design",
    "responsive web design",
    "ExpressionEngine",
    "progressive enhancement",
  ]
description: "With browser implementations now available and a rock-solid set of implementation choices, we’ve begun implementing responsive images in every new project. Here’s how we did it for a recent ExpressionEngine build using the CE Image add-on."
redirect_from: /notebook/2014/adaptive-images-in-expressionengine-with-ce-image/
---

One of the biggest headaches of responsive design has been dealing with images. Thankfully our work on the [Responsive <del>Images</del> <ins>Issues</ins> Community Group](http://ricg.io) has resulted in a rock-solid set of elements and attributes to address all of your adaptive image needs. My company, [Easy Designs](http://easy-designs.net), recently redesigned [Nichols College’s website](http://www.nichols.edu) and that project just happened to coincide adaptive images landing in [Blink](http://www.chromium.org/blink) (the rendering engine that powers Chrome and Opera). Naturally, we jumped at the opportunity to use them.

<!-- more -->

Most Nichols College sites run on [EllisLab’s ExpressionEngine](http://ellislabs.com/expressionengine), a solid little workhorse of a CMS we’ve been using for years. We love it because it gives us complete control over the markup it generates. Now EE offers some pretty decent file management and image manipulation utilities out of the box, but the options it provides were not enough to handle our adaptive image needs; we needed backup. [Causing Effect’s CE Image](http://www.causingeffect.com/software/expressionengine/ce-image) add-on is reasonably priced and offered exactly the functionality we needed to make our adaptive image dreams a reality.

I won’t bore you with how to set up CE Image as there is [documentation on that](http://www.causingeffect.com/software/expressionengine/ce-image/user-guide), but I will walk you through two different responsive image use-cases we had and how we addressed them using this add-on.

## Header images

The first use case we had was a series of large, focal images. You can find different examples of them on [the homepage](http://www.nichols.edu) and landing pages (like [this one for Admissions](http://www.nichols.edu/admissions/)). The first pass on making these images adaptive involved the `picture` element for which [the spec](https://html.spec.whatwg.org/multipage/embedded-content.html#adaptive-images) is known. The markup we were generating was based on the pattern outlined for [Picturefill](http://scottjehl.github.io/picturefill/), a JavaScript polyfill that implements adaptive images in browsers that don’t:

```html
<picture class="page__image-header__photo">
  <!--[if IE 9]><video style="display: none;"><![endif]-->
  <source srcset="about_940_343_int_s_c1_full.jpg" media="(min-width: 40em)" />
  <source srcset="about_800_350_int_c1_medium.jpg" media="(min-width: 20em)" />
  <source srcset="about_480_350_int_c1_small.jpg" />
  <!--[if IE 9]></video><![endif]-->
  <img src="{made}" alt="" />
</picture>
```

To get to that point, however, we needed to use CE Image to generate (and cache) the specific sizes we needed:

```html
<picture class="page__image-header__photo">
  <!--[if IE 9]><video style="display: none;"><![endif]-->
  {exp:ce_img:pair src="{content_focal_image}" filename_suffix="_full"
  width="940" allow_scale_larger="yes" crop="yes" interlace="yes" cache_dir="/"
  }
  <source srcset="{made}" media="(min-width: 40em)" />
  {/exp:ce_img:pair} {exp:ce_img:pair src="{content_focal_image}"
  filename_suffix="_medium" width="800" height="600" crop="yes" interlace="yes"
  cache_dir="/" }
  <source srcset="{made}" media="(min-width: 20em)" />
  {/exp:ce_img:pair} {exp:ce_img:pair src="{content_focal_image}"
  filename_suffix="_small" width="480" height="360" crop="yes" interlace="yes"
  cache_dir="/" }
  <source srcset="{made}" />
  <!--[if IE 9]></video><![endif]-->
  <img src="{made}" alt="" />
  {/exp:ce_img:pair}
</picture>
```

Not what’s a lot of code, so let’s just look at one segment of that jumble:

```html
{exp:ce_img:pair src="{content_focal_image}" filename_suffix="_full" width="940"
allow_scale_larger="yes" crop="yes" interlace="yes" cache_dir="/" }
<source srcset="{made}" media="(min-width: 40em)" />
{/exp:ce_img:pair}
```

This is an example using CE Image’s tag pair option, which lets you control the markup output. In the opening tag, we set several properties:

- `src` is the path to the original image uploaded by content authors;
- `filename_suffix` is the suffix we want added to the cached file to differentiate it from others in the cache (and make the files more easily scannable);
- `width` is our desired output width for the generated image;
- `allow_scale_larger` does exactly what you’d expect: it dictates whether or not CE Image should scale the image to reach the desired width;
- `crop` tells CE Image whether it’s okay to crop the image;
- `interlace` tells CE Image to use image interlacing (which can speed load time); and
- `cache_dir` tells CE Image where to store the cached image (in relation to our global configuration)

Then, within the tag pair is the `source` element with the `srcset` value set to the path to the file CE Image generated (referenced by the `made` variable) and the associated media query.

Multiply that a few times for the different sizes and you have the full `picture` element.

Now that’s all well and good, but shortly after launch, [Eric Portis](http://ericportis.com/) wrote [an amazing post explaining how the `srcset` and `sizes` attributes operate](http://ericportis.com/posts/2014/srcset-sizes/) and it cleared up a lot of my confusion on the matter. He convinced me that the age-old `img` element, with these new attributes, would be far more maintainable. With a fire in my belly, I rewrote the markup:

```html
<img class="page__image-header__photo" alt=""
    {exp:ce_img:pair
        src="{embed:image}"
        filename_suffix="_small"
        width="480"
        height="320"
        crop="yes"
        interlace="yes"
        cache_dir="/"
        }
        src="{made}"
        srcset="{made} 480w,
    {/exp:ce_img:pair}
    {exp:ce_img:pair
        src="{embed:image}"
        filename_suffix="_medium"
        width="800"
        height="600"
        crop="yes"
        interlace="yes"
        cache_dir="/"
        }
        {made} 800w,
    {/exp:ce_img:pair}
    {exp:ce_img:pair
        src="{embed:image}"
        filename_suffix="_full"
        width="940"
        allow_scale_larger="yes"
        crop="yes"
        interlace="yes"
        cache_dir="/"
        }
        {made} 940w"
    {/exp:ce_img:pair}
    >
```

The CE Image behavior is exactly the same, but the resulting markup is much clearer:

```html
<img
  class="page__image-header__photo"
  alt=""
  src="about_480_320_int_c1_small.jpg"
  srcset="
    about_480_320_int_c1_small.jpg  480w,
    about_800_350_int_c1_medium.jpg 800w,
    about_940_343_int_s_c1_full.jpg 940w
  "
/>
```

The added bonus of this approach is that I am not hard-coding any media queries and the browser gets to make the ultimate decision of which image to request. All I am doing is telling the browser the image options and their respective widths within the `srcset` attribute. As all of the images take up 100% of their containers, I didn’t even need to use the `sizes` attribute. Easy peasy.

## "Nice to Have" Images

Not every image adds something to the page. Some are purely optional, a visual enhancement. In order to reduce the size of pages on smaller screens, we often choose to "lazy load" certain image assets after page load, when we know there is enough room to display the image or when we feel it would be an enhancement to the design.

Now some of you might be wondering: _Why not just `display:none` below a certain threshold?_ Well, I’ll tell you: images that are hidden with CSS are still requested by the browser. That means users who don’t see the images are still paying to download them (whether in terms of time waiting for the page to render or actual money on a metered connection). That kinda sucks for them. We should show our users a bit more respect and only request the images when we need them.

We wrote [a lazy-loading image script](https://github.com/easy-designs/easy-lazy-images.js) a few years back and have battle tested it on numerous sites to great success. It’s all based on a simple markup pattern:

```html
<div
  class="module__image image--lazy"
  data-image-src="Tim-Smith_220x140_220_140_int_c1.jpg"
></div>
```

The `data-img-src` attribute defines the path to the "nice to have" image and then the JavaScript adds the image element into the page when the appropriate conditions are met:

```html
<div
  class="module__image image--lazy"
  data-image-src="Tim-Smith_220x140_220_140_int_c1.jpg"
  data-image-loaded=""
>
  <img alt="" src="Tim-Smith_220x140_220_140_int_c1.jpg" />
</div>
```

Pretty simple. It even supports `srcset`:

```html
<div
  class="module__image image--lazy"
  data-image="about_480_320_int_c1_small.jpg"
  data-image-srcset="about_480_320_int_c1_small.jpg 480w,
                      about_800_350_int_c1_medium.jpg 800w,
                      about_940_343_int_s_c1_full.jpg 940w"
></div>
```

The [full documentation is up on Github](https://github.com/easy-designs/easy-lazy-images.js#usage).

Implementing this in the context of CE Image was a breeze and builds on the `source` pattern I showed earlier:

```html
{if testimonial_photo} {exp:ce_img:pair src="{testimonial_photo}" width="223"
height="140" allow_scale_larger="yes" crop="yes" interlace="yes" cache_dir="/" }
<div class="module__image image--lazy" data-image-src="{made}"></div>
{/exp:ce_img:pair} {/if}
```

We are only just beginning to scratch the surface of what’s possible with adaptive images and I am sure we will come up with newer, better ways to do this stuff. Heck, there may even be an adaptive images add-on in the pipeline for ExpressionEngine. But, in the meantime, if you are trying to implement adaptive images with ExpressionEngine, CE Image is a good way to go.
