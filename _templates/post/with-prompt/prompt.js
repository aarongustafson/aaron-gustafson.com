// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//

import series from "../../../_cache/series.json" with { type: "json" };
import tags from "../../../_cache/tags.json" with { type: "json" };

function getSeries() {
	var choices = [
		{
			message: "None",
			value: "",
		},
	];
  Object.keys(series).forEach((key) => {
    choices.push({
			message: series[key],
			value: key,
		});
  })
	return choices;
}

export default [
	{
		type: "input",
		name: "title",
		message: "Title",
		validate: (value) => (!value ? "Title cannot be empty" : true),
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
		type: "select",
		name: "series",
		message: "Is this part of an existing series?",
		choices: getSeries(),
		limit: 10,
		result(name) {
			return name === "None" ? "" : name;
		},
	},
	{
		type: "input",
		name: "in_reply_to",
		message: "URL of the post to reply to",
	},
];
