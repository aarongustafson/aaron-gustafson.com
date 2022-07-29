// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
module.exports = [
  {
    type: 'input',
    name: 'title',
    message: "What's the event?",
    validate: (value) => !value ? "Event name cannot be empty" : true
  },
  {
    type: 'input',
    name: 'date',
    message: "What's the date? (YYY-MM-DD)",
    validate: (value) => !value.match(/\d{4}-\d{2}-\d{2}/) ? "Date must be in the format YYY-MM-DD" : true
  },
  {
    type: 'input',
    name: 'location',
    message: "Where is it?"
  },
  {
    type: 'input',
    name: 'url',
    message: "Is there a link to the event?"
  }
];
