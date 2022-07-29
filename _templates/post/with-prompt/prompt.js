// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
module.exports = [
  {
    type: 'input',
    name: 'title',
    message: "Title?",
    validate: (value) => !value ? "Title cannot be empty" : true
  },
  {
    type: 'input',
    name: 'description',
    message: "Description"
  },
  {
    type: 'input',
    name: 'twitter_text',
    message: "Text for Twitter"
  },
  {
    type: 'list',
    name: 'tags',
    message: "Enter tags, separated by commas"
  },
  {
    type: 'input',
    name: 'in_reply_to',
    message: "URL of the post to reply to"
  }
]
