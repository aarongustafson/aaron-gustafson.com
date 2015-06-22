---
layout: post
title: "Where Do We Go From Here?"
date: 2015-06-22 11:49:56 -0400
comments: true
categories: ["progressive enhancement",accessibility,"responsive web design"]
description: "I had the great pleasure of delivering the closing keynote for the final Responsive Day Out. Here’s what I had to say."
twitter_text: "Here’s my closing keynote from Responsive Day Out 3."
---

*I had the great pleasure of delivering the closing keynote for the final Responsive Day Out. Here’s what I had to say.*

<!-- more -->

<hr>

Today has provided an amazing tour of the world of responsive design. We’ve seen how to level-up our workflows and processes. We’ve learned new ways to improve the accessibility of our products. We’ve grappled with modern CSS and HTML capabilities that help us embrace the hugely variable display sizes that swirl and whirl around us.

We’ve explored the future of modular code and browsers’ capacity for working without network connectivity. And we’ve even taken a trip into the possible future of where the web might go.

<figure id="figure-2015-06-22-01">
{% adaptive_image /i/posts/2015-06-22/01.jpg %}
</figure>

We’ve come a long way since [Ethan’s article](https://huffduffer.com/adactio/243780), fluid grids, flexible media, and media queries. Those three tenets sowed a seed that has grown and flourished as we have come to better understand the implications of device proliferation. We’ve seen that the web is capable of going anywhere and doing pretty much anything.

I would argue that ["Responsive Web Design"](https://huffduffer.com/adactio/243780) was the first article that really managed to capture the concepts that John Allsopp had discussed so many years before in [“A Dao of Web Design”](http://www.alistapart.com/articles/dao/) and distilled them into something the design and development community could really sink their teeth into. It provided a concrete example of the web’s ability to flex and mold itself into whatever shape it needed to take on.

It was the first time many designers had come to terms with the idea that "experience" was not some monolithic thing.

Sure, many of us in the web standards community had been talking the talk and walking the walk with regard to [progressive enhancement](http://alistapart.com/article/understandingprogressiveenhancement). And we were gaining converts, but progress was slow. Ethan demonstrated—directly and succinctly—what the progressive enhancement of visual design could look like.

Providing an identical experience for each and every human being that tries to access our sites would be impossible. There are simply far too many factors to consider. We’ve got screen size, display density, CPU speed, amount of RAM, sensor availability, feature availability, interface methods … *breathe* … operating system type, operating system version, browser type, browser version, plug-ins installed, network speed, network latency, network congestion, firewalls, proxies, routers, and probably a dozen other factors my mind is incapable of plucking amid the whirlwind of technical considerations.

**And that doesn’t even consider our users.**

When it comes to the people we need to reach for our work to actually matter, we have to consider literacy level, reading acumen, level of domain knowledge, cognitive impairments like learning disabilities and dyslexia, attention deficit issues, environmental distractions, vision impairment, hearing impairment, motor impairment, how much they understand how to use their device, how much they understand how to use their browser, how well-versed in common web conventions they are, and a ton of other "human factors".

Every person is different and everyone comes to the web with their own set of special needs. Some are always with them, blindness for example. Others are transient, like breaking your mousing arm. Still others are purely situational and dependent on the device you are using at the time and its technical capabilities or constraints.

Trying to devise one monolithic experience for each and every person to have in every context that considers every factor would be impossible. And yet, Sir Tim Berners Lee had a vision for a web that was capable of going anywhere. Was he insane?

[Sir Tim’s vision for the web](http://www.w3.org/History/1989/proposal.html) was that content could be created once and accessed from anywhere. Disparate but related pieces of "hypermedia" scattered across the globe could be connected to one another via links. Moreover, they would be retrievable by anyone on any device capable of reading HTML. For free.

**Ultimately, Sir Tim envisioned universal accessibility.**

For a great many of us, ensuring our websites are accessible is an afterthought. We talk a good game when it comes to “user centered” this or that, but often treat the word “accessibility” as a synonym for “screen reader”. It’s so much more than that. “Accessibility” is about people. People consume content and use interfaces in many different ways, some similar and some quite dissimilar to how we do it.

Sure, people with visual impairments often use a screen reader to consume content. But they might also use a braille touch feedback device or a braille printer. They probably also use a keyboard. Or they may use a touchscreen in concert with audio cues. Or they may even use a camera to allow them to "read" content via OCR and text-to-speech. And yes, visual impairment affects a decent percentage of the populace (especially as we age), but it is only part of the “accessibility” puzzle.

The contrast between text and the background is an important factor in ensuring content remains readable in different lighting situations. Color choice is an accessibility concern.

The language we use on our sites and in our interfaces directly affects how easy it is for our users to understand what we do, the products we are offering, and why it matters. It also affects how we make our users feel about themselves, their experience, and our companies. Language is an accessibility concern.

The size of our web pages has a direct effect on how long our pages take to download, how much it costs our customers to access them, and (sometimes) even whether or not the content can be reached. Performance is an accessibility concern.

I could keep going, but I’m sure you get the point.

Accessibility is about providing good experiences for everyone, regardless of physical or mental abilities, gender, race, or language. It recognizes that we all have special needs—physical limitations, bandwidth limitations, device limitations—that may require us to  experience the same interface in different ways.

When I visit a website on my phone, for example, I am visually limited by my screen resolution (especially if I am using a browser that encourages zooming) and I am limited in my ability to interact with buttons and links because I am browsing with my fingertips, which are larger and far less accurate than a mouse cursor.

On a touchscreen, I may need the experience to be slightly different, but I still need to be able to do whatever it is I came to the site to do. I need *an* experience, but moreover I need the *appropriate* experience.

Embracing the reality that experience does’t need to be just one thing will help us reach more people with fewer headaches. Experience can—and should—be crafted as a continuum. This is progressive enhancement: We start with a baseline experience that works for everyone—content, real links, first generation form controls, and forms that actually submit to the server. Then we build up the experience from there.

<figure id="figure-2015-06-22-02">
{% adaptive_image /i/posts/2015-06-22/02.gif %}
</figure>

Your browser supports HTML5 form controls? Great! You’ll get a better virtual keyboard when you go to type your email address. You can use CSS? Awesome, let me make that reading experience better for you. Oh, you can handle media queries! Let me adjust the layout so those line lengths are a little more comfortable. Wow, your browser supports Ajax?! Here let me load in some teasers for related content you might find interesting.

Imagine sitting down in a restaurant only to have the waiter immediately bring you a steak. But you’re a vegetarian. You ask if they offer something you can eat and they politely reply *Oh I’m sorry, meat is a requirement. Why don’t you just eat meat? It’s easy! You’re really missing out on some tasty food.* No waiter who actually cares about your experience would do that.

And yet we—as an industry—don’t seem to have any problem telling someone they need to change their browser to accommodate us. That’s just wrong. Our work is meaningless without users. We should be bending over backwards to attract and retain them. This is customer service 101.

This comes back to Postel's law, which Jeremy often recounts:

> Be conservative in what you do, be liberal in what you accept from others.

We need to be lax when it comes to browser support and not make to many (or better yet any) assumptions about what we can send. 

Of course this is not an approach everyone in our industry is ready to embrace, so I’ll offer another quote I come back to time and time again…

> When something happens, the only thing in your power is your attitude toward it; you can either accept it or resent it.

We can’t control the world, we can only control our reaction to it.

Now those of you who’ve gathered for this final Responsive Day Out (or who are following along at home) probably understand this more than most. We feel the constant bombardment of new devices, screen sizes, and capabilities. The only way I’ve found to deal with all of this is to accept it, embrace the diversity, and view device and browser proliferation as a feature, not a bug.

It’s up to us to educate those around us who have—either by accident or intent—not accepted that diversity is the reality we live in and things are only going to get crazier. Burying our heads in the sand is not an option.

When I am trying to help folks understand and embrace diversity, I often reach for one of my favorite thought exercises from [John Rawls](https://en.wikipedia.org/wiki/John_Rawls). 

<figure id="figure-2015-06-22-03">
{% adaptive_image /i/posts/2015-06-22/03.jpg %}
</figure>

Rawls was a philosopher who used to run a social experiment with students, church groups, and the like.

In the experiment, participants were allowed to create their ideal society. It could follow any philosophy: It could be a monarchy or democracy or anarchy. It could be capitalist or socialist. The people in this experiment had free rein to control absolutely every facet of the society… but then he’d add the twist: They could not control what position they occupied in that society.

This twist is what [John Harsanyi](https://en.wikipedia.org/wiki/John_Harsanyi)—an early game theorist—refers to as the [“Veil of Ignorance”](https://en.wikipedia.org/wiki/Veil_of_ignorance) and what Rawls found, time and time again, was that individuals participating in the experiment would gravitate toward creating the most egalitarian societies.

It makes sense: what rational, self-interested human being would treat the elderly, the sick, people of a particular gender, race, creed, or color poorly if they could find themselves in that very same position when the veil is pulled away?

The things we do to accommodate special needs now pay dividends in the future. Look at ramps.

<figure id="figure-2015-06-22-04">
{% adaptive_image /i/posts/2015-06-22/04.jpg %}
</figure>

They’re a classic example of an accessibility feature for people in wheelchairs that also benefit people who aren’t in them: People toting luggage, delivery services hauling heavy things on dollies, parents pushing children (or their dressed up dogs) in strollers, a commuter walking her bike, and that guy who just prefers walking up a gentle incline to expending the effort required to mount a step.

When we create alternative paths to get from Point A to Point B, people can take the one most appropriate for them, whether by choice or necessity. And everyone can accomplish their goals.

We all have special needs. Some we’re born with. Some we develop. Some are temporary. Some have nothing to do with us personally, but are situational or purely dependent on the hardware we are using, the interaction methods we have available to us, or even the speed at which we can access the Internet or process data.

What is responsive web design about if not accessibility? Yes, its fundamental tenets are concerned with visual design, but in terms of the big picture, they’re all about providing the best possible reading experience.

As practitioners of responsive design, we understand the benefits of adapting our interfaces. We understand fallbacks. We understand how to design robust experiences that work under a wide variety of conditions. Every day we broaden the accessibility of our products.

These skills will make us invaluable as technology continues to offer novel ways of consuming and interacting with our websites.

We’re just starting to dip or toes—er, hands—into the world of motion-based gestural controls. Sure, we’ve had them in two dimensions on touch screens for a while now but three dimensional motion-based controls are only beginning to appear.

<figure class="video-embed video-embed--16x9" id="figure-2015-06-22-05">
{% youtube VXhhE-l96qQ %}
</figure>

The first big leap in this direction was [Kinect](https://en.wikipedia.org/wiki/Kinect) on the Xbox 360 (and later, Windows). With Kinect, we interact with the computer using body movements like raising a hand (which gets Kinect to pay attention), pushing our hand forward to click/tap, and grasping to drag the canvas in a particular direction.

The Kinect ushered in a major revolution in terms of interfacing with computers, but from an interaction perspective, it presents similar challenges to those of the [Wii controller](https://en.wikipedia.org/wiki/Wii#Wii_Remote) and Sony’s [PlayStation Move](https://en.wikipedia.org/wiki/PlayStation_Move). Large body gestures like raising your hand (or a wand controller) can be tiring. 

<figure class="video-embed video-embed--16x9" id="figure-2015-06-22-06">
{% youtube 21LtA5-wiwU %}
</figure>

They’re also not terribly accurate. If you thought that touchscreen accuracy was an issue, hand gestures like those for the Kinect or [LEAP Motion](https://en.wikipedia.org/wiki/Leap_Motion) pose even more of a challenge.

To accommodate interactions like this (which we currently have no way of detecting) we need to be aware of how easy it is to click on interactive controls. We need to determine if our buttons and links are large enough and whether there is enough space between them to ensure our user’s intent is accurately conveyed to the browser. Two specs which can help address this are Media Queries Level 4 and Pointer Events.

In [Media Queries Level 4](http://dev.w3.org/csswg/mediaqueries-4/), we became able to apply style rules to particular interaction contexts. For instance, when we have very accurate control over our cursor (as in the case of a stylus or mouse) or less accurate control (as in the case of a touch screen or physical gesture):

{% gist 372271534c78cf11d4a6 mq4-pointer.css %}

Of course, we want to offer a sensible default in terms of size and spacing as a fallback for older browsers and devices. 

We also have the ability to determine whether the device is capable of hovering over an element and can adjust the interface accordingly.

{% gist 372271534c78cf11d4a6 mq4-hover.css %}

We still need to figure out how well all of this ends up working on multimodal devices like the Surface tablet, however. Will the design change as the user switches between input modes? Should it? To that end, the spec also provides `any-pointer` and `any-hover` to allow you to query for whether *any* supported interaction method meets your requirements, but here’s a word of warning from the spec:

> Designing a page that relies on hovering or accurate pointing only because `any-hover` or `any-pointer` indicate that an input mechanism with these capabilities is available, is likely to result in a poor experience.

These media query options are starting to roll out in Chrome, Mobile Safari, and Microsoft Edge, so it’s worth taking a look at them.

[Pointer Events](http://www.w3.org/TR/pointerevents/) is another spec that is beginning to gain some traction. It generalizes interaction to a single event rather than forcing us to silo experience into mouse-driven, touch-driven, pen-driven, (sigh) force-driven, and so on.

We can unobtrusively detect support for Pointer Events…

{% gist 372271534c78cf11d4a6 pointer-test.js %}

…and then handle them all in the same way or create branches based on the `pointerType`:

{% gist 372271534c78cf11d4a6 pointer-event.js %}

Of course, in addition to considering the level of accuracy our users have while interacting with our screens, we also need to consider the potentially increased distance at which our users are reading our content.

To that end, I’ve been experimenting with the viewport width (`vw`) unit.

For a long time, I’ve used ems for the layout’s `max-width` (so the line length is proportional to the font size). I also use relative font sizes. With that as the foundation, I can use a media query that matches the maximum width and set the base font size at the vw equivalent at the max width.

{% gist 372271534c78cf11d4a6 vw-scaling.css %}

Then the whole design will simply zoom the layout when viewed beyond that size.

<figure class="video-embed video-embed--16x9" id="figure-2015-06-22-07">
{% youtube 6XoN9mMgI38 %}
</figure>

If you don’t want to turn something like that on automatically, you can enable it to be toggled on and off with JavaScript.

<figure class="video-embed video-embed--16x9" id="figure-2015-06-22-08">
{% youtube 96l_W7ca6SM %}
</figure>

Things get even crazier when you start to factor in devices like the HoloLens. And no, I have not gotten to play with one yet.

<figure class="video-embed video-embed--16x9" id="figure-2015-06-22-09">
{% youtube 3AADEqLIALk %}
</figure>

But the idea of being able to drop a resizable virtual screen on any surface presents some interesting possibilities as a user and some unique challenges as a designer. HoloLens, of course, brings with it gesture controls as well, so accounting for a variety of input types should get us pretty far.

In a similar vein, we should begin to think about what experiences can and should look like when we are browsing solely with our gaze. Gaze tracking has its origins in the accessibility space as a means of providing interface control to folks with limited or no use of their hands. Traditionally, gaze tracking hardware has been several thousand dollars, putting it out of the reach of many people, but that is starting to change.

In the last few years, the computational power of our devices has increased as the hardware costs associated with supporting gaze tracking have dropped dramatically. Looking around, you can see gaze tracking beginning to move into the public sphere: Many smartphones and smartwatches can recognize when you are looking at them (or at least they do sometimes). This is only a short step away from knowing where on the screen you are looking. And nearly every high-end smartphone is now equipped with a front-facing camera which makes them perfect candidates to provide this interaction method. 

<figure class="video-embed video-embed--16x9" id="figure-2015-06-22-10">
{% youtube DEk7PlJWQgI %}
</figure>

The [Sesame Phone](http://sesame-enable.com/phone/) was designed to allow people to use a smartphone without using their hands. It uses facial tracking to move a virtual cursor around the screen, allowing users to interact with the underlying operating system as well as individual applications. It supports tap, swipe, and other gestures (via a context menu) and is pretty impressive in my experience. Technology like this enables people suffering from MS, arthritis, Muscular Dystrophy, and more to use a smartphone and—more importantly to us—browse the web.

[The Eye Tribe](https://theeyetribe.com/) and [Fixational](http://www.fixational.com/) are similarly working to bring eye tracking to smartphones and tablets. Eye tracking is similar to face tracking, but the cursor follows your focus. Micro gestures—blink, wink, etc.—allow you to interact with the device.

Even though most gaze tracking software mimics a mouse and has adjustable sensitivity, the accuracy of it as a pointer device is not fantastic. When I’ve used the Sesame Phone, for instance, I’ve have a hard time controlling the position of my head in order to hold the cursor still to hover and click a button. I’m sure this would improve with practice, but it’s safe to say that in a gaze interaction, larger, well spaced, and more easily targeted links and buttons would be a godsend.

So far, I’ve focused on interaction methods that facilitate navigation and consuming content. But what about filling out a form? I can tell you that typing an email letter-by-letter on a virtual keyboard using your face, sucks…

Thankfully, most of these gestural implementations are coupled with some form of voice recognition. The Kinect, for instance, will accept verbal commands to navigate and accomplish tasks like filling in forms. The Sesame Phone also supports voice commands for certain basic actions, dictating email, and the like.

Coupled with voice, the alternative interaction methods of Kinect and Sesame Phone work really well. But voice interaction can stand on its own too.

Most of us are familiar with [Apple’s Siri](https://en.wikipedia.org/wiki/Siri), [Google Now](https://en.wikipedia.org/wiki/Google_Now), and [Microsoft’s Cortana](https://en.wikipedia.org/wiki/Microsoft_Cortana). These digital assistants are great at retrieving information from select sources and doing other assistant-y things like calculating a tip and setting a reminder. As far as interacting with the web, however, they don’t… yet. We can engage with them, but they can‘t (necessarily) engage with a web page.

Exposing the information stored in our webpages via semantic HTML and structured syntaxes like [microformats](http://microformats.org/), [microdata](https://en.wikipedia.org/wiki/Microdata_(HTML)), and [RDFa](https://en.wikipedia.org/wiki/RDFa) *should* eventually make our content available to these assistants, but we don’t really know. Their various makers haven’t really given us any clue as to how to do that and, as it stands right now, none of them can look up a web page and read it to you. For that you need to invoke a screen reader.

Each company offers a first-party screen reader. And all are capable of helping you interact with a page, including helping you fill in forms, without having to see the page. And yet, these technologies have not been coupled with their corresponding assistants. It probably won’t be long before we see that happen.

When we start to consider how our websites will be experienced in a voice context, the readability of our web pages becomes crucial. Clear well-written prose and a logical source order will be an absolute necessity. If our pages don’t make sense when read, what’s the point?

Content strategist Steph Hay views interface as an opportunity to have a conversation with our users. Soon it literally will be.

Interestingly, Microsoft has given us a peek at what it might be like to design custom voice commands for our websites beyond what the OS natively supports with Cortana. In other words, they let us teach their assistant.

In Windows 10, installable web apps can include a [Voice Command Definition (VCD) file](https://msdn.microsoft.com/en-us/library/windows/apps/dn722331.aspx) in the `head` of the page to enable custom commands:

{% gist 372271534c78cf11d4a6 vcd.html %}

The referenced VCD file is simply an XML file defining the keyword for the web app and commands that can be issued. 

Using very basic syntax, The VCD identifies optional pieces of a given phrase and variables Cortana should extract:

{% gist 372271534c78cf11d4a6 vcd.xml %}

This particular app passes the captured information over to JavaScript for processing. That’s right, [Cortana has a JavaScript API too](https://msdn.microsoft.com/en-us/library/dn722330.aspx#handle_activation_and_execute_voice_commands). Pretty neat.

But traditional computers and smart mobile devices aren’t the only place we’re starting to see voice based experiences. We also have disembodied voices like [Amazon’s Echo](https://en.wikipedia.org/wiki/Amazon_Echo) and [the Ubi](http://www.theubi.com/) which are completely headless.

<figure id="figure-2015-06-22-11">
{% adaptive_image /i/posts/2015-06-22/04.jpg %}
</figure>

Right now, they both seem squarely focused on helping your house become "smarter"—streaming music, adjusting the thermostat, etc.—but it isn’t hard to imagine these devices becoming coupled with the ability to browse and interact with the web.

In the near future, voice-based interactions with the web will be entirely possible. They will likely suck a bit at first, but they'll get better.

I’m going to make a somewhat bold prediction: while touch has been revolutionary in many ways toward improving digital access, voice is going to be even more significant. Voice-based interfaces will create new opportunities for people to interact with and participate in the digital world.

Because we’ve been thinking about how the experiences we create are consumable across a variety of devices, we’ve got the jump on other folks working on the web when it comes to voice. We see experience as a continuum, starting with text.

As voice technology matures, we will be the ones people look to as the experts. We will empower the next generation of websites and applications to become voice-enabled and in so doing, we will improve the lives of billions. Because “accessibility” is not about disabilities, it’s about access and **it’s about people**.

Sure, we’ll make it easier to look up movie times and purchase tickets to see the latest <cite>Transformers</cite> debacle, but we will also empower the nearly 900 million people globally—over 60% of whom are women—that are illiterate. And that’s a population that has been largely ignored on our dominantly textual web.

We will create new opportunities for the poor and disadvantaged to participate in a world that has excluded them. You may not be aware, but 80% of Fortune 500 companies—think Target, Walmart—only accept job applications online or via computers. We will enable people who have limited computer skills or who struggle with reading to apply for jobs with these companies.

We can help bridge the digital divide and the literacy gap. We can create opportunities for people to better their lives and the lives of their families. We have the power to create more equity in this world than most of us have ever dreamed.

This is an incredibly exciting time, not just for the responsive design community, not just the web, but for the world! The future is coming and I can’t wait to see how awesome you make it!

<figure id="figure-2015-06-22-12">
{% adaptive_image /i/posts/2015-06-22/06.jpg %}
</figure>

<hr>

*Responsive Day Out 3: The Final Breakpoint was held in Brighton, UK on 19 June 2015.*

* [Listen to this presentation on Huffduffer](https://huffduffer.com/adactio/243780).
* Read [Orde Saunders’ notes](https://decadecity.net/blog/2015/06/19/aaron-gustafson-where-do-we-go-here) from my talk.
* Read [Hidde de Vries’ recap of the day](https://hiddedevries.nl/en/blog/2015-06-20-responsive-day-out-3-the-final-breakpoint/).