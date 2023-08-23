// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
const fs   = require('fs');
const tags = JSON.parse( fs.readFileSync('./_cache/tags.json') );

module.exports = [
  {
    type: 'input',
    name: 'title',
    message: "What's the book’s title?",
    validate: (value) => !value ? "Title cannot be empty" : true
  },
  {
    type: 'input',
    name: 'subtitle',
    message: "If it has a subtitle, enter that here"
  },
  {
    type: 'input',
    name: 'date',
    message: "When did it publish? (YYYY-MM-DD)",
    validate: (value) => !value.match(/\d{4}-\d{2}-\d{2}/) ? "Date must be in the format YYY-MM-DD" : true
  },
	{
    type: 'input',
    name: 'author',
    message: "Who is on the book’s byline?",
    validate: (value) => !value ? "Author cannot be empty" : true
  },
  {
		type: "select",
		name: "type",
		message: "What kind of contribution did you make?",
		choices: ['authored', 'foreword', 'contributed']
	},
	{
		type: 'multiselect',
		name: 'tags',
		message: "Tag this article",
		choices: tags,
		multiple: true,
		limit: 10
	},
  {
    type: 'input',
    name: 'publisher',
    message: "Who published it?",
    validate: (value) => !value ? "Publisher cannot be empty" : true
  },
  {
    type: 'input',
    name: 'url',
    message: "What’s the link?",
    validate: (value) => !value ? "URL cannot be empty" : true
  },
	{
		type: 'input',
		name: 'full_text',
		message: "If the full text of the contribution is available at a URL, enter that here"
	},
	{
		type: 'input',
		name: 'description',
		message: "Describe the book"
	}
];
