const today			= new Date();
const offsetMs	= today.getTimezoneOffset() * 60 * 1000;
const msLocal		= today.getTime() - offsetMs;
const dateLocal	= new Date(msLocal);
const iso				= dateLocal.toISOString().slice(0, 19);

const events		= require('./src/_data/speaking_engagements.json');
const series    = require('./_cache/series.json');
const tags      = require('./_cache/tags.json');

module.exports = {
	helpers: {
    escapeQuotes: (str) => {
      return str.replace('"', '\\"');
    },
		getTimestamp: () => {
			return `${iso.replace('T', ' ')} -07:00`;
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
		getFilename: (locals, include_date) => {
      include_date = include_date !== false ? true : false;

			const date = getDate();
			
			// Slugify the title
			var text = locals.title;
			text = text.replace(/^\s+|\s+$/g, '');
			
			// Make the string lowercase
			text = text.toLowerCase();
			
			// Remove accents, swap ñ for n, etc
			var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
			var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
			for (var i=0, l=from.length ; i<l ; i++) {
				text = text.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
			}
			
			// Remove invalid chars
			text = text.replace(/[^a-z0-9 -]/g, '') 
			// Collapse whitespace and replace by -
			.replace(/\s+/g, '-') 
			// Collapse dashes
			.replace(/-+/g, '-'); 
			
			return include_date ? `${date}-${text}` : text;
		},
		addEvent: (locals) => {
			var new_events = events.sort((a, b) => {
				return a.id > b.id ? 1 : -1
			});
			new_events.reverse();
			
			var event = {
				id: new_events[0].id + 1,
				title: locals.title,
				date: `${locals.date} 00:09:00 -0800`,
				location: locals.location || 'Online'
			};
			if (locals.url) {
				event.url = locals.url;
			}
			
			new_events.unshift(event)
			return JSON.stringify(new_events, null, 2);
		}
	}
};