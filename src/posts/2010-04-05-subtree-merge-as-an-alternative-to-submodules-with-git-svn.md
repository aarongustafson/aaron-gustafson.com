---
title: "Subtree merge as an alternative to submodules with git svn"
date: 2010-04-05 10:45:21
comments: false
tags:
  - "developer tools"
  - "software development"
description: "We use Subversion as our version control system for all client work here at Easy because we absolutely love Springloops’ hosted Subversion service , but we use Git for all of our open source projects because, well, Git is a lot more fun…"
canonical: "https://blog.easy-designs.net/archives/subtree-merge-as-an-alternative-to-submodules-with-git-svn/"
---

<p>We use <a href="http://subversion.tigris.org/">Subversion</a> as our version control system for all client work here at Easy because we absolutely love <a href="http://www.springloops.com/v2?r=131284121846315085" rel="external">Springloops’ hosted Subversion service</a>, but we use <a href="http://www.kernel.org/pub/software/scm/git/docs/" rel="external">Git</a> for <a href="http://github.com/easy-designs" rel="external">all of our open source projects</a> because, well, Git is a lot more fun to work with and we love the community that’s built up around <a href="http://github.com" rel="external">Github</a>. In order to have the best of both worlds when working on client projects, we use <a href="http://www.kernel.org/pub/software/scm/git/docs/git-svn.html" rel="external">git-svn</a> as our front-end to Subversion. It’s a great tool, but it’s not without its limitations. One such limitation is its inability to translate <a href="http://www.kernel.org/pub/software/scm/git/docs/user-manual.html#submodules" rel="external">Git submodules</a> into <a href="http://svnbook.red-bean.com/en/1.0/ch07s03.html" rel="external">svn:externals</a>. Thankfully, Git offers an alternative that is comparable and plays nicely with Subversion: <a href="http://www.kernel.org/pub/software/scm/git/docs/howto/using-merge-subtree.html" rel="external">the subtree merge</a>.</p>

<!-- more -->

<p>When attempting to <code class="shell">dcommit</code> a Git repository containing a submodule, you’ll likely receive a message like this:</p>
<blockquote cite="http://de-co-de.blogspot.com/2009/02/git-svn-and-submodules.html">
<p>952bee47201e87b0b0e851bcbe6c8940d429cda0 doesn’t exist in the repository at /usr/local/git/libexec/git-core/git-svn line 3787 Failed to read object 952bee47201e87b0b0e851bcbe6c8940d429cda0 at /usr/local/git/libexec/git-core/git-svn line 480</p>
</blockquote>
<p>That annoying message is the painful reminder that you need to find another way to add content from another project into your repository. Subtree merge to the rescue!</p>
<p>If you’ve already hit the error, go ahead and delete your submodule folder(s) and the <code>.gitmodules</code> file and commit the changes to your repository to make the path available again. Next, from a shell within the root of your Git repository enter these commands at the prompt (replacing the capitalized phrases with your relevant information):</p>
<ol>
<li><code class="shell">git remote add -f LOCAL_NAME PATH/TO/GIT/REPOSITORY</code></li>
<li><code class="shell">git merge -s ours --no-commit LOCAL_NAME/BRANCH_NAME</code></li>
<li><code class="shell">git read-tree --prefix=PATH/I/WANT/IT/IN/ -u LOCAL_NAME/BRANCH_NAME </code></li>
<li><code class="shell">git commit -m "Merge of PROJECT"</code></li>
<li><code class="shell">git pull -s subtree LOCAL_NAME master</code></li>
</ol>
<p>To provide a fully fleshed-out example for you, I used the following to merge the master branch of eCSStender into the path <code>vendors/ecsstender</code> within another project.</p>
<ol>
<li><code class="shell">git remote add -f eCSStender git://github.com/easy-designs/eCSStender.js.git</code></li>
<li><code class="shell">git merge -s ours --no-commit eCSStender/master</code></li>
<li><code class="shell">git read-tree --prefix=vendors/ecsstender/ -u eCSStender/master</code></li>
<li><code class="shell">git commit -m "Merge of eCSStender into the vendors directory"</code></li>
<li><code class="shell">git pull -s subtree eCSStender master</code></li>
</ol>
<p>The beauty of this is that you can use that last line to pull in the latest version of the external project and then all you have to do is <code class="shell">dcommit</code> the changes to get them into Subversion. Problem solved.</p>
