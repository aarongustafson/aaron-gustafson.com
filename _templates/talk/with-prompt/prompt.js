// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//

const fs      = require('fs');
const events  = JSON.parse( fs.readFileSync('./src/_data/speaking_engagements.json') );
const tags    = JSON.parse( fs.readFileSync('./_cache/tags.json') );

function getEvents( subset ) {
  var choices = [];
  events.map(event => {
    if ( !subset || subset instanceof Array && subset.indexOf(event.id) > -1 )
    {
      choices.push({ 
        message: `${event.title} (${event.date})`,
        value: event.id
      });
    }
  });
  return choices;
}

module.exports = {
  prompt: ({ inquirer }) => {
    
    const questions = [
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
        type: 'form',
        name: 'copresenter',
        message: 'Co-presenter (if any):',
        choices: [
          { name: 'name', message: 'Name' },
          { name: 'url', message: 'URL' }
        ]
      },
      {
        type: "select",
        name: "category",
        message: "What kind of talk was this?",
        choices: ['talk', 'keynote', 'workshop', 'panel', 'lightning-talk']
      },
      {
        type: 'multiselect',
        name: 'tags',
        message: "Tag this talk",
        choices: tags,
        multiple: true,
        limit: 10
      },
      {
        type: 'multiselect',
        name: 'events',
        message: "Which event(s) did you present this at?",
        choices: getEvents()
      }
    ];

    return inquirer
      .prompt(questions)
      .then(answers => {
        
        const { events } = answers;
        
        const questions = [
          {
            type: 'confirm',
            name: 'has_slides',
            message: 'Slides?'
          },
          {
            type: 'form',
            name: 'slides',
            message: 'Please provide the slide deck details',
            skip(){
              return !this.state.answers.has_slides;
            },
            choices: [
              { name: 'slidesurl', message: 'Link URL' },
              { name: 'slidesembed', message: 'Embed URL' },
              { name: 'slidesdownload', message: 'Download URL' }
            ]
          },
          {
            type: 'confirm',
            name: 'has_video',
            message: 'Video?'
          },
          {
            type: 'select',
            name: 'videoevent',
            message: 'What event is this from?',
            choices: getEvents(events),
            skip(){
              return !this.state.answers.has_video;
            }
          },
          {
            type: 'form',
            name: 'video',
            message: 'Please provide the video details',
            skip(){
              return !this.state.answers.has_video;
            },
            choices: [
              { name: 'videourl', message: 'Link URL' },
              { name: 'videoembed', message: 'embed URL' }
            ]
          }
        ];

        return inquirer
                .prompt(questions)
                .then(nextAnswers => Object.assign({}, answers, nextAnswers))
      })
  },
};
