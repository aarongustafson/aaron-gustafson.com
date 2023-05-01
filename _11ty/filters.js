const { DateTime } = require("luxon");
const widont = require("widont");

function parse_date( date ){
	if ( ! date ) {
		return DateTime.now();
	}
	// try JS
	var the_date = DateTime.fromJSDate(date);
	// then try ISO
	if ( the_date.invalid ) {
		the_date = DateTime.fromISO(date);
	}
	// fallback to SQL
	if ( the_date.invalid ) {
		the_date = DateTime.fromSQL(date);
	}
	return the_date;
}

function objectToString( obj ){
	if ( obj instanceof String )
	{
		return obj;
	}
	let str = obj.title || obj.name || "";
	if ( obj.url )
	{
		return `<a href="${obj.url}">${str}</a>`;
	}
	return str;
}

module.exports = {
	
	readable_date: date => {
		return parse_date( date ).toFormat("dd LLL yyyy");
	},
	ymd_date: date => {
		return parse_date( date ).toISODate();
	},
	machine_date: date => {
		return parse_date( date ).toISO();
	},

	strip_links: text => {
		return text.replace(/<\/?a[^>]*>/gi, "");
	},

	trim_newlines: text => {
		return text.replace(/[\r\n]+/g, "");
	},

	widont: text => {
		return `${widont( text )}`;
	},

	isArray: obj => (obj instanceof Array),
	isString: obj => (obj instanceof String),
	isObject: obj => (obj instanceof Object),
	limit: (array, limit) => {
		return array.slice(0, limit);
	},

	toSentenceList: arr => {
		if ( ! ( arr instanceof Array ) ){
			arr = [ arr ];
		}
		let i = arr.length;
		if ( i === 1 ) {
			return objectToString(arr[0]);
		}
		if ( i === 2 ) {
			return `${objectToString(arr[0])} and ${objectToString(arr[1])}`;
		}
		let last = objectToString(arr.pop());
		let list = arr.map(item => objectToString(item));
		return `${list.join(", ")}, and ${last}`;
	},
	
	past: array => {
		const now = DateTime.now();
		return array
						 .filter( el => DateTime.fromSQL( el.date ) <= now )
						 .sort( (a,b) => {
							 a = DateTime.fromSQL( a.date );
							 b = DateTime.fromSQL( b.date );
							 return a < b ? -1 : a > b ? 1 : 0;
						 })
						 .reverse();
	},
	future: array => {
		const now = DateTime.now();
		return array
						 .filter( el=> DateTime.fromSQL( el.date ) > now )
						 .sort( (a,b) => {
							 a = DateTime.fromSQL( a.date );
							 b = DateTime.fromSQL( b.date );
							 return a < b ? -1 : a > b ? 1 : 0;
						 });
	},
	pluck( obj, prop, value) {
		return obj.find( el => el[prop] == value );
	},

	bySeriesTag: ( array, tag ) => {
		return array.filter( item => {
			return "series" in item.data &&
						 item.data.series.tag == tag;
		});
	},

	unescape: html => {
		html = html || "";
		return html.replace(/&gt;/g, ">")
						.replace(/&lt;/g, "<")
						.replace(/&quot;/g, '"')
						.replace(/&amp;amp;/g, "&amp;");
	},

	minus: ( a, b ) => parseInt(a,10) - parseInt(b,10),
	size: array => !array ? 0 : array.length,
	required: ( items, requirements ) => {
		var type;
		if ( requirements.indexOf( "||" ) > 0 )
		{
			type = "or";
			requirements = requirements.split( "||" );
		}
		else if ( requirements.indexOf( "&&" ) > 0 )
		{
			type = "and";
			requirements = requirements.split( "&&" );
		}
		else
		{
			type = "single";
			requirements = [ requirements ];
		}
		requirements = requirements.map(item => item.trim());
		return items.filter(item => {
			let i = requirements.length;
			// all
			if ( type == "and" )
			{
				while ( i-- )
				{
					if ( ! item[requirements[i]] )
					{ 
						return false;
					}
				}
				return true;
			}
			// any
			else
			{
				while ( i-- )
				{
					if ( item[requirements[i]] )
					{ 
						return true;
					}
				}
				return false;
			}
		});
	},

	content_type: path => {
		let type = "post";
		if ( path && path.indexOf("/links/") > -1 )
		{
			type = "link";
		}
		if ( path && path.indexOf("/talks/") > -1 )
		{
			type = "talk";
		}
		return type;
	},
	path_in_scope: ( path, scope ) => {
		return path.indexOf( scope ) > -1;
	},

	getWebmentionsForUrl: (webmentions, url, old_url) => {
		return webmentions.children
						.filter(entry => {
							//console.log( entry['wm-target'], url, old_url );
							let current = ( entry['wm-target'] === url );
							let old = ( old_url !== "false" && entry['wm-target'] === old_url );
							//console.log( current, old );
							return ( current || old );
						})
						.sort( (a,b) => {
							return a["wm-id"] - b["wm-id"];
						});
	},
	webmentionsByType: (mentions, mentionType) => {
		return mentions.filter(entry => {
			if ( mentionType instanceof Array )
			{
				let count = mentionType.length;
				while( count-- )
				{
					if ( !!entry[mentionType[count]] )
					{
						return true;
					}
				}
				return false;
			}
			else
			{
				return !!entry[mentionType];
			}
		});
	},

	// use with collections.feedAll
	related: ( collection, url, tag ) => {
		return collection
						// make sure it has the same tags
						.filter( item => "tags" in item.data && item.data.tags.indexOf( tag ) > -1 )
						// only if not this page
						.filter( item => url.indexOf( item.fileSlug ) == -1 );
	}
};