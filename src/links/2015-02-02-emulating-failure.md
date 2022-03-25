---
title: "Emulating failure"
date: 2015-02-02 07:09:54 -05:00
comments: false
ref_url: http://www.paciellogroup.com/blog/2015/02/emulating-failure/
in_reply_to: http://www.paciellogroup.com/blog/2015/02/emulating-failure/
ref_source: The Paciello Group
---

Another beautifully-eloquent post about the potential perils of [Web Components](http://www.w3.org/wiki/WebComponents/):

> HTML has a problem. As implemented in browsers many interactive elements cannot be styled as desired by web developers, or developers as directed by designers, marketing or any of the numerous others whose wishes code cutters must abide by.

> …

> Now in 2015 we have web components re-inventing native HTML buttons, radio buttons and checkboxes, for relief from the scourge of divitis, perpetrated upon us by the as shipped inability to style a native HTML element as desired.

> Is it just me, or are new web UI technologies continuing to try to solve the wrong problems?

Now, the [Shadow DOM](http://glazkov.com/2011/01/14/what-the-heck-is-shadow-dom/) (and [associated pseudo-elements](https://gist.github.com/webtobesocial/aefd6e25064c08e0cc9a)) should allow us to control the style of these elements. The deeper problem is functionality. Take [the `datalist` for predictive typing](https://html.spec.whatwg.org/multipage/forms.html#the-datalist-element). What if you want fuzzy search instead of initial search when someone types. That’s not supported. This is where Web Components get interesting.

_Note: I no longer use “native” in this context, but it remains in quoted material._
