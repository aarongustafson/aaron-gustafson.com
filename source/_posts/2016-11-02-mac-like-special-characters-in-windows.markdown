---
layout: post
title: "Mac-like Special Characters in Windows"
date: 2016-11-02 11:59:42 -0400
comments: true
categories: [windows,writing]
description: "I love the way OS X/macOS handles special characters and was looking to implement something similar on Windows. Here’s how I did it."
crosspost_to_medium: true
---

I am a bit of a geek for proper punctuation: Em dashes… en dashes… curly quotes… ellipses… I love them all! Prior to 2007, I was a long-time Windows user and was a master of the <kbd>Alt + <var>numeric code</var></kbd> system of entering special characters on that operating system.[^1] For nearly a decade, however, I’ve been writing and developing on a Mac and I absolutely love how much easier it is to use special characters.  When I started setting up my new Surface Book, I began searching for a way to bring Mac-like special character entry to Windows 10.

[^1]: I actually memorized a ton of [the codes](http://tools.oratory.com/altcodes.html), much to my amazement. I still remember a few, but I am thankful to have reclaimed a bit of that memory space over the last few years.

<!-- more -->

*Disclaimer: I take absolutely no credit for the code you see below. I will give full credit to the sources as I discuss each. I just wanted to bring it all into one place so it’ll save you a few hours of research to get everything working.*

## Step 1: Set up AutoHotKey

[David Nagel’s solid article on mapping keystrokes in Windows](https://thejournal.com/articles/2016/01/26/how-to-create-keyboard-shortcuts-for-special-characters-in-windows-10.aspx), I introduced me to [AutoHotKey](https://autohotkey.com/). It’s an incredibly powerful program that’s like the lovechild of [TextExpander](https://textexpander.com/) and [Quicksilver](https://qsapp.com/).

In his article, David walks through the process of getting set up with AutoHotKey:

1. [Download](https://autohotkey.com/download/) & install it.
2. Create a new `.ahk` file (<samp>New > AutoHotKey Script</samp> in Windows Explorer) and name it whatever you like.[^2]
3. Right-click the script, and choose <samp>Edit Script</samp> from the context menu.
4. Enter some keyboard shortcuts (more on that in a moment).
5. Save the script. I chose to save it to Dropbox to make it portable.
6. Double click it to run the script.
7. Open up your favorite writing tool and see your handiwork in action.

[^2]: If you shun the mouse, you can create a text file in your favorite editor and name it with the `.ahk` extension, but you might run into character encoding issues. I created mine in [VS Code](https://code.visualstudio.com/) as UTF-8, but had to open the file in Notepad and re-save it again to get it to actually work. I never figured out the exact issue, but I thought I’d give you a heads-up.

## Step 2: Create some shortcuts

AutoHotKey is completely scriptable and adding shortcuts is relatively straightforward. There are a few reserved characters, but once you understand what they are it’s pretty easy to get going very quickly. Here’s Dave’s intro example:

{% gist f59fead5a44734d31a20106d79d41c98 sample.ahk embed %}

In AutoHotKey scripting, “!” stands in for <kbd>Alt</kbd> and “+” stands in for <kbd>Shift</kbd>. So, to translate:

1. <kbd>Alt + -</kbd> will produce an en dash (–)
2. <kbd>Shift Alt + -</kbd> will produce an em dash (—)

With these two examples, I was able to jump right in and map many of the most common shortcuts I use while writing. Before I got too far, however, I realized I really needed accents, umlauts, and the like. I searched some more and eventually discovered [a post in the AutoHotKey forum archive by "Veil" from way back in 2008](https://autohotkey.com/board/topic/27801-special-characters-osx-style).

Veil broke his solution into two parts, but I’ve combined them here to make it easier for your to copy into your AutoHotKey script file. This code has provided everything I’ve needed so far, so Veil—wherever you are—**thank you**!

{% gist f59fead5a44734d31a20106d79d41c98 osx-special-chars.ahk  embed %}

## Step 3: Run your script when Windows starts

The last thing you’ll want to do is add your `.ahk` file to Windows’ startup items. Dave covered that in his piece as well:

1. Create a shortcut to your file (<samp>Right click > Create Shortcut</samp>)
2. Run `shell:startup` (<kbd>⊞ Win + R</kbd> opens the Run dialog or you can type ”Run“ in the Cortana Search Box)
3. Move your shortcut to the folder that opens.

Once you’ve followed those steps, you’re done. You can update your `.ahk` scripts needed and just double click it to replace the instance that’s currently running.

<hr>

If, like me (and [Dave](https://twitter.com/search?q=%23davegoeswindows) and [Jonathan](https://snook.ca/archives/other/running-into-windows) and [Dan](http://danielmall.com/articles/opening-windows/)), you’re using Windows after a long time in Mac land *and* you’re a typography nerd, hopefully you’ll find this helpful. And if you come up with any improvements to the character mapping, please share!