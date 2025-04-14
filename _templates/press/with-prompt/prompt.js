// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
import tags from "../../../_cache/tags.json" with { type: "json" };

export default [
	{
		type: "input",
		name: "title",
		message: "What's the press item’s title?",
		validate: (value) => (!value ? "Title cannot be empty" : true),
	},
	{
		type: "input",
		name: "date",
		message: "When did it publish? (YYYY-MM-DD)",
		validate: (value) =>
			!value.match(/\d{4}-\d{2}-\d{2}/)
				? "Date must be in the format YYY-MM-DD"
				: true,
	},
	{
		type: "multiselect",
		name: "tags",
		message: "Tag this article",
		choices: tags,
		multiple: true,
		limit: 10,
	},
	{
		type: "input",
		name: "publisher",
		message: "Where was it published?",
		validate: (value) => (!value ? "Publisher cannot be empty" : true),
	},
	{
		type: "input",
		name: "url",
		message: "What’s the link?",
	},
	{
		type: "input",
		name: "description",
		message: "Describe or excerpt the press item",
	},
];
