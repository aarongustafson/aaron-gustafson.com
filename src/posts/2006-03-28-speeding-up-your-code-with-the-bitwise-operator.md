---
title: "Speeding up your code with the Bitwise Operator (&)"
date: 2006-03-28 14:01:11
comments: false
tags:
  - "performance"
  - "web development"
  - "career"
description: "While building a Flash game, I wrote some code to alternate through squares on a grid system and it seemed rather slow. My code made use of the % (modulo) operator and, thinking that was the cause, I went in search of a better solution..."
canonical: "https://blog.easy-designs.net/archives/speeding-up-your-code-with-the-bitwise-operator/"
---

<p><img alt="" class="feature" id="image95" src="/i/posts/2006-03-28/binary.gif"/></p>

<!-- more -->

<p>While building a Flash game, I wrote some code to alternate through squares on a grid system and it seemed rather slow. My code made use of the <code>%</code> (modulo) operator and, thinking that was the cause, I went in search of a better solution. I blew the dust off the Bitwise operator (<code>&amp;</code>) and researched what it actually does. As it turns out, <a href="http://www.easy-designs.net/articles/theBitwiseOperator/index.php">this little bit of programming’s past can be quite handy</a>.</p>
<p>Comments <span class="amp">&amp;</span> corrections are always welcome and if you have any similiar tricks to share, I’d love to hear about them.</p>
