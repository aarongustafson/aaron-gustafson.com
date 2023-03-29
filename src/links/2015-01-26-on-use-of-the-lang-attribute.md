---
title: "On Use of the `lang` Attribute"
date: 2015-01-26 11:32:05 -05:00
comments: false
ref_url: https://blog.adrianroselli.com/2015/01/on-use-of-lang-attribute.html
in_reply_to: https://blog.adrianroselli.com/2015/01/on-use-of-lang-attribute.html
ref_source: Adrian Roselli’s Blog
---

Adrian has put together a great overview of why `lang` is important and how many sites are using it. Here are a few takeaways:

<blockquote>
  <ol>
    <li>VoiceOver on iOS uses the attribute to auto-switch voices.</li>
    <li>VoiceOver can speak a particular language using a different accent when specified.</li>
    <li>Leaving out the `lang` attribute may require the user to manually switch to the correct language for proper pronunciation.</li>
    <li>JAWS uses it to load the correct phonetic engine/phonologic dictionary — Handy for sites with multiple languages.</li>
    <li>NVDA (Windows) uses it in the same way as VoiceOver and JAWS.</li>
    <li>When used in HTML that is used to form an ePub or Apple iBooks document, it affects how VoiceOver will read the book.</li>
    <li>Firefox, IE10, and Safari (as of a year ago) only support CSS `hyphens: auto` when the `lang` attribute is set.</li>
  </ol>
</blockquote>

Thanks for putting this together Adrian!