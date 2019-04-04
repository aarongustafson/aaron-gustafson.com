---
layout: page
title: Headshots of Me
description: "If you’re looking for photos of me, look no further."
footer: true
show_title: false
sharing: false
sidebars: [asides/networks.html,asides/events.html]
---

# Headshots

{% assign cloudinary = "https://res.cloudinary.com/aarongustafson/image/fetch/c_fill/c_scale,w_auto:breakpoints/" | append:site.url %}

<aside class="alternate">{{ site.data.microcopy.about.bio_promo | markdownify }}</aside>

<ul class="listing listing--gallery">
  <li class="listing__item listing__item--photo">
    <figure id="headshot-2014">
      <a href="/i/headshots/2014.jpg">
        <img src="{{ cloudinary }}/i/headshots/2014-sm.jpg" alt="" width="310" height="310">
      </a>
      <figcaption>710px × 710px. Headshot by <a href="https://www.flickr.com/photos/chlobotphoto">Chloe Wright</a> circa 2014</figcaption>
    </figure>
  </li>
  <li class="listing__item listing__item--photo">
    <figure id="headshot-doll">
      <a href="/i/headshots/doll.jpg">
        <img src="{{ cloudinary }}/i/headshots/doll-sm.jpg" alt="" width="310" height="310">
      </a>
      <figcaption>960px × 960px. Doll by <a href="https://www.etsy.com/shop/N3rdWool">N3rdWool</a> circa 2013</figcaption>
    </figure>
  </li>
  <li class="listing__item listing__item--photo">
    <figure id="headshot-2013">
      <a href="/i/headshots/2013.jpg">
        <img src="{{ cloudinary }}/i/headshots/2013-sm.jpg" alt="" width="310" height="310">
      </a>
      <figcaption>3000px × 2000px. Headshot by <a href="https://www.flickr.com/photos/johndavey/">John Davey</a> circa 2013</figcaption>
    </figure>
  </li>
  <li class="listing__item listing__item--photo">
    <figure id="headshot-2007">
      <a href="/i/headshots/2007.jpg">
        <img src="{{ cloudinary }}/i/headshots/2007.jpg" alt="" width="310" height="310">
      </a>
      <figcaption>576px × 383px. Headshot by <a href="https://www.flickr.com/photos/cindyli/">Cindy Li</a> circa 2007</figcaption>
    </figure>
  </li>
  <li class="listing__item listing__item--photo">
    <figure id="headshot-avatar">
      <a href="/i/headshots/avatar-cornell.jpg">
        <img src="{{ cloudinary }}/i/headshots/avatar-cornell-sm.png" alt="" width="310" height="310">
      </a>
      <figcaption>490px × 504px. Illustration by <a href="http://bearskinrug.co.uk">Kevin Cornell</a> circa 2008</figcaption>
    </figure>
  </li>
</ul>