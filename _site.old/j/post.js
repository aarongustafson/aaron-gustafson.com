(function( window, document ){
    'use strict';

    if ( ! ( 'querySelectorAll' in document ) ) { return; }

    var s = document.createElement('script'),
        $webmentions_link = document.querySelector( '.entry__jump--webmentions a' ),
        webmentions_count = document.querySelectorAll( '.webmentions__item' ).length;

    // Add the webmentions count
    $webmentions_link.innerHTML = webmentions_count + ' ' + $webmentions_link.innerHTML;

    // Preconnect to Disqus if possible
    if ( 'AG' in window &&
         'preconnect' in window.AG )
    {
        window.AG.preconnect( '//disqus.com/' );
        window.AG.preconnect( '//aarongustafson.disqus.com' );
        window.AG.preconnect( '//links.services.disqus.com/' );
        window.AG.preconnect( '//a.disquscdn.com' );
    }
    else
    {
        //console.log('No preconnect');
    }

    // Add the comment count
    s.async = true;
    s.type = 'text/javascript';
    s.src = '//aarongustafson.disqus.com/count.js';
    (document.head || document.body).appendChild(s);

}( this, this.document ));
(function( window, document ) {
    'use strict';

    var $s = document.createElement('script');
    $s.src = '//' + window.AG.disqus.shortname + '.disqus.com/' + window.AG.disqus.script;
    $s.setAttribute( 'data-timestamp', '' + new Date() );
    (document.head || document.body).appendChild( $s );
    $s = null;

}( this, this.document ));
// Add a comments message if offline
(function(){
    'use strict';

    if ( ! ( 'onLine' in window.navigator ) ){ return; }

    var offline = !window.navigator.onLine,
        $p,
        $comments;

    if ( offline )
    {
        $p = document.createElement('p');
        $p.innerText = 'Your internet connection is currently offline, so I can’t load in the comment thread from Disqus.';
        $comments = document.getElementById( 'disqus' );
        $comments.appendChild($p);

        $p = null;
        $comments = null;
    }

}());
(function(document){
    'use strict';

    if ( ! ( 'querySelectorAll' in document ) ) { return; }

    var $quotes = document.querySelectorAll('[data-quotable]'),
        q = $quotes.length,
        $container,
        re_blocks = /^(blockquote|[uod]l|p|h[1-6])$/,
        re_containers = /^(body|main|section|article|aside)$/,
        re_headings = /^h[1-6]$/,
        $quote,
        quote,
        last,
        $template,
        $parent,
        $current_sibling,
        $previous_heading;

    if ( q )
    {
        $template = document.createElement('blockquote');
        $template.setAttribute('class', 'quotable');
        $template.setAttribute('aria-hidden', 'true');
        $template.appendChild( document.createElement('p') );

        while ( q-- )
        {
            $container = $quotes[q];
            $quote = $template.cloneNode( true );
            quote = $container.innerText.split(' ');
            last = quote.pop();
            $quote.querySelector('p').innerText = quote.join(' ') + '\xA0' + last;

            // make sure we’re at a block container
            while ( ! $container.nodeName.toLowerCase().match( re_blocks ) )
            {
                if ( !! $container.nodeName.toLowerCase().match( re_containers ) )
                {
                    break;
                }

                $container = $container.parentNode;
            }
            
            // if there is a previous sibling that is a heading,
            // drop the quote in after the second block element after it
            $parent = $container.parentNode;
            $current_sibling = $container.previousElementSibling;
            while ( $current_sibling )
            {
                if ( $current_sibling.nodeName.toLowerCase().match( re_headings ) )
                {
                    $previous_heading = $current_sibling;
                    break;
                }
                $current_sibling = $current_sibling.previousElementSibling;
            }
            if ( $previous_heading )
            {
                $current_sibling = $previous_heading.nextElementSibling.nextElementSibling;
                // no blockquotes next to blockquotes
                while ( $current_sibling.nodeName.toLowerCase() == 'blockquote' )
                {
                    $current_sibling = $current_sibling.nextElementSibling.nextElementSibling;
                }               
            }

            // insert
            if ( $current_sibling )
            {
                $parent.insertBefore( $quote, $current_sibling );
            }
            else
            {
                $parent.insertBefore( $quote, $container );
            }
        
        }
    }


}(document));
/* ! Sharing popup */
(function( window, document ){
    'use strict';

    // Filter older browsers
    if ( ! ( 'querySelectorAll' in document ) )
    {
        return;
    }
    
    // event handler
    function click(e)
    {
        var target = e.target;

        // target must be an anchor and the inner width threshold must be met
        if ( e.target.nodeName.toLowerCase() == 'a' &&
             window.innerWidth >= threshold )
        {
            // prevent the default link click
            e.preventDefault();

            // open the link in a popup
            window.open( target.href, 'share-this', 'height=300,width=500,status=no,toolbar=no' );

            // return
            return false;
        }
    }

        // gather the links container
    var share_links = document.querySelectorAll('.entry__sharing'),
        // set the threshold width
        threshold = 640;

    // watcher
    if ( share_links.length > 0 )
    {
        share_links[0].addEventListener( 'click', click, false );
    }

}( this, this.document ));
// Social media avatars disappear on occasion.
// If they aren’t available, hide em.
(function( window ){
    'use strict';

    if ( 'addEventListener' in window )
    {
        window.addEventListener( 'load', checkImages, false );
    }

    function checkImages(){
        var images = document.getElementById('webmentions').getElementsByTagName('img'),
            i = images.length;
        while ( i-- )
        {
            if ( ! images[i].naturalWidth )
            {
                images[i].style.visibility = 'hidden';
            }
        }
        // release the DOM reference
        images = null;
    }

}( this ));
if ( 'speechSynthesis' in window )
{
	// Housekeeping
	window.addEventListener( 'beforeunload', function(){
		window.speechSynthesis.cancel();
	});

	function play() {
		if ( paused )
		{
			//console.log( 'resume', speech );
			window.speechSynthesis.resume();
		}
		else
		{
			//console.log( 'play', speech );
			window.speechSynthesis.speak( speech );
		}
		
		// reset the button
		//setTimeout(toggleButtons, 500);
	}

	function pause() {
		window.speechSynthesis.pause();
		paused = true;

		//setTimeout(toggleButtons, 500);
	}

	//function adjustSpeed()
	//{
	//	// cancel the original utterance
	//	//console.log('cancelling the original utterance');
	//	window.speechSynthesis.cancel();
	//
	//	// find the previous space
	//	//console.log( 'progress char', progress_index );
	//	var previous_space = speech.text.lastIndexOf( ' ', progress_index );
	//	//console.log( 'found a space at char', previous_space );
	//	
	//	// get the remains of the original string
	//	speech.text = speech.text.slice( previous_space );
	//	//console.log( 'new text', speech.text );
	//
	//	// Math to 1 decimal place
	//	speed = Math.round( $speed_value.value * 10 ) / 10;
	//
	//	// adjust the rate
	//	if ( speed > 10 )
	//	{
	//		speed = 10;
	//	}
	//	else if ( speed < 0.1 )
	//	{
	//		speed = 0.1;
	//	}
	//	speech.rate = speed;
	//
	//	// return to speaking
	//	// console.log( 'starting a new one', speech );
	//	window.speechSynthesis.speak( speech );
	//}

	//function toggleButtons() {
	//	if ( $play.disabled === false )
	//	{
	//		//$play.disabled = true;
	//		//$pause.disabled = false;
	//		//$speed_value.disabled = false;
	//	}
	//	else
	//	{
	//		//$play.disabled = false;
	//		//$pause.disabled = true;
	//		//$speed_value.disabled = true;
	//	}
	//}

	var speech = new SpeechSynthesisUtterance(),
		paused = false,
		text,
		progress_index = 0,
		$content = document.querySelector('main').cloneNode(true),
		$space = $content.querySelectorAll('pre'),
		$pause_before = $content.querySelectorAll('h2, h3, h4, h5, h6, p, li, dt, blockquote, pre, figure, footer'),
		$skip = $content.querySelectorAll('.anchorable__anchor, aside, .dont-read'),
		$intro = document.createElement('dt'),
		$controls = document.createElement('dd'),
		$button = document.createElement('button'),
		$buttons = document.createElement('p'),
		$play,
		$pause,
		default_speed = 1.4,
		//$speed = $buttons.cloneNode(true),
		//$speed_label = document.createElement('label'),
		//$speed_value = document.createElement('input'),
		$caveat = $buttons.cloneNode(true);
	
	// Don’t read
	Array.prototype.forEach.call( $skip, function( $el ){
		$el.innerHTML = '';
	});
	
	// spacing out content
	Array.prototype.forEach.call( $space, function( $el ){
		$el.innerHTML = ' ' + $el.innerHTML.replace(/[\r\n\t]/g, ' ') + ' ';
	});
	
	// Synthetic Pauses
	Array.prototype.forEach.call( $pause_before, function( $el ){
		$el.innerHTML = ' , ' + $el.innerHTML;
	});

	// capture character index as we move.
	speech.onboundary = function( e ) {
		if ( e.name == 'word' )
		{
			progress_index = e.charIndex;
		}
	};

	// clear the queue when done
	speech.onend = function( e ) {
		window.speechSynthesis.cancel();
	};

	text = $content.textContent;
	speech.text = text;
	
	//----------------------
	// Build the GUI
	// ---------------------
	
	$intro.innerHTML = 'Would you prefer to have this post read to you?';
	
	$controls.classList.add('media-controls');
	
	// Buttons
	$buttons.classList.add('media-controls__buttons');
	$button.classList.add('media-controls__button');
	// Default active buttons
	$play = $button.cloneNode('true');
	$play.classList.add('media-controls__button--play');
	$play.setAttribute( 'aria-label', 'Play' );
	$play.addEventListener( 'click', play, false );
	//$play.addEventListener( 'touchend', play, false );
	$buttons.appendChild($play);
	// Default disabled buttons
	//$button.disabled = true;
	$pause = $button.cloneNode('true');
	$pause.classList.add('media-controls__button--pause');
	$pause.setAttribute( 'aria-label', 'Pause' );
	$pause.addEventListener( 'click', pause, false );
	//$pause.addEventListener( 'touchend', pause, false );
	$buttons.appendChild($pause);
	$controls.appendChild($buttons);

	// Speed
	speech.rate = default_speed;
	//$speed.classList.add('media-controls__speed');
	//$speed_label.innerText = 'Speed';
	//$speed_label.htmlFor = 'speed_value';
	//$speed.appendChild( $speed_label );
	//$speed_value.type = 'number';
	//$speed_value.id = 'speed_value';
	////$speed_value.disabled = true;
	//$speed_value.min = '0.1';
	//$speed_value.max = '10';
	//$speed_value.step = '0.1';
	//$speed_value.value = default_speed;
	//$speed_value.addEventListener( 'change', adjustSpeed, false );
	////$speed_value.addEventListener( 'blur', adjustSpeed, false );
	////$speed_value.addEventListener( 'keyup', adjustSpeed, false );
	////$speed_value.addEventListener( 'click', adjustSpeed, false );
	////$speed_value.addEventListener( 'touchend', adjustSpeed, false );
	//$speed.appendChild( $speed_value );
	//$controls.appendChild($speed);

	// Caveat
	$caveat.innerHTML = '<small>SpeechSynthesis is still experimental. This could be buggy</small>';
	$controls.appendChild($caveat);

	document.querySelector('.entry__meta').appendChild($intro);
	document.querySelector('.entry__meta').appendChild($controls);
}
/**
 *  WebMentions.io JS
 *  A re-tooling of Aaron Parecki’s recommended JS for using the WebMention.io API
 * 
 *  Updates Webmentions on a static site immediately when the page is loaded and
 *  in real-time (using WebSockets) as the user engages with the page.
 * 
 * To inform the JavaScript of additional URLs to check (e.g. when the current page 
 * receives redirects from old URLs), use the following meta element:
 * 
 *  <meta property="webmention:redirected_from" content="URL_1,URL_2">
 * 
 * The content should be a single URL or multiple, separated by commas.
 */
    
;(function( window, document ){
    'use strict';
    
    if ( ! ( 'querySelectorAll' in document ) ){ return; }
    
    if ( ! ( 'AG' in window ) ){ window.AG = {}; }
    
    if ( ! window.location.origin )
    {
       window.location.origin = window.location.protocol + '//' + window.location.host;
    }

    var $webmentions_list = document.querySelectorAll( '.webmentions__list' ),
        elements = {
            a:          document.createElement('a'),
            author_name:document.createElement('b'),
            article:    document.createElement('article'),
            div:        document.createElement('div'), 
            photo:      document.createElement('img'),
            li:         document.createElement('li'),
            time:       document.createElement('time')
        },
        space = document.createTextNode(' '),
        months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        json_webmentions,
        targets = [],
        $none = false,
        $redirects = document.querySelector('meta[property="webmention:redirected_from"]'),
        redirects,
        complete_urls = [],
        base_url = window.location.origin,
        $existing_webmentions,
        existing_webmentions = [],
        e = 0;

    // push the base page
    targets.push( 'https://www.aaron-gustafson.com' + window.location.pathname );
    
    // handle redirects
    if ( $redirects )
    {
        redirects = $redirects.getAttribute('content').split(',');
        redirects.forEach(function( value ){
            targets.push( 
                value.indexOf('//') < 0 ? base_url + value : value
            );
        });
        redirects = false;
    }

    // map to http too
    if ( window.location.protocol != 'http:' )
    {
        targets.forEach(function( value ){
            complete_urls.push( value );
            if ( value.indexOf( 'https://' ) != -1 )
            {
                complete_urls.push( value.replace( 'https://', 'http://' ) );
            }
        });
        targets = complete_urls;
        complete_urls = false;
    }
    
    // Do we need to create the list?
    if ( $webmentions_list.length < 1 )
    {
        $none = document.querySelectorAll( '.webmentions__not-found' );
        if ( $none.length )
        {
            $none = $none[0];
            $webmentions_list = document.createElement( 'ol' );
            $webmentions_list.className = 'webmentions__list';
        }
        else
        {
            return;
        }
    }
    else
    {
        $webmentions_list = $webmentions_list[0];
        // get existing webmentions
        $existing_webmentions = $webmentions_list.querySelectorAll( '[id^=webmention-]' );
        e = $existing_webmentions.length;
        while ( e-- )
        {
            existing_webmentions.push(
                $existing_webmentions[e]
                    .getAttribute( 'id' )
                    .replace( 'webmention-', '' )
            );
        }
        //console.log(existing_webmentions);
        $existing_webmentions = null;
    }
    window.AG.existing_webmentions = existing_webmentions;
    
    // Set up the markup
    elements.li.className = 'webmentions__item';
    elements.article.className = 'h-cite webmention';
    elements.time.className = 'webmention__pubdate dt-published';
    elements.author = elements.div.cloneNode();
    elements.author.className = 'webmention__author p-author h-card';
    elements.author_name.className = 'p-name';
    elements.author_link = elements.a.cloneNode();
    elements.author_link.className = 'u-url';
    elements.photo.className = 'webmention__author__photo u-photo';
    elements.photo.alt = '';
    elements.title = elements.div.cloneNode();
    elements.title.className = 'webmention__title p-name';
    elements.permalink = elements.a.cloneNode();
    elements.permalink.className = 'webmention__source u-url';
    elements.permalink.appendChild( document.createTextNode('Permalink') );
    elements.content = elements.div.cloneNode();
    elements.content.className = 'webmention__content p-content';
    elements.meta = elements.div.cloneNode();
    elements.meta.className = 'webmention__meta';
    
    function addMention( mention )
    {
        //console.log(mention);
        var streaming = !( 'data' in mention ),
            data = streaming ? mention : mention.data,
            id = streaming ? mention.element_id : mention.id,
            is_tweet = false,
            is_gplus = false;

        // make sure the id is a string
        id = id.toString();

        // Tweets gets handled differently
        if ( data.url && data.url.indexOf( 'twitter.com/' ) > -1 )
        {
            is_tweet = true;
            // Unique tweets gets unique IDs
            if ( data.url.indexOf( '#favorited-by' ) == -1 )
            {
                id = data.url.replace( /^.*?status\/(.*)$/, '$1' );
            }
        }
        
        // No need to replace
        //console.log( existing_webmentions, id, existing_webmentions.indexOf( id ) );
        if ( existing_webmentions.indexOf( id ) > -1 )
        {
            return;
        }
        
        // Google Plus gets handled differently
        if ( data.url.indexOf( '/googleplus/' ) )
        {
            is_gplus = true;
        }
        
        var $item = elements.li.cloneNode( true ),
            $mention = elements.article.cloneNode( true ),
            $author = elements.author.cloneNode( true ),
            $author_name = elements.author_name.cloneNode( true ),
            $author_link = elements.author_link.cloneNode( true ),
            $author_photo = elements.photo.cloneNode( true ),
            $meta = elements.meta.cloneNode( true ),
            $pubdate = elements.time.cloneNode( true ),
            $block,
            $link,
            title = data.name,
            link_title = false,
            content = data.content,
            url = data.url || mention.source,
            type = mention.activity.type,
            author = data.author ? data.author.name : false,
            author_photo = data.author ? data.author.photo : false,
            pubdate,
            display_date = '';
        
        $item.id = 'webmention-' + id;
        $item.appendChild( $mention );

        // no data, skip it
        if ( ! title && ! content )
        {
            return;
        }
        
        ////
        // Authorship
        ////
        if ( author )
        {
            if ( author_photo )
            {
                $author_photo.src = author_photo;
                $author_link.appendChild( $author_photo );
            }
            else
            {
                $mention.className += ' webmention--no-photo';
            }
            $author_name.appendChild( document.createTextNode( author ) );
            if ( data.author.url )
            {
                $author_link.href = data.author.url;
                $author_link.appendChild( $author_name );
                $author.appendChild( $author_link );
            }
            else
            {
                $author.appendChild( $author_name );
            }
            $mention.appendChild( $author );
        }
        else
        {
            $mention.className += ' webmention--no-author';
        }

        ////
        // Content
        ////
        if ( ! type )
        {
            // Trap Google Plus from Bridgy
            if ( is_gplus )
            {
                if ( url.indexOf( '/like/' ) > -1 )
                {
                    type = 'like';
                }
                else if ( url.indexOf( '/repost/' ) > -1 )
                {
                    type = 'repost';
                }
                else if ( url.indexOf( '/comment/' ) > -1 )
                {
                    type = 'reply';
                }
                else
                {
                    type = 'link';
                }
            }
            // Default
            else
            {
                type = 'post';
            }
        }
        
        // more than likely the content was pushed into the post name
        if ( title && title.length > 200 )
        {
            title = false;
        }
        
        // TODO: Google Plus masked by Bridgy
        // Ruby Code:
        // if is_gplus and url.include? 'brid-gy'
        //     # 
        //     status = `curl -s -I -L -o /dev/null -w "%{http_code}" --location "#{url}"`
        //     if status == '200'
        //         # Now get the content
        //         html_source = `curl -s --location "#{url}"`
        // 
        //         if ! html_source.valid_encoding?
        //             html_source = html_source.encode('UTF-16be', :invalid=>:replace, :replace=>"?").encode('UTF-8')
        //         end
        // 
        //         matches = /class="u-url" href=".+">(https:.+)</.match( html_source )
        //         if matches
        //             url = matches[1].strip
        //         end
        //     else
        //         url = false
        //     end
        // end
        
        // Posts (but not tweeted links)
        if ( type == 'post' ||
             ( type == 'link' && ! is_tweet && ! is_gplus ) )
        {
            link_title = title;
            
            // No title - Async update
            if ( ! title && url )
            {
                readWebPage( url, function( html_source ){
                    if ( html_source )
                    {
                        linkTitle( $item, url, html_source );
                    }
                });
            }    
        }
        // Likes & Shares
        else if ( type == 'like' || type == 'repost' )
        {
            // new Twitter faves are doing something weird
            if ( type == 'like' && is_tweet )
            {
                link_title = author + ' favorited this.';
            }
            else if ( type == 'repost' && is_tweet )
            {
                link_title = author + ' retweeted this.';
            }
            else
            {
                link_title = title;
            }
            $mention.className += ' webmention--author-starts';
        }
        
        // Published info
        if ( data.published_ts )
        {
            pubdate = new Date(0);
            pubdate.setUTCSeconds( data.published_ts );
        }
        else if ( data.published || mention.verified_date )
        {
            pubdate = new Date( data.published || mention.verified_date );
        }
        if ( pubdate )
        {
            $pubdate.setAttribute( 'datetime', pubdate.toISOString() );
            display_date += pubdate.getUTCDate() + ' ';
            display_date += months[ pubdate.getUTCMonth() ] + ' ';
            display_date += pubdate.getUTCFullYear();
            $pubdate.appendChild( document.createTextNode( display_date ) );
            $meta.appendChild( $pubdate );
        }
        
        if ( ! link_title )
        {
            if ( pubdate && url )
            {
                $meta.appendChild( document.createTextNode( ' | ' ) );
            }
            if ( url )
            {
                $link = elements.permalink.cloneNode( true );
                $link.href = url;
                $meta.appendChild( $link );
            }
        }
        
        if ( author &&
             $mention.className.indexOf( 'webmention--author-starts' ) == -1 &&
             ( ( title && title.indexOf( author ) == '0' ) ||
               ( content && content.indexOf( author ) == '0' ) ) )
        {
            $mention.className += ' webmention--author-starts';
        }

        if ( link_title )
        {
            $mention.className += ' webmention--title-only';

            link_title = link_title.replace( 'reposts', 'reposted' );

            if ( url )
            {
                $link = elements.a.cloneNode( true );
                $link.href = url;
                $link.appendChild( document.createTextNode( link_title ) );
            }
            else
            {
                $link = document.createTextNode( link_title );
            }

            $block = elements.title.cloneNode( true );
            $block.appendChild( $link );
            $mention.appendChild( space.cloneNode( true ) );
            $mention.appendChild( $block );
        }
        else
        {
            $mention.className += ' webmention--content-only';
            $block = elements.content.cloneNode( true );
            $block.innerHTML = content;
            $mention.appendChild( $block );
        }

        if ( $meta.children.length > 0 )
        {
            $mention.appendChild( $meta );
        }
        
        if ( !! $none )
        {
            $none.parentNode.replaceChild( $webmentions_list, $none );
            $none = false;
        }
        $webmentions_list.appendChild( $item );
        
        // Store the id
        existing_webmentions.push( id );
        
        // Release
        $item = null;
        $mention = null;
        $author = null;
        $author_name = null;
        $author_link = null;
        $author_photo = null;
        $block = null;
        $link = null;
        $meta = null;
        $pubdate = null;
        
    }
    
    window.AG.processWebmentions = function( data ){
        if ( data &&
             ! ( 'error' in data ) )
        {
            data.links.reverse();
            data.links.forEach( addMention );
            updateCount();
        }
    };

    // Update the webmentions count
    function updateCount() {
        var $webmentions_link = document.querySelector( '.entry__jump--webmentions a' ),
            webmentions_count = document.querySelectorAll( '.webmentions__item' ).length;
        
        $webmentions_link.innerHTML = webmentions_count + ' webmentions';
    }
    
    // Synchromous XHR proxied through whateverorigin.org
    function readWebPage( uri, callback )
    {
        if ( 'XMLHttpRequest' in window )
        {
            var XHR = new XMLHttpRequest();
            readWebPage = function( uri, callback ){
                var done = false;
                uri = '//whateverorigin.org/get?url=' + encodeURIComponent( uri );
                XHR.onreadystatechange = function() {
                    if ( this.readyState == 4 && ! done ) {
                        done = true;
                        callback( XHR.responseText );
                    }
                };
                xhr.onabort = function() {
                    if ( ! done )
                    {
                        done = true;
                        callback( false );
                    }
                };
                XHR.onerror = XHR.onabort;
                XHR.open( 'GET', uri );
                XHR.send( null );
            };
        }
        else
        {
            readWebPage = function( uri, callback ){
                callback( false );
            };
        }
        return readWebPage( uri, callback );
    }
    
    // Async update of the title
    function updateTitle( $item, url, html_source )
    {
        var $current_title = $item.querySelector( '.webmention__title' ),
            matches = /<title>\s*(.*)\s*<\/title>/.match( html_source ),
            title = '',
            $link_title;
        
        if ( matches )
        {
            title = matches[1];
        }
        else
        {
            matches = /<h1>\s*(.*)\s*<\/h1>/.match( html_source );
            if ( matches )
            {
                title = matches[1];
            }
            else
            {
                title = 'No title available';
            }
        }
        
        if ( title )
        {
            $link_title = elements.a.cloneNode( true );
            $link_title.href = url;
            $link_title.appendChild( document.createTextNode( title ) );
            // clear and replace title contents
            $current_title.innerHTML = '';
            $currentTitle.appendChild( $link_title );
        }
    }
    
    // Preconnect to Webmention.io
    if ( 'preconnect' in window.AG )
    {
        window.AG.preconnect( '//webmention.io' );
        window.AG.preconnect( 'ws://webmention.io:8080' );
    }

    // Load up any unpublished webmentions on load
    json_webmentions = document.createElement('script');
    json_webmentions.async = true;
    json_webmentions.src = '//webmention.io/api/mentions?jsonp=window.AG.processWebmentions&target[]=' +
                            targets.join( '&target[]=' );
    document.getElementsByTagName('head')[0].appendChild( json_webmentions );
    
    // Listen for new ones
    if ( $webmentions_list.length &&
         'WebSocket' in window )
    {
        var ws = new WebSocket('ws://webmention.io:8080');
        
        ws.onopen = function(){
            // Send the current window URL to the server to register to receive notifications about this URL
            ws.send( window.location );
        };
        ws.onmessage = function( event ){
            addMention( JSON.parse( event.data ) );
            updateCount();
        };
    }
    
}(this,this.document));