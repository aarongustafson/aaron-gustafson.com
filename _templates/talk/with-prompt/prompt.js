// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//

const fs      = require('fs');
const events  = JSON.parse( fs.readFileSync('./src/_data/speaking_engagements.json') );
const tags    = JSON.parse( fs.readFileSync('./_cache/tags.json') );

function getEvents( subset ) {
	var choices = [];
	events.map(event => {
		if ( !subset || ( subset instanceof Array && subset.indexOf(event.id) > -1 ) )
		{
			choices.push({ 
				message: `${event.title} (${event.date})`,
				value: event.id
			});
		}
	});
	return choices;
}

function getEventDate( selected_events ) {
	selected_events.sort();
	var id = selected_events[0];
	var event = events.find(evt=>evt.id == id);
	return event.date.replace(/(\d) ([+-]\d)/,"$1$2").replace(" ","T");
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
				type: "multiselect",
				name: "category",
				message: "What kind of talk was this?",
				choices: ['talk', 'keynote', 'workshop', 'guest lecture', 'panel', 'lightning-talk', 'webinar']
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
						type: 'input',
						name: 'date',
						message: "When was this first given?",
						initial: getEventDate(events)
					},
					{
						type: 'confirm',
						name: 'has_slides',
						message: 'Slides?'
					},
					{
						type: 'select',
						name: 'slidesevent',
						message: 'What event is this slide deck from?',
						choices: getEvents(events),
						skip(){
							return !this.state.answers.has_slides;
						}
					},
					{
						type: 'form',
						name: 'slides',
						message: 'Please provide the slide deck details',
						skip(){
							return !this.state.answers.has_slides;
						},
						choices: [
							{ name: 'slideslink', message: 'Link to talk on Noti.st' },
							{ name: 'slidesembed', message: 'Embed URL' },
							{ name: 'slidesdownload', message: 'Download URL (start with the year folder on GitHub)' },
							{ name: 'slidessize', message: 'Size of the download' }
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
						message: 'What event is the video from?',
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
							{ name: 'videoembed', message: 'Embed URL' },
							{ name: 'videofile', message: 'Video File' }
						]
					},
					{
						type: 'confirm',
						name: 'has_audio',
						message: 'Audio?'
					},
					{
						type: 'select',
						name: 'audioevent',
						message: 'What event is this audio from?',
						choices: getEvents(events),
						skip(){
							return !this.state.answers.has_audio;
						}
					},
					{
						type: 'form',
						name: 'audio',
						message: 'Please provide the audio details',
						skip(){
							return !this.state.answers.has_audio;
						},
						choices: [
							{ name: 'audiofile', message: 'Audio File' }
						]
					},
					{
						type: 'form',
						name: 'text',
						message: 'If this exists as a text version…',
						choices: [
							{ name: 'texturl', message: 'What’s the URL?' }
						]
					}
				];

				return inquirer
								.prompt(questions)
								.then(nextAnswers => Object.assign({}, answers, nextAnswers))
			})
	},
};
