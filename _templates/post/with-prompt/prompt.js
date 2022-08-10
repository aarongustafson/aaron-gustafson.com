// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//

const fs     = require('fs');
const tags   = JSON.parse( fs.readFileSync('./_cache/tags.json') );
const series = JSON.parse( fs.readFileSync('./_cache/series.json') );

function getSeries() {
  var choices = [{
    message: 'None',
    value: ''
  }];
  for ( tag in series ) {
    choices.push({ 
      message: series[tag],
      value: tag
    });
  };
  return choices;
}

module.exports = [
  {
    type: 'input',
    name: 'title',
    message: "Title",
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
    type: 'multiselect',
    name: 'tags',
    message: "Choose tags (you can add new ones later)",
    choices: tags,
    multiple: true,
    limit: 10
  },
  {
    type: 'select',
    name: 'series',
    message: "Is this part of an existing series?",
    choices: getSeries(),
    limit: 10,
    result(name){
      return name === "None" ? "" : name;
    }
  },
  {
    type: 'input',
    name: 'in_reply_to',
    message: "URL of the post to reply to"
  }
]
