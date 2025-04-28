import { readFileSync } from 'fs';
import { execFile } from 'node:child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current date information
const today = new Date();
const offsetMs = today.getTimezoneOffset() * 60 * 1000;
const msLocal = today.getTime() - offsetMs;
const dateLocal = new Date(msLocal);
const iso = dateLocal.toISOString().slice(0, 19);

// Import JSON data with dynamic imports
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const series = JSON.parse(readFileSync(path.join(__dirname, '_cache/series.json'), 'utf8'));
const tags = JSON.parse(readFileSync(path.join(__dirname, '_cache/tags.json'), 'utf8'));
const events = JSON.parse(readFileSync(path.join(__dirname, 'src/_data/speaking_engagements.json'), 'utf8'));

// Helper functions
const helpers = {
  escapeQuotes: (str) => {
    return str.replace('"', '\\"');
  },
  getTimestamp: () => {
    return `${iso.replace("T", " ")} -07:00`;
  },
  getTags: () => {
    return tags;
  },
  getSeriesName: (tag) => {
    return series[tag];
  },
  getDate: () => {
    return iso.substring(0, 10);
  },
  getFilename: (title, include_date = true) => {
    const date = iso.substring(0, 10);

    // Slugify the title
    let text = title;
    text = text.replace(/^\s+|\s+$/g, "");

    // Make the string lowercase
    text = text.toLowerCase();

    // Remove accents, swap ñ for n, etc
    const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    const to = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (let i = 0, l = from.length; i < l; i++) {
      text = text.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    // Remove invalid chars
    text = text
      .replace(/[^a-z0-9 -]/g, "")
      // Collapse whitespace and replace by -
      .replace(/\s+/g, "-")
      // Collapse dashes
      .replace(/-+/g, "-");

    return include_date ? `${date}-${text}` : text;
  },
  ifEquals: ( value_A, value_B, options ) => {
    return (value_A === value_B) ? options.fn(this) : options.inverse(this);
  },
  ifNotEquals: ( value_A, value_B, options ) => {
    return (value_A !== value_B) ? options.fn(this) : options.inverse(this);
  },
  getEvents: (subset) => {
    var choices = [];
    events.map((event) => {
      if (!subset || (subset instanceof Array && subset.indexOf(event.id) > -1)) {
        choices.push({
          name: `${event.title} (${event.date})`,
          value: event.id,
        });
      }
    });
    return choices;
  },
  getEventDate: (selected_events) => {
    selected_events.sort();
    var id = selected_events[0];
    var event = events.find((evt) => evt.id == id);
    return event.date.replace(/(\d) ([+-]\d)/, "$1$2").replace(" ", "T");
  },
};

// Plop configuration
export default function (plop) {
  // Add helpers to plop
  Object.keys(helpers).forEach(helperName => {
    plop.setHelper(helperName, helpers[helperName]);
  });

  // Custom actions
  plop.setActionType('openFile', async function (answers, config, _plop) {
    const use_date = config.date !== undefined ? config.date : true;
    const filename = `./src/${config.directory}/${helpers.getFilename(answers.title, use_date)}.md`;
    setTimeout(()=>{
      execFile("code", [filename], {shell: true}, (error, stdout, _stderr) => {
        if (error) {
          throw error;
        }
        console.log(stdout);
      });
    }, 3000);
    return;
  });

  // Article generator
  plop.setGenerator('article', {
    description: 'Add a new article',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'What’s the article’s title?',
        validate: (value) => !value ? "Title cannot be empty" : true,
      },
      {
        type: 'input',
        name: 'date',
        message: 'When did it publish? (YYYY-MM-DD)',
        validate: (value) => !value.match(/\d{4}-\d{2}-\d{2}/) ? "Date must be in the format YYY-MM-DD" : true,
        default: helpers.getDate(),
      },
      {
        type: 'checkbox',
        name: 'tags',
        message: 'Tag this article (you can add new ones later)',
        choices: tags.map(tag => ({ name: tag, value: tag }))
      },
      {
        type: "input",
        name: "publisher",
        message: "Where was it published?",
        validate: (value) => !value ? "Publisher cannot be empty" : true,
      },
      {
        type: 'input',
        name: 'url',
        message: 'What’s the link?'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Describe or excerpt the article'
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/publications/articles/{{getFilename title false}}.md',
        templateFile: '_templates/article.md.hbs'
      },
      {
        type: 'openFile',
        date: false,
        directory: 'publications/articles',
      }
    ]
  });

  // Book generator
  plop.setGenerator('book', {
    description: 'Add a new book',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'What’s the book’s title?',
        validate: (value) => !value ? "Title cannot be empty" : true,
      },
      {
        type: "input",
        name: "subtitle",
        message: "If it has a subtitle, enter that here",
      },
      {
        type: 'input',
        name: 'date',
        message: 'When did it publish? (YYYY-MM-DD)',
        validate: (value) => !value.match(/\d{4}-\d{2}-\d{2}/) ? "Date must be in the format YYY-MM-DD" : true,
        default: helpers.getDate(),
      },
      {
        type: "input",
        name: "author",
        message: "Who is on the book’s byline?",
        validate: (value) => (!value ? "Author cannot be empty" : true),
      },
      {
        type: "list",
        name: "type",
        message: "What kind of contribution did you make?",
        choices: ["authored", "foreword", "contributed"],
      },
      {
        type: 'checkbox',
        name: 'tags',
        message: 'Tag this book (you can add new ones later)',
        choices: tags.map(tag => ({ name: tag, value: tag }))
      },
      {
        type: "input",
        name: "publisher",
        message: "Who published it?",
        validate: (value) => !value ? "Publisher cannot be empty" : true,
      },
      {
        type: 'input',
        name: 'url',
        message: 'What’s the link?',
        validate: (value) => !value ? "URL cannot be empty" : true,
      },
      {
        type: "input",
        name: "full_text",
        message: "If the full text of the contribution is available at a URL, enter that here",
        when: ( answers ) => answers.type !== "authored",
      },
      {
        type: 'input',
        name: 'description',
        message: 'Describe the book'
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/publications/books/{{getFilename title false}}.md',
        templateFile: '_templates/book.md.hbs'
      },
      {
        type: 'openFile',
        date: false,
        directory: 'publications/books',
      }
    ]
  });

  // Citation generator
  plop.setGenerator('citation', {
    description: 'Add a new citation',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'What’s the title?'
      },
      {
        type: 'input',
        name: 'author',
        message: 'Who is the author?'
      },
      {
        type: 'input',
        name: 'url',
        message: 'Where can people find it?'
      },
      {
        type: 'list',
        name: 'type',
        message: 'What category of citation is this?',
        choices: ['code', 'books', 'articles', 'talks']
      },
      {
        type: 'input',
        name: 'lang',
        message: 'If it’s in another language, enter the language code here (e.g., “es-MX”)',
        default: ''
      },
      {
        type: 'list',
        name: 'dir',
        message: 'Text direction',
        choices: [
          { name: 'left-to-right (default)', value: '' },
          { name: 'right-to-left', value: 'rtl' }
        ],
        default: ''
      }
    ],
    actions: [
      {
        type: 'modify',
        path: 'src/_data/citations.json',
        transform( original, data ){
          const citationsCopy = JSON.parse(original);
          const citation = {
            title: data.title,
            author: data.author,
            url: data.url,
          };
          
          if (data.lang) {
            citation.lang = data.lang;
          }
          
          if (data.dir) {
            data.dir = data.dir;
          }
        
          citationsCopy[data.type].push(citation);
          return JSON.stringify(citationsCopy, null, 2);
        }
      }
    ]
  });

  // Event generator (you can add other generators similarly)
  plop.setGenerator('event', {
    description: 'Add a new speaking engagement',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'What’s the event?'
      },
      {
        type: 'input',
        name: 'date',
        message: 'What’s the date? (YYY-MM-DD)',
        default: helpers.getDate()
      },
      {
        type: 'input',
        name: 'location',
        message: 'Where is it?',
        default: 'Online'
      },
      {
        type: 'input',
        name: 'url',
        message: 'Is there a link to the event?'
      }
    ],
    actions: [
      {
        type: 'modify',
        path: 'src/_data/speaking_engagements.json',
        transform( original, data ){
          let original_events = JSON.parse(original);
          const new_events = [...original_events].sort((a, b) => {
            return a.id > b.id ? 1 : -1;
          });
          new_events.reverse();

          const event = {
            id: new_events[0].id + 1,
            title: data.title,
            date: `${data.date} 00:09:00 -0800`,
            location: data.location || "Online",
          };
          if (data.url) {
            event.url = data.url;
          }

          new_events.unshift(event);
          return JSON.stringify(new_events, null, 2);
        }
      }
    ]
  });
  
  // Link generator
  plop.setGenerator('link', {
    description: 'Add a new link post',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'Title'
      },
      {
        type: 'input',
        name: 'source',
        message: 'Source'
      },
      {
        type: 'input',
        name: 'url',
        message: 'URL'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description'
      },
      {
        type: "input",
        name: "twitter_text",
        message: "Text for Twitter",
      },
      {
        type: 'checkbox',
        name: 'tags',
        message: 'Choose tags (you can add new ones later)',
        choices: tags.map(tag => ({ name: tag, value: tag }))
      },
      {
        type: "input",
        name: "quote",
        message: "Anything you want to quote?",
      },
      {
        type: "input",
        name: "via_name",
        message: "Did someone else post this?",
      },
      {
        type: "input",
        name: "via_url",
        message: "What's the URL?",
        when: ( answers ) => answers.via_name !== "",
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/links/{{getFilename title}}.md',
        templateFile: '_templates/link.md.hbs'
      },
      {
        type: 'openFile',
        directory: 'links',
      }
    ]
  });

  // Podcast generator
  plop.setGenerator('podcast', {
    description: 'Add a new podcast appearance',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'What’s the podcast episode title?',
        validate: (value) => !value ? "Title cannot be empty" : true,
      },
      {
        type: 'input',
        name: 'date',
        message: 'When did it publish? (YYYY-MM-DD)',
        validate: (value) => !value.match(/\d{4}-\d{2}-\d{2}/) ? "Date must be in the format YYY-MM-DD" : true,
        default: helpers.getDate(),
      },
      {
        type: 'checkbox',
        name: 'tags',
        message: 'Tag this podcast (you can add new ones later)',
        choices: tags.map(tag => ({ name: tag, value: tag }))
      },
      {
        type: "input",
        name: "publisher",
        message: "What podcast were you on?",
        validate: (value) => !value ? "Publisher cannot be empty" : true,
      },
      {
        type: "input",
        name: "episode",
        message: "If there is an episode number associated with it, enter that here",
      },
      {
        type: "input",
        name: "url",
        message: "What’s the link?",
        validate: (value) => !value ? "URL cannot be empty" : true,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Describe the episode'
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/appearances/podcasts/{{getFilename title false}}.md',
        templateFile: '_templates/podcast.md.hbs'
      },
      {
        type: 'openFile',
        date: false,
        directory: 'appearances/podcasts',
      }
    ]
  });

  // Post generator
  plop.setGenerator('post', {
    description: 'Create a new blog post',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'Title'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description'
      },
      {
        type: "input",
        name: "twitter_text",
        message: "Text for Twitter",
      },
      {
        type: 'checkbox',
        name: 'tags',
        message: 'Choose tags (you can add new ones later)',
        choices: tags.map(tag => ({ name: tag, value: tag }))
      },
      {
        type: "list",
        name: "series",
        message: "Is this part of an existing series?",
        choices: Object.keys({ None: "", ...series}).map(tag => ({ name: series[tag], value: tag })),
      },
      {
        type: "input",
        name: "in_reply_to",
        message: "URL of the post to reply to",
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/posts/{{getFilename title}}.md',
        templateFile: '_templates/post.md.hbs'
      },
      {
        type: 'openFile',
        directory: 'posts',
      }
    ]
  });

  // Press appearance generator
  plop.setGenerator('press', {
    description: 'Add a new press appearance',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'What’s the press item’s title?',
        validate: (value) => !value ? "Title cannot be empty" : true,
      },
      {
        type: 'input',
        name: 'date',
        message: 'When did it publish? (YYYY-MM-DD)',
        default: helpers.getDate(),
        validate: (value) => !value.match(/\d{4}-\d{2}-\d{2}/) ? "Date must be in the format YYY-MM-DD" : true,
      },
      {
        type: 'checkbox',
        name: 'tags',
        message: 'What did you talk about?',
        choices: tags.map(tag => ({ name: tag, value: tag }))
      },
      {
        type: "input",
        name: "publisher",
        message: "Where was it published?",
        validate: (value) => !value ? "Publisher cannot be empty" : true,
      },
      {
        type: "input",
        name: "url",
        message: "What’s the link?",
        validate: (value) => !value ? "URL cannot be empty" : true,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Describe or excerpt the press item'
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/appearances/podcast/{{getFilename title false}}.md',
        templateFile: '_templates/podcast.md.hbs'
      },
      {
        type: 'openFile',
        date: false,
        directory: 'appearances/press',
      }
    ]
  });

  // Talk generator
  plop.setGenerator('talk', {
    description: 'Create a new talk post',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'Title'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description'
      },
      {
        type: "confirm",
        name: "has_copresenter",
        message: "Did you have a co-presenter?",
      },
      {
				type: "input",
				name: "copresenter.name",
				message: "What’s their name?",
				when: ( answers ) => answers.has_copresenter,
			},
      {
				type: "input",
				name: "copresenter.url",
				message: "What’s a good URL for them?",
				when: ( answers ) => answers.has_copresenter,
			},

			{
        type: 'list',
        name: 'category',
        message: 'What kind of talk was this?',
        choices: [
					"talk",
					"keynote",
					"workshop",
					"guest lecture",
					"panel",
					"lightning-talk",
					"webinar",
				]
      },
      {
        type: 'checkbox',
        name: 'tags',
        message: 'Choose tags (you can add new ones later)',
        choices: tags.map(tag => ({ name: tag, value: tag }))
      },
      {
        type: "checkbox",
        name: "events",
        message: "Which event(s) did you present this at?",
        choices: helpers.getEvents(),
      },
      {
        type: "input",
        name: "date",
        message: "When was this first given?",
        default: (answers) => helpers.getEventDate(answers.events),
      },
      {
        type: "confirm",
        name: "has_slides",
        message: "Do you have slides to share?",
      },
      {
        type: "list",
        name: "slides.event",
        message: "What event is this slide deck from?",
        choices: ( answers ) => helpers.getEvents(answers.events),
        when: ( answers ) => answers.has_slides,
      },
      {
        type: "input",
        name: "slides.link",
        message: "Link to talk on Noti.st",
        when: ( answers ) => answers.has_slides,
      },
      {
        type: "input",
        name: "slides.embed",
        message: "Embed URL",
        when: ( answers ) => answers.has_slides,
        default: (answers) => answers.slides.link.replace(/^(https:\/\/presentations.aaron-gustafson.com\/.+?)\/.+$/, "$1/embed")
      },
      {
        type: "input",
        name: "slides.download",
        message: "Download URL (start with the year folder on GitHub)",
        when: ( answers ) => answers.has_slides,
        default: `${iso.replace(/^(\d{4}).+$/, "$1")}/`
      },
      {
        type: "input",
        name: "slides.size",
        message: "Size of the download",
        when: ( answers ) => answers.has_slides,
        default: "83.5 MB"
      },
      {
        type: "confirm",
        name: "has_video",
        message: "Is there a video?",
      },
      {
        type: "list",
        name: "video.event",
        message: "What event is the video from?",
        choices: ( answers ) => helpers.getEvents(answers.events),
        when: ( answers ) => answers.has_video,
      },
      {
        type: "input",
        name: "video.link",
        message: "Link URL",
        when: ( answers ) => answers.has_video,
      },
      {
        type: "input",
        name: "video.embed",
        message: "Embed URL",
        when: ( answers ) => answers.has_video,
      },
      {
        type: "input",
        name: "video.file",
        message: "Video File",
        when: ( answers ) => answers.has_video,
      },
      {
        type: "confirm",
        name: "has_audio",
        message: "Is there an audio recording?",
      },
      {
        type: "list",
        name: "audio.event",
        message: "What event is the audio from?",
        choices: ( answers ) => helpers.getEvents(answers.events),
        when: ( answers ) => answers.has_audio,
      },
      {
        type: "input",
        name: "audio.file",
        message: "Audio File",
        when: ( answers ) => answers.has_audio,
      },
      {
        type: "input",
        name: "text_url",
        message: "If this exists as a text version, what’s the URL?",
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/talks/{{getFilename title}}.md',
        templateFile: '_templates/talk.md.hbs'
      },
      {
        type: 'openFile',
        date: false,
        directory: 'talks',
      }
    ]
  });

}