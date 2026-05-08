---
title: "EE Tip: Counting the results of a nested query"
date: 2010-03-17 18:16:25
comments: false
tags:
  - "JavaScript"
  - "ExpressionEngine"
description: "If you’ve built anything remotely challenging in ExpressionEngine, you’ve no doubt discovered things that are easier done in native PHP than in EE tags. A lot of it has to do with how ExpressionEngine parses templates and what gets..."
canonical: "https://blog.easy-designs.net/archives/counting-the-results-of-a-nested-query-in-expressionengine/"
---

<p>If you’ve built anything remotely challenging in ExpressionEngine, you’ve no doubt discovered things that are easier done in native <span class="caps">PHP</span> than in <span class="caps">EE</span> tags. A lot of it has to do with how ExpressionEngine parses templates and what gets parsed first.</p>

<!-- more -->

<p>One recent bugbear I ran into was trying to use the <code class="ee">{count}</code> <span class="initial quote">“</span>magic” variable from a call to <code class="ee">{exp:query}</code> that resided inside a <code class="ee"></code> loop. I needed the <code class="ee">{entry_id}</code> from the entry in the <span class="caps">SQL</span> statement, but <code class="ee">{count}</code> (despite being used inside <code class="ee">{exp:query}</code>) was evaluating as the <code class="ee"></code> count and not the <code class="ee">{exp:query}</code> count. To solve the issue, I came up with the following:</p>
<script src="https://gist.github.com/aarongustafson/335632.js"></script>
<p>You’ll notice I’m using <code class="ee">{exp:query}</code> twice. The first time is to establish a variable in the <span class="caps">SQL</span> connection. Then I am free to use the variable in the second query and the count (returned as <code class="ee">{query_count}</code>) will be a count of the inner loop instead of the outer one.</p>
<p>It is important to note, however, that MySQL will evaluate the variable’s incrementation before paying attention to any <code class="sql">ORDER BY</code> clauses, so your mileage may vary. Regardless, it’s a handy technique.</p>
