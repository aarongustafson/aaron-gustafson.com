---
title: "Template-based Asset Munging in ExpressionEngine"
date: 2010-07-11 12:28:47
comments: true
tags:
  - "performance"
  - "ExpressionEngine"
  - "CSS"
  - "JavaScript"
description: "In our years of working with ExpressionEngine, we’ve tweaked our standard setup quite a few times. We generally handle most every asset, including CSS and JavaScript, as a template. Being a bit obsessed with organization and overall..."
canonical: "https://blog.easy-designs.net/archives/template-based-asset-munging-in-expressionengine/"
---

<p>In our years of working with ExpressionEngine, we’ve tweaked our standard setup quite a few times. We generally handle most every asset, including CSS and JavaScript, as a template. Being a bit obsessed with organization and overall maintainability of code, we separate out our styles and scripts into separate templates for each major concern (e.g. typography, color, screen layout, etc.).</p>

<!-- more -->

<figure><img alt="" src="/i/posts/2010-07-11/2010-07-11-style-templates.png"/></figure>
<p>A while back, it was not uncommon for us to include each of these assets into the document separately, but, as website optimization and performance folks will tell you, all of that separation leads to a lot of additional overhead because the browser must request each of those files individually. In the interest of streamlining the download process, we decided to merge all of the stylesheets together at the template level before sending them over the wire. Here’s the simple recipe we devised:</p>
```css
  /* ———————————
   * Core Stylesheet
   * Created by Easy! Designs, LLC
   * http://easy-designs.net
   * ——————————— */
  
  {embed="styles/reset"}
  
  {embed="styles/typography"}
  
  @media screen {
    {embed="styles/layout-screen"}
  }
  
  @media print {
    {embed="styles/layout-print"}
  }
  
  {embed="styles/color"}
  
  {embed="styles/effects"}
```
<p>This framework allows us to pull in each template in the optimum way for progressive enhancement with only a single download on the user end, which is much faster. And server-side caching only adds to the speed improvements. Beyond that, we can continue to add new <code class="css">@media</code> blocks (including media queries) as necessary either within the embedded files or in this master one.</p>
<p>We use a similar setup for our JavaScript:</p>
```js
  {embed="javascripts/jquery.FunctionHandler"}
  {embed="javascripts/jquery.hoverIntent"}
  {embed="javascripts/eCSStender"}
  
  /* Individual page handlers go here */
```
<p>In this particular example, we’re including two jQuery plugins: <a href="http://github.com/easy-designs/FunctionHandler.js">FunctionHandler</a> and <a href="http://cherne.net/brian/resources/jquery.hoverIntent.html">hoverIntent</a>, along with <a href="http://eCSStender.org">eCSStender</a> before adding our <a href="/notebook/a-new-onload-scheme/">page-specific code in FunctionHandler registrations</a>. (jQuery itself is loaded in from Google.)</p>
<p>Using ExpressionEngine’s template system to manage the munging like this is dead simple and (from our experience evaluating other people’s EE setups) often underused. Give it a shot on your next project.</p>
