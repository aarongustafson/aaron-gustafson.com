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
        console.log('No preconnect');
    }

    // Add the comment count
    s.async = true;
    s.type = 'text/javascript';
    s.src = '//aarongustafson.disqus.com/count.js';
    (document.head || document.body).appendChild(s);

}( this, this.document ));
(function( window, document ) {
    'use strict';

    var $discuss_script = document.createElement('script'),
    	script_name = '//' + disqus_shortname + '.disqus.com/' + disqus_script;
   	
	if ( 'AG' in window &&
		 'preconnect' in window.AG )
	{
        window.AG.preconnect( '//disqus.com/' );
        window.AG.preconnect( '//' + disqus_shortname + '.disqus.com' );
        window.AG.preconnect( '//links.services.disqus.com/' );
        window.AG.preconnect( '//a.disquscdn.com' );
        window.AG.prefetch( script_name );
        if ( script_name.indexOf('count') < 0 )
        {
            window.AG.prefetch( '//' + disqus_shortname + '.disqus.com/count.js' );
        }
    }
	
	$discuss_script.type = 'text/javascript';
    $discuss_script.async = true;
    $discuss_script.src = script_name;
    
    (document.head || document.body).appendChild( $discuss_script );

    $discuss_script = null;

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
    
;(function(window,document){
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
        targets = [
            window.location.href.replace( 'localhost', 'www.aaron-gustafson.com' )
        ],
        $none = false,
        $redirects = document.querySelector('meta[property="webmention:redirected_from"]'),
        redirects,
        complete_urls = [],
        base_url = window.location.origin,
        $existing_webmentions,
        existing_webmentions = [],
        e = 0;
    
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
                parseInt( 
                    $existing_webmentions[e]
                        .getAttribute( 'id' )
                        .replace( 'webmention-', '' ),
                    10
                )
            );
        }
        $existing_webmentions = null;
    }
    
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
            id = streaming ? mention.element_id : mention.id;

        // Twitter uses the actual satus ID
        if ( data.url && data.url.indexOf( 'twitter.com/' ) > -1 )
        {
            id = data.url.replace(/^.*?status\/(.*)$/, '$1' );
        }

        // No need to replace
        if ( existing_webmentions.indexOf( id ) > -1 )
        {
            return;
        }
        
        var $existing_mention = document.querySelectorAll( '#webmention-' + id  ),
            $item = elements.li.cloneNode( true ),
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
            content = data.content,
            url = data.url || mention.source,
            type = mention.activity.type,
            activity = ( type == 'like' || type == 'repost' ),
            sentence = mention.activity.sentence_html,
            author = data.author ? data.author.name : false,
            author_photo = data.author ? data.author.photo : false,
            pubdate = data.published || mention.verified_date,
            display_date = '';
        
        $item.id = 'webmention-' + id;
        $item.appendChild( $mention );

        // no data, skip it
        if ( ! title && ! content )
        {
            return;
        }

        if ( author )
        {
            $author_link.href = data.author.url;
            if ( author_photo )
            {
                $author_photo.src = author_photo;
                $author_link.appendChild( $author_photo );
            }
            $author_name.appendChild( document.createTextNode( author ) );
            $author_link.appendChild( $author_name );
            $author.appendChild( $author_link );
            $mention.appendChild( $author );

            if ( activity )
            {
                title = author + ' ' + title;
                $mention.className += ' webmention--author-starts';
            }
        }

        if ( pubdate )
        {
            $pubdate.setAttribute( 'datetime', pubdate );
            pubdate = new Date( pubdate );
            display_date += pubdate.getUTCDate() + ' ';
            display_date += months[ pubdate.getUTCMonth() ] + ' ';
            display_date += pubdate.getUTCFullYear();
            $pubdate.appendChild( document.createTextNode( display_date ) );
            $meta.appendChild( $pubdate );
            
            if ( url & ! activity )
            {
                $meta.appendChild( document.createTextNode( ' | ' ) );
            }
        }
        if ( url & ! activity )
        {
            $link = elements.permalink.cloneNode( true );
            $link.href = url;
            $meta.appendChild( $link );
        }

        if ( type == 'reply' )
        {
            title = false;
        }

        // no doubling up
        if ( title && content &&
             title == content )
        {
            title = false;
        }

        if ( title )
        {
            $mention.className += ' webmention--title-only';

            title = title.replace( 'reposts', 'reposted' );

            if ( url )
            {
                $link = elements.a.cloneNode( true );
                $link.href = url;
                $link.appendChild( document.createTextNode( title ) );
            }
            else
            {
                $link = document.createTextNode( title );
            }

            $block = elements.title.cloneNode( true );
            $block.appendChild( $link );
            $mention.appendChild( space.cloneNode( true ) );
            $mention.appendChild( $block );
        }
        else if ( content )
        {
            $mention.className += ' webmention--content-only';

            // TODO: Add Markdown
            $block = elements.content.cloneNode( true );
            
            if ( activity && sentence )
            {
                $block.innerHTML = sentence.replace( /href/, 'class="p-author h-card" href' );
            }
            else
            {
                $block.innerHTML = content;
            }
            $mention.appendChild( $block );
        }

        if ( $meta.children.length > 0 )
        {
            $mention.appendChild( $meta );
        }
        
        if ( $existing_mention.length < 1 )
        {
            if ( !! $none )
            {
                $none.parentNode.replaceChild( $webmentions_list, $none );
                $none = false;
            }
            $webmentions_list.appendChild( $item );
        }
        else
        {
            $webmentions_list.replaceChild( $item, $existing_mention[0] );
        }

        // Store the id
        existing_webmentions.push( id );
        
        // Release
        $item = null;
        $existing_mention = null;
        $mention = null;
        $author = null;
        $author_link = null;
        $author_photo = null;
        $block = null;
        $link = null;
        $meta = null;
        $pubdate = null;
    }
    
    window.AG.processWebmentions = function( data ){
        if ( ! ( 'error' in data ) )
        {
            data.links.reverse();
            data.links.forEach( addMention );
        }
    };
    
    // Preconnect to Webmention.io
    if ( 'preconnect' in window.AG )
    {
        window.AG.preconnect( '//webmention.io' );
        window.AG.preconnect( 'ws://webmention.io:8080' );
    }

    // Load up any unpublished webmentions on load
    json_webmentions = document.createElement('script');
    json_webmentions.async = true;
    json_webmentions.src = '//webmention.io/api/mentions?jsonp=window.AG.processWebmentions&amp;target[]=' +
                            targets.join( '&amp;target[]=' );
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
        };
    }
    
}(this,this.document));