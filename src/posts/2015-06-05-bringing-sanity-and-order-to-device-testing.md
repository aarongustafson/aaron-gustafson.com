---
title: " Bringing Sanity and Order to Device Testing"
date: 2015-06-05 09:56:03 -04:00
comments: true
tags: ["web design",mobile,devices,"progressive enhancement", "web development"]
description: "With the constant onslaught of new devices, form factors, and considerations, it’s tempting to throw up our hands and find another line of work. Thankfully, however, all is not lost."
---

It seems like every other day the public is granted some new means of accessing the web. Some days it’s [a new browser](http://www.engadget.com/2015/04/29/microsoft-edge/). Others it’s [a new smartphone](http://www.pcadvisor.co.uk/reviews/mobile-phone/3504276/yotaphone-2-review-uk-dual-screen-smartphone/). Or [a tablet](http://www.engadget.com/products/microsoft/surface/3/). Or [an e-reader](http://the-digital-reader.com/2014/10/22/voyage-vs-paperwhite-comparison-review-web-browser/). Or [a video game console](https://www.nintendo.com/3ds/internetbrowser/specs/). Or [a smartwatch](http://www.phonearena.com/news/Surf-the-Internet-from-your-Android-Wear-smartwatch-Now-possible-via-this-new-app_id58580). Or [a TV](https://html5test.com/compare/browser/samsungsmarttv-2013.html). Or [a heads-up display](http://www.techradar.com/us/reviews/wearables/microsoft-hololens-1281834/review). Or [a car](http://www.popularmechanics.com/cars/a13191/the-future-of-car-connectivity-is-a-real-web-browser-in-the-dash-17416796/). Or [a refrigerator](http://www.lgblog.lt/2009/10/28/zvilgsnis-atgal-pirmasis-pasaulyje-saldytuvas-su-internetu-lg-internet-digital-dios/).

<!-- more -->

I worked on one project where the client provided me with a spreadsheet detailing 1,400 different user agents that accessed the login screen for the m-dot site. In two days!

As further evidence, consider [the enlightening details of this post from Jason Samuels](http://blog.jasonsamuels.net/post/21633531278/analytics-confirm-the-need-for-adaptive-web-design) of the National Council on Family relations, a non-profit organization:

* In 2008, Internet Explorer dominated as the browser for 93.5% of their visitors. By 2014, that percentage had fallen to 19.7%, with Chrome bringing in the lion’s share of the traffic (37%). Firefox narrowly beat out IE with a 20% share of users.
* In 2008, visits from "mobile" devices accounted for only about 0.1% of their traffic. In 2014, that number had skyrocketed to 14.4%.
* In 2008, they detected 71 different screen resolutions, which is already a lot to consider. By 2014, however, they were seeing 1,000 unique screen resolutions each and every quarter (with over 200 of those recording 10+ visits per quarter).

That last stat blows my mind every time I read it. You can’t design for 200 different screens, let alone 1,000. It’s a fools errand. And don’t even think of trying to test on that many devices.

And yet, here we are designing websites that can (and will) go anywhere. We need to thoroughly test because we can’t make any assumptions about the browsers and devices being used to access our content.

Testing can be tedious, time consuming, and costly. Surely there’s a way to make it easier. There sure is: Instead of getting hung up on creating one experience that needs to be nearly identical on every browser, we can be smarter about how we build things and treat experience as a continuum.

We can build websites that are both nimble enough to work on low powered devices over slow networks *and* smart enough to take advantage of advanced features and sensors when opportunity knocks.

*Wha?! We can have our cake and eat it too*? Yes. Yes we can.

## Start on Solid Footing

When dealing with the insane proliferation of web-enabled devices and the great unknown of where our websites will go, it pays to take a step back and focus on what’s important. We need to ask ourselves two simple questions:

1. What is the purpose of this page, this form, this interface?
2. What is the simplest way to realize that purpose?

Then we need to build that *first*. Typically we’re talking text, some basic HTML, actual links to other pages, and forms that submit to a back-end of some sort. This is our minimum viable product and it will work anywhere.

Then we can look for opportunities to enhance the experience, all while keeping that functional core at the center of the experience.

We can use CSS to add visual hierarchy to the page, provide some visual interest, and adjust the layout to create a good reading experience on a wide range of screen sizes. We should start from the narrowest screen size we can imagine and [let the content guide our breakpoint decisions](https://twitter.com/brad_frost/status/191977076000161793).

We’ll use JavaScript to give real-time feedback to our users. [We’ll hijack forms and links](http://domscripting.com/presentations/xtech2006/) to [lazy load additional content](http://www.filamentgroup.com/lab/ajax-includes-modular-content.html) or otherwise avoid full-page refreshes. Heck, we can even take over the entire page and [convert it into a single page app](http://nerds.airbnb.com/isomorphic-javascript-future-web-apps/).

But we should never sacrifice the functional core. 

This approach to designing for the web is called [progressive enhancement](http://alistapart.com/article/understandingprogressiveenhancement) and it’s the number one tool for dealing with the one-two punch of older browsers and device proliferation.

## Be Conservative in Your Delivery

What makes progressive enhancement so helpful when it comes to dealing with this swirling mass of devices and browsers is that the core experience will *always be* available. There is nothing precluding our users from accessing it, even on a crappy WAP browser or a text-based browser like Lynx or even some [no so far-future talking computer](http://www.theubi.com/) that only "sees" the web as text.

In order to ensure we don’t accidentally deliver advanced features to less capable browsers like these, we just need to be smart about how we load stuff like CSS and JavaScript.

Some basic CSS—think typography, color, etc.—will be usable by just about anyone, so we can put all that stuff in one CSS file (e.g., `basic.css`) and include it with a standard `link`. Then we can tuck all of our layout rules and other advanced CSS into a separate CSS file (e.g., `advanced.css`) that we link to with an associated media query.

```html
<link rel="stylesheet" href="default.css" media="all">
<link rel="stylesheet" href="advanced.css" media="only screen">
```

Any [browsers that don’t understand media queries will ignore the second CSS file entirely](http://www.slideshare.net/bryanrieger/rethinking-the-mobile-web-by-yiibu/106) and receive only the linear, mobile view. Easy peasy, and IE8 gets the mobile layout (a baseline level of support that is not likely to cause you any testing headaches).

You can even take things a step further and use [the `@supports` block](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports) within `advanced.css` to limit certain rule sets to only the browsers that support specific CSS features.

Of course, CSS support issues are nothing compared to JavaScript, so sometimes it’s best not to deliver certain bits of JavaScript-based functionality to browsers that can’t handle it. This is where [feature (and object) detection](http://www.quirksmode.org/js/support.html) becomes incredibly useful:

```js
if ( 'querySelector' in document ) {
  // We can use querySelector!
}
```

You can also use [inverted conditional comments](http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment) to prohibit older versions of IE from getting JavaScript in the first place (which means you don’t even need to worry about debugging JavaScript there). Here’s an example that hides `main.js` from IE8 and below, but makes it available to IE9 on up and to every other non-IE browser.

```html
<!--[if gt IE 8]><!-->
  <script src="main.js"></script>
<!--<![endif]-->
```

By being conservative in what we deliver to browsers we [ensure the greatest level of support, but can still optimize for more advanced ones](http://bradfrost.com/blog/mobile/support-vs-optimization/). This makes testing so much easier because we know older browsers will be okay with the basics and we aren’t trying to use JavaScript features unless we know they’re available.

## Test, Test, Test

Progressive enhancement helps us avoid a lot of rendering and scripting issues before we even get to the testing phase of a project, but eventually we do need to sit down and run our projects through their paces.

In order to keep testing manageable during development, it’s best to test in one browser we know to have good web standards support. It will provide a basic gut-check for our work. Once we are pretty confident things are working as they should be, we can begin more thorough testing on a variety of browsers and devices.

I personally keep several versions of each major browser on my laptop at any given time. I work on a Mac, so I typically have a few versions of Chrome, Firefox, and Opera lying around. You can get older versions of these browsers here:

* [Chromium Archive](http://commondatastorage.googleapis.com/chromium-browser-continuous/index.html)
* [Firefox Archive](http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/)
* [Opera Archive](http://www.opera.com/download//?custom=yes)

It’s near-impossible to get older versions of Safari running on modern versions of OS X, so I typically just have the latest version locally.

For testing on Windows versions of said browsers, I typically have anywhere from 3-5 virtual machines running various Windows versions with their associated browser version and (typically) a copy of Chrome, Firefox, and Opera for good measure. The MS Edge Dev site offers [free Windows VMs for download](https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/). If you’re just looking to get a gut-check in the latest and greatest from Microsoft, there’s also [the Remote.IE service](https://remote.modern.ie/), which allows you to connect to a virtualized version of the browser.

If you develop on Windows or Linux, you’ll need access to a Mac or you’ll have to rely on virtualization to test on that platform. I’ll discuss virtualization in a moment.

Once you’ve thoroughly tested in the various desktop browsers, it’s time to take the deep dive into the world of devices. If you’re unsure where to begin, take a look at your analytics, but take them with a grain of salt. Analytics can lead you to make false assumptions. For example, if you see a low percentage of Blackberry users, could that be because your site just doesn’t work well in Blackberry so they don’t stick around (or come back)? Beware the self-fulfilling prophecy.

If you have the budget, by all means pick up some devices to have on hand for testing. You can use tools like [Adobe’s Edge Inspect](https://creative.adobe.com/products/inspect), [Vanamco’s Ghostlab](http://vanamco.com/ghostlab/), or [Viljami Salminen’s Remote Preview](https://github.com/viljamis/Remote-Preview) (or a combination of all of the above) to synchronize browsing on a handful of devices. Some of these tools also allow for remote inspection of the device to debug CSS and JavaScript. [Weinre](http://people.apache.org/~pmuellr/weinre-docs/latest/) (which Adobe Edge Inspect uses) and [Vorlon.js](http://vorlonjs.com/) also provide remote inspection functionality.

If you are lucky enough to have one nearby, you should stop by your local [open device lab (ODL)](http://opendevicelab.com/) to run your tests. ODLs are free community resources, typically offered by a web design studio or an individual who happens to be sitting on a ton of devices. Someone at the ODL should be able to help you pick out devices to test on and introduce you to the testing tools they have available in the lab.

If you don’t have an ODL nearby, you can also do some guerrilla-style testing in your local mobile phone or electronics store. Just make sure they have real devices… you won’t get far on the fake plastic ones.

If none of these are options for you, there’s always virtualization. You can download and install [emulators for a variety of mobile browsers and devices](http://www.mobilexweb.com/emulators). Additionally, services like [Browserstack](https://www.browserstack.com/) and [CrossBrowserTesting](http://crossbrowsertesting.com/) offer access to hundreds of virtual desktops and devices for a nominal fee.

Virtualization will never give you the same experience as holding a real device in your hand. The performance is rarely the same and you don’t get any sort of feel for how the device responds to your input. I once stumbled on an Android 2.3 bug wherein generated content was being re-generated and re-inserted every time the device was rotated. I doubt I would have discovered that using an emulator. That said, emulators can help you get a rough idea of whether your interface works or not.

Regardless of the means by which you procure your testing devices, try to cover a good cross-section. Pick some low-end ones, a couple older high-end devices, and handful of the latest flagships, and a wide variety of screen sizes and resolutions. Make sure you have good coverage in terms of operating systems too—the latest iOS and Android versions are a given, but make sure you have a Windows device or two, a few Blackberry options, and some older Android and iOS versions in the mix. Then throw in [an oddball](http://www.geekwire.com/2013/microsoft-kin-resurfaces-25-daily-deals-site/) [or two](http://www.windowscentral.com/have-39-spare-then-pick-odd-sylvania-7-netbook-windows-ce) to see if your interfaces hold up.

It’s important to bear in mind that we will never be able to give each user on each device exactly the same experience. We need to be okay with that—experience is a continuum. As long as our users can accomplish what they need to on our sites, they will be well-served.

## Bonus Points: Embrace Patterns

If we really want to make things easy on ourselves (and our team), we should consider building a [pattern library](http://alistapart.com/blog/post/getting-started-with-pattern-libraries) before we build a single page of our website.

Breaking our interfaces down into discrete, repeatable patterns (e.g., a label and form control, a tabbed interface, etc.) lets us look at each in isolation and test it that way too. Testing in isolation is far easier than trying to debug a page with a lot of moving parts.

Gathering our patterns into a live, web-based pattern library  allows anyone on our team to collect the patterns they need to build a given interface as easily as they’d assemble a plate at a smörgåsbord. And if we really want to streamline the building and testing process, we can even [make the patterns importable into the live site](http://ianfeather.co.uk/a-maintainable-style-guide/) so everything stays in sync.

## Don’t Fear the Zombie Apocalypse

With the constant onslaught of new devices, form factors, and considerations, it’s tempting to throw up our hands and find another line of work. The pace of advancement is so brisk, it’s just hard to keep up, let alone feel like we’re on top of where things are headed.

Thankfully, however, all is not lost. By taking a step back and focusing on what matters, embracing experience as a continuum, and being deliberate in how (and when) we deliver certain features and functionality to browsers, we’ll head most issues off at the pass.

This relieves some of the pressure (and frustration) from the testing process and frees us up to test on a wider variety of devices and browsers, which means we’ll be able to provide a solid experience for more users, no matter what marvel of technological wizardry they happen to be using at the time.

Everybody wins.
