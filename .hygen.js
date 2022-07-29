const today			= new Date();
const offsetMs	= today.getTimezoneOffset() * 60 * 1000;
const msLocal		= today.getTime() - offsetMs;
const dateLocal	= new Date(msLocal);
const iso				= dateLocal.toISOString().slice(0, 19);

module.exports = {
	helpers: {
    escapeQuotes: function(str) {
      return str.replace('"', '\\"');
    },
		getTimestamp: () => {
			return `${iso.replace('T', ' ')} -07:00`;
		},
		getFilename: (locals) => {
			const date = iso.substring(0, 10);
			
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
			
			return `${date}-${text}`;
		}
	}
};