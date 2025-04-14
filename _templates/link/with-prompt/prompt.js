// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//

import tags from "../../../_cache/tags.json" with { type: "json" };

export default [
	{
		type: "input",
		name: "title",
		message: "Title",
		validate: (value) => (!value ? "Title cannot be empty" : true),
	},
	{
		type: "input",
		name: "source",
		message: "Source",
		validate: (value) => (!value ? "Source cannot be empty" : true),
	},
	{
		type: "input",
		name: "url",
		message: "URL",
		validate: (value) => (!value ? "Source cannot be empty" : true),
	},
	{
		type: "input",
		name: "description",
		message: "Description",
	},
	{
		type: "input",
		name: "twitter_text",
		message: "Text for Twitter",
	},
	{
		type: "multiselect",
		name: "tags",
		message: "Choose tags (you can add new ones later)",
		choices: tags,
		multiple: true,
		limit: 10,
	},
	{
		type: "input",
		name: "quote",
		message: "Anything you want to quote?",
	},
	{
		type: "input",
		name: "via_name",
		message: "Did someone else post this?",
	},
	{
		type: "input",
		name: "via_url",
		message: "What's the URL?",
		skip() {
			return !this.state.answers.via_url;
		},
	},
];
