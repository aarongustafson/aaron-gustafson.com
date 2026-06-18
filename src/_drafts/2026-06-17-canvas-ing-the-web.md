---
title: "Canvas-ing the Web"
ref_source: "Eric Meyer"
date: 2026-06-17 11:30:00 +00:00
comments: true
tags: ["HTML", "CSS", "JavaScript", "web standards", "web components"]
description: "Eric Meyer digs into Chrome’s flag-gated HTML-in-canvas API with a real use case—saving social media banners as images—and surfaces a fundamental tension between canvas’s fixed-size raster model and the DOM’s fluid, content-driven sizing."
twitter_text: "Eric Meyer’s hands-on with HTML-in-canvas is the kind of piece only someone who actually tried to ship it could write. The technical frustrations are real; the architectural tension is more interesting."
ref_url: https://meyerweb.com/eric/thoughts/2026/04/27/canvas-ing-the-web/
in_reply_to: https://meyerweb.com/eric/thoughts/2026/04/27/canvas-ing-the-web/
---

Eric Meyer took Chrome’s flag-gated HTML-in-canvas API for a real spin—not a toy demo, but a practical tool he built at Igalia for generating social media thumbnails—and wrote up everything that bit him along the way. The `moveBefore()` trick to avoid blowing the call stack when inserting a custom element into a canvas is exactly the kind of hard-won detail you only get from someone who actually shipped the thing.

The implementation snags are interesting, but what I keep coming back to is the underlying tension Eric identifies: canvases want fixed dimensions; the DOM wants to grow and shrink with content. HTML-in-canvas is rasterizing something inherently fluid into something inherently bounded, sixty frames per second. For Eric’s use case—capturing a mostly-static banner as a PNG—that tradeoff is manageable. For general-purpose UI? Less so.

His closing musing is the part worth sitting with: maybe what we actually need isn’t HTML-in-canvas, but a CSS property or HTML attribute that marks standard elements as more visually manipulable. We’ve reached for that before (Houdini, old IE filters), never quite landed it. HTML-in-canvas might be the path that teaches us what that simpler primitive should look like—by showing us, painfully, what it needs to make possible.
