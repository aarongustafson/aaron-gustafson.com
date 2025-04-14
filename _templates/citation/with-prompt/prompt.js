// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
export default [
  {
    type: 'input',
    name: 'title',
    message: "What's the title?",
    validate: (value) => !value ? "Title cannot be empty" : true
  },
  {
    type: 'input',
    name: 'author',
    message: "Who is the author?",
    validate: (value) => !value ? "Author cannot be empty" : true
  },
  {
    type: 'input',
    name: 'url',
    message: "Where can people find it?",
    validate: (value) => !value ? "URL cannot be empty" : true
  },
  {
		type: "select",
		name: "type",
		message: "What category of citation is this?",
		choices: ['code', 'books', 'articles', 'talks'],
    validate: (value) => !value ? "Type cannot be empty" : true
	},
  {
    type: 'input',
    name: 'lang',
    message: "If it’s in another language, enter the language code here"
  },
  {
    type: 'input',
    name: 'dir',
    message: "If the language is rtl, enter that here"
  }
];
