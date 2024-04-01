---
title: "No Robots(.txt): How to Ask ChatGPT and Google Bard to Not Use Your Website for Training"
date: 2024-04-01T20:52:49.884Z
tags: ["AI/ML"]
ref_url: https://www.eff.org/deeplinks/2023/12/no-robotstxt-how-ask-chatgpt-and-google-bard-not-use-your-website-training
in_reply_to: https://www.eff.org/deeplinks/2023/12/no-robotstxt-how-ask-chatgpt-and-google-bard-not-use-your-website-training
twitter_text: "Want to keep your site from being indexed by LLMs? "
ref_source: "Electronic Frontier Foundation"
---

The Electronic Frontier Foundation (EFF) has you covered if you’d like to opt out of being indexed into tools like Open AI’s ChatGPT and Google’s Gemini. Just add these to your robots.txt file:

```
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /
```

Building on this, you could exclude specific directories (e.g., where you keep your images):

```
User-agent: GPTBot
Disallow: /i/

User-agent: Google-Extended
Disallow: /i/
```

I’ve decided to (for now at least) allow my text content to be indexed, but I may change my mind in the future.
