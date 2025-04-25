import { readFileSync } from 'fs';
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
};

// Plop configuration
export default function (plop) {
  // Add helpers to plop
  Object.keys(helpers).forEach(helperName => {
    plop.setHelper(helperName, helpers[helperName]);
  });
  plop.setHelper('addEvent', function() {
    const locals = this;
    const new_events = [...events].sort((a, b) => {
      return a.id > b.id ? 1 : -1;
    });
    new_events.reverse();
  
    const event = {
      id: new_events[0].id + 1,
      title: locals.title,
      date: `${locals.date} 00:09:00 -0800`,
      location: locals.location || "Online",
    };
    
    if (locals.url) {
      event.url = locals.url;
    }
  
    new_events.unshift(event);
    return JSON.stringify(new_events, null, 2);
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
        message: 'Event title:'
      },
      {
        type: 'input',
        name: 'date',
        message: 'Event date (YYYY-MM-DD):',
        default: helpers.getDate()
      },
      {
        type: 'input',
        name: 'location',
        message: 'Event location:',
        default: 'Online'
      },
      {
        type: 'input',
        name: 'url',
        message: 'Event URL (optional):'
      }
    ],
    actions: [
      {
        type: 'modify',
        path: 'src/_data/speaking_engagements.json',
        pattern: /(\[)/,
        template: '[{{#with this}}{{addEvent}}{{/with}}'
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
        when: function(answers) {
          return answers.via_name !== "";
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/links/{{getFilename title}}.md',
        templateFile: '_templates/link.md.hbs'
      }
    ]
  });
  
  // Note generator
  plop.setGenerator('note', {
    description: 'Create a new note',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'Note title/content:'
      },
      {
        type: 'checkbox',
        name: 'tags',
        message: 'Select tags:',
        choices: Object.keys(tags).map(tag => ({ name: tag, value: tag }))
      },
      {
        type: 'confirm',
        name: 'syndicate',
        message: 'Syndicate to Twitter/Mastodon?',
        default: true
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/notes/{{getFilename title}}.md',
        templateFile: 'plop-templates/note.md.hbs'
      }
    ]
  });
  
  // Collection generator
  plop.setGenerator('collection', {
    description: 'Create a new collection',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Collection name:'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Collection description:'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/{{name}}/index.md',
        templateFile: 'plop-templates/collection.md.hbs'
      }
    ]
  });
  
  // Page generator
  plop.setGenerator('page', {
    description: 'Create a new page',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'Page title:'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Page description:'
      },
      {
        type: 'confirm',
        name: 'collection',
        message: 'Add to a collection?',
        default: false
      },
      {
        type: 'input',
        name: 'collection_name',
        message: 'Collection name:',
        when: answers => answers.collection
      },
      {
        type: 'input',
        name: 'permalink',
        message: 'Custom permalink (leave blank for default):'
      }
    ],
    actions: data => {
      const actions = [
        {
          type: 'add',
          path: data.collection 
            ? `src/${data.collection_name}/${helpers.getFilename(data.title, false)}.md`
            : `src/pages/${helpers.getFilename(data.title, false)}.md`,
          templateFile: 'plop-templates/page.md.hbs'
        }
      ];
      return actions;
    }
  });
}