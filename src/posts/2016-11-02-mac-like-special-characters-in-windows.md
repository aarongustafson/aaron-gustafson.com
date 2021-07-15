---
title: "Mac-like Special Characters in Windows"
date: 2016-11-02 11:59:42 -04:00
comments: true
tags: [Windows,writing]
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

```txt
!-::–
!+-::—
```

In AutoHotKey scripting, “!” stands in for <kbd>Alt</kbd> and “+” stands in for <kbd>Shift</kbd>. So, to translate:

1. <kbd>Alt + -</kbd> will produce an en dash (–)
2. <kbd>Shift Alt + -</kbd> will produce an em dash (—)

With these two examples, I was able to jump right in and map many of the most common shortcuts I use while writing. Before I got too far, however, I realized I really needed accents, umlauts, and the like. I searched some more and eventually discovered [a post in the AutoHotKey forum archive by "Veil" from way back in 2008](https://autohotkey.com/board/topic/27801-special-characters-osx-style).

Veil broke his solution into two parts, but I’ve combined them here to make it easier for your to copy into your AutoHotKey script file. This code has provided everything I’ve needed so far, so Veil—wherever you are—**thank you**!

```txt
#UseHook
!VKC0SC029::Return 	; grave -> the grave ` accent gave some probs, used the virtualkey + scancode instead
!e::Return         	; acute
!i::Return          ; circumflex
!t::Return         	; tilde
!u::Return          ; umlaut

;                  1 2 3 4 5 6 7 8 9 1
;                                    0
;              r   g G a A c C t T u U
*a::diacritic("a","à,À,á,Á,â,Â,ã,Ã,ä,Ä")
*e::diacritic("e","è,È,é,É,ê,Ê,e,E,ë,Ë")
*i::diacritic("i","ì,Ì,í,Í,î,Î,i,I,ï,Ï")
*o::diacritic("o","ò,Ò,ó,Ó,ô,Ô,õ,Õ,ö,Ö")
*u::diacritic("u","ù,Ù,ú,Ú,û,Û,u,U,ü,Ü")
*n::diacritic("n","n,N,n,N,n,N,ñ,Ñ,n,N")
*y::diacritic("y","y,Y,y,Y,y,Y,y,Y,ÿ,Ÿ")

diacritic(regular,accentedCharacters) {
    StringSplit, char, accentedCharacters, `,
    graveOption            := char1
    graveShiftOption       := char2
    acuteOption            := char3
    acuteShiftOption       := char4
    circumflexOption       := char5
    circumflexShiftOption  := char6
    tildeOption            := char7
    tildeShiftOption       := char8
    umlautOption           := char9
    umlautShiftOption      := char10
    
    if (A_PriorHotKey = "!VKC0SC029" && A_TimeSincePriorHotkey < 2000) {
        if (GetKeyState("Shift")) {
            SendInput % graveShiftOption
        } else {
            SendInput % graveOption
        }
    } else if (A_PriorHotKey = "!e" && A_TimeSincePriorHotkey < 2000) {
        if (GetKeyState("Shift")) {
            SendInput % acuteShiftOption
        } else {
            SendInput % acuteOption
        }
    } else if (A_PriorHotKey = "!i" && A_TimeSincePriorHotkey < 2000) {
        if (GetKeyState("Shift")) {
            SendInput % circumflexShiftOption
        } else {
            SendInput % circumflexOption
        }		
    } else if (A_PriorHotKey = "!t" && A_TimeSincePriorHotkey < 2000) {
        if (GetKeyState("Shift")) {
            SendInput % tildeShiftOption
        } else {
            SendInput % tildeOption
        }
    } else if (A_PriorHotKey = "!u" && A_TimeSincePriorHotkey < 2000) {
        if (GetKeyState("Shift")) {
            SendInput % umlautShiftOption
        } else {
            SendInput % umlautOption
        }
    } else {
        if (GetKeyState("Shift") or GetKeyState("Capslock","T")) {
            SendInput % "+" regular
        } else {
            SendInput % regular
        }
    }
}

;
; Alt + Shift + key
;
*!1::altShift("¡","/")
*!2::altShift("€","™")
*!3::altShift("£","‹")
*!4::altShift("¢","›")
*!5::altShift("8","fi")
*!6::altShift("§","fl")
*!7::altShift("¶","‡")
*!8::altShift("•","°")
*!9::altShift("ª","·")
*!0::altShift("º","‚")

*!a::altShift("å","Å")
*!b::altShift("integral","i")
*!c::altShift("ç","Ç")
*!d::altShift("partial difference","Î")
*!e::altShift("´","‰")
*!f::altShift("ƒ","Ï")
*!g::altShift("©","Ì")
*!h::altShift("overdot","Ó")
*!i::altShift("^","È")
*!j::altShift("delta","Ô")
*!k::altShift("°","Apple")
*!l::altShift("¬","Ò")
*!m::altShift("µ","˜")
*!n::altShift("~","ˆ")
*!o::altShift("ø","Ø")
*!p::altShift("pi","Pi")
*!q::altShift("œ","Œ")
*!r::altShift("®","Â")
*!s::altShift("ß","Í")
;*!t::altShift("†","Ê")
*!u::altShift("¨","Ë")
*!v::altShift("v","lozenge")
*!w::altShift("epsilon","„")
*!x::altShift("approximately equal","Ù")
*!y::altShift("¥","Á")
*!z::altShift("Omega","Û")

*!-::altShift("–","—")
*!=::altShift("!=","±")
*![::altShift("“","”")
*!]::altShift("‘","’")
*!`;::altShift("…","Ú")
*!'::altShift("æ","Æ")
*!\::altShift("«","»")
*!,::altShift("<=","¯")
*!.::altShift(">=","breve")
*!/::altShift("÷","¿")	
    
altShift(accented,accentedShift) {
    if (!GetKeyState("Shift")) {
        SendInput % accented
    } else {
        SendInput % accentedShift
    }
}

; Fix for some CTRL + stuff that may not work
; TODO - Add more as we find them
^a::Send ^{end}^+{home}
^o::WinMenuSelectItem, A, , File, Open
```

## Step 3: Run your script when Windows starts

The last thing you’ll want to do is add your `.ahk` file to Windows’ startup items. Dave covered that in his piece as well:

1. Create a shortcut to your file (<samp>Right click > Create Shortcut</samp>)
2. Run `shell:startup` (<kbd>⊞ Win + R</kbd> opens the Run dialog or you can type ”Run“ in the Cortana Search Box)
3. Move your shortcut to the folder that opens.

Once you’ve followed those steps, you’re done. You can update your `.ahk` scripts needed and just double click it to replace the instance that’s currently running.

<hr>

If, like me (and [Dave](https://twitter.com/search?q=%23davegoeswindows) and [Jonathan](https://snook.ca/archives/other/running-into-windows) and [Dan](http://danielmall.com/articles/opening-windows/)), you’re using Windows after a long time in Mac land *and* you’re a typography nerd, hopefully you’ll find this helpful. And if you come up with any improvements to the character mapping, please share!
