import tags from "../../../_cache/tags.json" with { type: "json" };

export default [
	{
		type: "input",
		name: "title",
		message: "What's the podcast episode title?",
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
		message: "Tag this podcast",
		choices: tags,
		multiple: true,
		limit: 10,
	},
	{
		type: "input",
		name: "publisher",
		message: "What podcast were you on?",
		validate: (value) => (!value ? "Publisher cannot be empty" : true),
	},
	{
		type: "input",
		name: "episode",
		message:
			"If there is an episode number associated with it, enter that here",
	},
	{
		type: "input",
		name: "url",
		message: "What’s the link?",
		validate: (value) => (!value ? "URL cannot be empty" : true),
	},
	{
		type: "input",
		name: "description",
		message: "Describe or excerpt the article",
	},
];
