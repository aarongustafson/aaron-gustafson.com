---
title: "Alex Russell is not a heretic"
date: 2007-09-10 20:39:05
comments: true
tags:
  - "web standards"
  - "HTML"
  - "CSS"
  - "animation"
  - "web development"
description: "First off, let me preface this by saying I just got back to the East Coast after catching a red-eye from San Francisco on Saturday night, so if I seem a bit incoherent, that’s likely why."
canonical: "https://blog.easy-designs.net/archives/alex-russell-is-not-a-heretic/"
---

<p>First off, let me preface this by saying I just got back to the East Coast after catching a red-eye from San Francisco on Saturday night, so if I seem a bit incoherent, that’s likely why.</p>

<!-- more -->

<p>In perhaps the most intellectually-stimulating session at <a href="http://therichwebexperience.com">The Rich Web Experience</a>, <a href="http://alex.dojotoolkit.org">Alex Russell</a> (of <a href="http://dojotoolkit.org">Dojo Toolkit</a> fame) tackled the topic of <a href="http://alex.dojotoolkit.org/?p=622">Standards Heresy</a>.</p>
<p>For those who are not aware, Alex was once a staunch standards advocate who has turned to what he considers, “the dark side.” In truth, he’s sick and tied of the dysfunctional nature of the <abbr title="World Wide Web Consortium">W3C</abbr> and other similar organizations and I can’t say I blame him. As his session pointed out, the <abbr title="World Wide Web Consortium">W3C</abbr> has 60+ paid, full-time staff and yet we saw literally no movement on either (X)<abbr title="HyperText Markup Language"><span class="caps">HTML</span></abbr> or <abbr title="Cascading Style Sheets"><span class="caps">CSS</span></abbr> for over five years. <em>That</em> is a travesty.</p>
<p>In my opinion, fault lies not with the individuals on the various committees and sub-committees, but rather, with the process. And this isn’t just a problem in the <abbr title="World Wide Web Consortium">W3C</abbr>, an organization comprised almost entirely of representatives from the various software vendors (Microsoft, <abbr title="America Online"><span class="caps">AOL</span></abbr>, Opera, etc.) which pay tens of thousands a year to take part. Look at what’s happening with JavaScript 2 in <span class="caps">ECMA.</span> Or <span class="caps">HTML</span>5 for that matter—“just because it is an “open” organization which “anyone can join” doesn’t make the <span class="caps">WHAT</span> <span class="caps">WG</span> any better. They are all flawed because the process is flawed, and I think that is Alex’s main point (despite his assertion that the <span class="caps">WHAT</span> <span class="caps">WG</span> is not dysfunctional).</p>
<p>So why is the process flawed? Well, for one, spec writing is largely an academic undertaking. In many cases there are invited experts in a Working Group (such as Andy Clarke in the <abbr title="Cascading Style Sheets"><span class="caps">CSS</span></abbr> one), but, for the most part, specs are written by people who are not in the trenches. As Alex rightly points out, in fact, many times, the specs are nothing more than an official blessing of some proprietary technique or technology created by a member company. And good ideas that may be very useful to designers or developers are lost because of internal politics or because a browser vendor thinks it would be “too hard” to implement.</p>
<p>Which brings me to Alex’s “heresy.” In his session, he proudly declared himself a heretic because he sees a need for innovation in (X)<abbr title="HyperText Markup Language"><span class="caps">HTML</span></abbr> which is currently unavailable because the specs are not evolving quickly enough. I feel his pain, but I think he is looking at the problem the wrong way. He sees the spec (and web standards in general) as stifling innovation. I see web standards as facilitating innovation. After all, were it not for the firm foundation of well-formed documents and a unified <abbr title="Document Object Model"><span class="caps">DOM</span></abbr> (no matter how piecemeal the implementations), we’d still be writing spaghetti code whenever we tried to do anything with JavaScript. It is because of web standards that we can write clean JavaScript and that we can make truly innovative interactions that take us beyond what is allowed for in the specs themselves.</p>
<p>But back to Alex’s complaint…as his example of how Dojo is heretical, he showed this code example:</p>
```html
  <div dojoType="dijit.form.HorizontalSlider"
   name="horizontal1"
   onChange="dojo.byId('slider1input').value=arguments[0];"
   value="10"
   maximum="100"
   minimum="0"
   showButtons="false"
   intermediateChanges="true"
   style="width:50%; height: 20px;"
   id="slider1">
   <!– … –>
  </div>
```
<p>The problem that Dojo is attempting to solve here is the inclusion of a slider form control, which does not exist under <a href="http://w3.org/TR/html4/interact/forms.html">the current <abbr title="HyperText Markup Language"><span class="caps">HTML</span></abbr> Forms spec</a>. In order to function, the widget requires several custom attributes to be placed on the element to provide information to assist in the creation of that slider. The fact that Alex “cannot” add these attributes to the document and maintain <abbr title="eXtensible HyperText Markup Language"><span class="caps">XHTML</span></abbr> validity is a major source of annoyance for him and part of why he has decided that validation is no longer important.</p>
<p>But the truth is that Alex could make any or all of these attributes available to whatever elements he wants and still have a validating document by simply creating a <abbr title="Document Type Definition"><span class="caps">DTD</span></abbr> (based on any existing (X)<abbr title="HyperText Markup Language"><span class="caps">HTML</span></abbr> one) to include them. After all, the X in <abbr title="eXtensible HyperText Markup Language"><span class="caps">XHTML</span></abbr> stands for extensible…the language is meant to be improved. Sure, there are some standardistas who think we shouldn’t muck about with the standards, but the powers that be put that extensibility in there for a reason (and I don’t think it was just as a tease). By extending the language to mix in features we desperately need, we drive innovation and, who knows, perhaps someone will take notice and add our extensions into the next version, thereby driving the evolution of the language so many of us desperately want.</p>
<p>The same goes for <abbr title="Cascading Style Sheets"><span class="caps">CSS</span></abbr>. The <abbr title="World Wide Web Consortium">W3C</abbr> made <abbr title="Cascading Style Sheets"><span class="caps">CSS</span></abbr> extensible by allowing for custom properties utilizing the <code>-*-</code> syntax. Chances are, you’ve come across this when implementing <code>-moz-border-radius</code> or <code>-webkit-border-radius</code> (which, honestly, both seem superfluous to me when the <span class="caps">CSS</span>3 spec includes <code>border-radius</code> as an actual property…why not just support that?). In my mind, this is ripe for use in extension of <abbr title="Cascading Style Sheets"><span class="caps">CSS</span></abbr>, not by individual browser vendors (as that is proprietary and closed), but by us (in an open, cross-browser/cross-platform way) to achieve what we want or need that <abbr title="Cascading Style Sheets"><span class="caps">CSS</span></abbr> currently does not offer us. That was the basis for my work on gFSS (an experiment in presentational Flash generated from <abbr title="Cascading Style Sheets"><span class="caps">CSS</span></abbr>, debuted at Web Directions North this year) and another project I will be releasing in the next few months.</p>
<p>So, long story, long, I don’t think that Alex is a heretic. I think he can make a solid case for extending the language (and the interface) of the web for his particular needs (or the needs of his toolkit) as long as he backs it up with documentation in the form of a custom <abbr title="Document Type Definition"><span class="caps">DTD</span></abbr>.</p>
<h3>An aside</h3>
<p>I do have one problem with what Alex wants, however (or at least what he chooses as a code example) and that problem is the extension of the language, but rather the way in which it was done (i.e. the <span class="caps">DIV</span> in his example will degrade to nothing without JavaScript enabled). <a href="http://dojotoolkit.org/book/dojo-book-0-4/part-8-internationalization-and-accessiblity/accessibility/web-accessibility-issu">Dojo supports <span class="caps">WAI</span>-<span class="caps">ARIA</span></a> to improve the accessibility of this and many other widgets, which is commendable, but that extra markup is only generated when the Dojo methods are run. If JavaScript is turned off in his example, no form control is available whatsoever.</p>
<p>What I’d prefer to see is something like this:</p>
```html
  <select class="dojo-form-horizontalSlider"
   name="horizontal1"
   showButtons="false"
   intermediateChanges="true"
   id="slider1">
   <option>0</option>
   <option>5</option>
   <option selected="selected">10</option>
   <!– … –>
   <option>100</option>
  </select>
```
<p>There’s nothing that could keep Dojo from parsing that bit of <abbr title="eXtensible HyperText Markup Language"><span class="caps">XHTML</span></abbr> and gleaning from it what it needs to make the slider. And now, when Dojo doesn’t run, there is a degradable interface for the user to adjust the setting. Sure, it may not be nearly as nice, but at least it works. Plus, it allows Dojo to be added as a progressive enhancement, which is what it should be.</p>
<p>And to make this valid syntax, the Dojo team just needs to augment the <abbr title="eXtensible HyperText Markup Language"><span class="caps">XHTML</span></abbr> 1.0 Strict <abbr title="Document Type Definition"><span class="caps">DTD</span></abbr> like this to include the custom attributes:</p>
```text
  <!ENTITY % Boolean
    "(true | false)"
    >
  …
  <!– attributes for Dojo Toolkit
    showButtons           display buttons (boolean)
    intermediateChanges   display intermediate steps (boolean)
  –>
  <!ENTITY % dojo-attrs
    "showButtons          %Boolean    #IMPLIED
     intermediateChanges  %Boolean    #IMPLIED"
    >
  …
  <!ATTLIST select
    %attrs;
    name        CDATA          #REQUIRED
    size        %Number;       #IMPLIED
    multiple    (multiple)     #IMPLIED
    disabled    (disabled)     #IMPLIED
    tabindex    %Number;       #IMPLIED
    onfocus     %Script;       #IMPLIED
    onblur      %Script;       #IMPLIED
    onchange    %Script;       #IMPLIED
    %dojo-attrs;
    >
```
<p>Sure, it takes a little extra work, but at least it gives users of the Dojo Toolkit the ability to validate their documents, which will help reduce potential <abbr title="Cascading Style Sheets"><span class="caps">CSS</span></abbr> and JavaScript conflicts and errors (just one of the many benefits of web standards). Beyond that, it takes advantage of the extensibility of the language to facilitate innovation, and isn’t innovation what we all really want to see?</p>
