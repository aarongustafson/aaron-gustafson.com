const data = require("./../src/_data/books_forewords.json");
const folder = "./src/publications/books";
const fs = require("fs");
const slugify = require("slugify");

data.forEach((item) => {
	let slug = slugify(`${item.title} ${item.subtitle ? item.subtitle : ""}`)
		.replace(/["':()]/g, "")
		.toLowerCase();
	var contents = `---
title: "${item.title}"
subtitle: "${item.subtitle ? item.subtitle : ""}"
author: "${item.author}"
date: ${item.published}
type: "foreword"
tags: []
publisher: ""
url: "${item.url}"
cover: "${item.cover}"
width: "${item.width}"
---

${item.notes}
`;

	fs.writeFileSync(`${folder}/${slug}.md`, contents);
});
