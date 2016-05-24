(function( window, document ){
    
    // Bail on older browsers
    if ( ! 'querySelectorAll' in document )
    {
        return false;
    }
    
    var anchorable_elements = 'h1 h2 h3 h4 h5 h6 figure .gist'.split( ' ' ),
        anchorable,
        length,
        active,
        location = window.location.href,
        body = document.body,
        prefix = 'anchorable',
        // Description
        description_id = prefix + '-description',
        description_text = 'Hit the Enter key to copy a direct link to this element',
        // Hover
        hover_class = prefix + '-hovered',
        // Alert
        alert,
        alert_class = prefix + '-alert',
        alert_hiding_class = prefix + '-alert--hiding',
        alert_duration = 2000,
        success_text = 'The link is in your clipboard.',
        failure_text = 'Your browser doesn’t offer clipboard access, you will need to manually copy it:',
        // Textarea
        textarea;
        
    // collect the anchorable elements
    length = anchorable_elements.length;
    while ( length-- )
    {
        anchorable_elements[length] = 'main ' + anchorable_elements[length] + '[id]';
    }
    anchorable_elements = anchorable_elements.join( ', ' );
    
    // collect the elements
    anchorable = document.querySelectorAll( anchorable_elements );
    length = anchorable.length;
    
    // exit early
    if ( ! length )
    {
        // console.log('nothing found');
        return;
    }
    
    // POLYFILLS
    // Element.matches() polyfill
    if ( ! 'matches' in anchorable[0] )
    {
        // Alias the non-standard
        if ( 'matchesSelector' in anchorable[0] )
        {
            Element.prototype.matches = Element.prototype.matchesSelector;
        }
        // more expensive
        else
        {
            // Polyfll adapted from
            // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
            Element.prototype.matches = function( selector ){
                var matches = ( this.document || this.ownerDocument ).querySelectorAll( selector ),
                    i = matches.length;
                while ( --i >= 0 && matches.item(i) !== this ) {}
                return i > -1;
            };
        }
    }
    
    // UTILITIES
    function getAnchorableElement( event )
    {
        var element = event.target;
        // make sure we have an anchorable element
        while ( ! element.matches( anchorable_elements ) )
        {
            element = element.parentNode;
        }
        return element;
    }
    
    // DOM
    function createAlert()
    {
        alert = document.createElement( 'strong' );
        alert.className = alert_class;
    }
    function createDescription()
    {
        var description = document.createElement( 'div' );
        description.id = description_id;
        description.hidden = true;
        description.appendChild( document.createTextNode( description_text ) );
        body.appendChild( description );
        description = null;
    }
    function createHiddenTextarea()
    {
        var div = document.createElement( 'div' );
        textarea = document.createElement( 'textarea' );
        
        // we can’t actually hide these, need to do inline CSS
        // lovingly adapted from Trello
        div.style = 'position: fixed; left: 0px; top: 0px; width: 0px; height: 0px; z-index: 100; opacity: 0;';
        textarea.style = 'width: 1px; height: 1px; padding: 0px;';
        
        div.appendChild( textarea );
        body.appendChild( div );
        div = null;
    }
    
    // ACTIONS
    function copy( url )
    {
        // create a hidden textarea to copy from
        if ( ! textarea )
        {
            createHiddenTextarea();
        }
        
        textarea.innerText = url;
        textarea.select();
        
        try {
            return document.execCommand('copy');
        } catch (err) {
            return false;
        }
    }
    function alertUser( message )
    {
        if ( ! alert )
        {
            createAlert();
        }
        alert.hidden = true;
        alert.innerText = message;
        active.appendChild( alert );
        alert.hidden = false;
        setTimeout( hideAlert, alert_duration );      
    }
    function hideAlert()
    {
        alert.parentNode.removeChild( alert );
        // returnFocus();
    }
    //function returnFocus()
    //{
    //    active.focus();
    //    active = null;
    //}
        
    // EVENTS
    function mouseoverHandler()
    {
        var element = getAnchorableElement( event );
        element.classList.add( hover_class );
    }
    function mouseoutHandler()
    {
        var element = getAnchorableElement( event );
        element.classList.remove( hover_class );
    }
    function keypressHandler( event )
    {
        console.log('keypress');
        if ( event.which == '13' )
        {
            clickHandler( event );
        }
    }
    function clickHandler( event )
    {
        var element = getAnchorableElement( event ),
            url;
        
        active = element;
        
        // copy the location (if possible )
        url = location + '#' + element.id;
        if ( copy( url ) )
        {
            alertUser( success_text );
        }
        else
        {
            alert( failure_message + ' ' + url );
        }
        
        // return focus
        element.focus();
    }
    
    // wire it all up
    function enableAnchorables()
    {
        var element;

        length = anchorable.length;
        while ( length-- )
        {
            element = anchorable[length];
            
            // classify
            element.classList.add( prefix );
            // make focusable in tabindex
            element.setAttribute( 'tabindex', '0' );
            // add the description
            element.setAttribute( 'aria-describedby', description_id );
            // handle reading
            element.setAttribute( 'aria-live', 'rude' );
            
            // set a hover event to show it’s anchorable
            element.addEventListener( 'mouseover', mouseoverHandler, false );
            element.addEventListener( 'mouseout', mouseoutHandler, false );
            element.addEventListener( 'focus', mouseoverHandler, false );
            element.addEventListener( 'blur', mouseoutHandler, false );
            // TODO: touch events
            //element.addEventListener( 'touchdown', keypressHandler, false );
            //element.addEventListener( 'touchup', keypressHandler, false );
            // set a tap/click/keypress to copy the URL
            element.addEventListener( 'click', clickHandler, false );
            element.addEventListener( 'keypress', keypressHandler, false );
        }
        
        // release DOM references
        element = null;
    }
    
    // Initialize
    function init()
    {
        console.log('init');
        
        createDescription();
        enableAnchorables();
    }
    
    // Teardown
    function teardown()
    {
        var element;
        
        length = anchorable.length;
        while ( length-- )
        {
            element = anchorable[length];
            // set a hover event to show it’s anchorable
            element.removeEventListener( 'mouseover', mouseoverHandler, false );
            element.removeEventListener( 'mouseout', mouseoutHandler, false );
            element.removeEventListener( 'focus', mouseoverHandler, false );
            element.removeEventListener( 'blur', mouseoutHandler, false );
            // TODO: touch events
            //element.addEventListener( 'touchdown', keypressHandler, false );
            //element.addEventListener( 'touchup', keypressHandler, false );
            // set a tap/click/keypress to copy the URL
            element.removeEventListener( 'click', clickHandler, false );
            element.removeEventListener( 'keypress', keypressHandler, false );
        }
        
        // release DOM references
        element = null;
        anchorable = null;
        input = null;
        description = null;
    }
    
    // initialize
    init();
    
    // cleanup
    window.addEventListener( 'unload', teardown, false );
    
}( this, this.document ));
(function(qs){
    if ( qs.indexOf('debug=1') > -1 )
    {
        var styles = document.querySelectorAll('link[rel=stylesheet]'),
            len = styles.length;
        while ( len-- )
        {
            styles[len].href = styles[len].href.replace( '.min', '' ); 
        }
    }    
}(window.location.search));
/*! Easy Responsive Tools */

/* Easy Responsive Tools
 * A collection of useful fixes and helpers for responsive projects
 **/
(function( window, document ){
    'use strict';
    
    var body = document.getElementsByTagName('body')[0];
    
    // Get the active Media Query as defined in the CSS
    // Use the following format:
    // #getActiveMQ-watcher { font-family: "default"; }
    // @media only screen and (min-width:20em){ #getActiveMQ-watcher { font-family: "small"; } }
    // etc.
    window.getActiveMQ = function()
    {

            // Build the watcher
        var watcher = document.createElement('div'),
            
            // alias getComputedStyle
            computed = window.getComputedStyle,
            
            // Regexp for removing quotes
            re = /['"]/g;
        
        // set upt the watcher and add it to the DOM
        watcher.setAttribute( 'id', 'getActiveMQ-watcher' );
        watcher.style.display = 'none';
        body.appendChild( watcher );
        
        // We’ll redefine this method the first time it’s run
        // For old IE
        if ( 'currentStyle' in watcher )
        {
            window.getActiveMQ = function()
            {
                return watcher.currentStyle.fontFamily.replace( re, '' );
            };
        }
        
        // For modern browsers
        else if ( computed )
        {
            window.getActiveMQ = function()
            {
                return computed( watcher, null ).getPropertyValue( 'font-family' ).replace( re, '' );
            };
        }
        
        // For everything else
        else
        {
            window.getActiveMQ = function()
            {
                return 'unknown';
            };
        }
        
        return window.getActiveMQ();
        
    };

    /*! resize watcher */
    window.watchResize = function( callback )
    {
        var resizing;

        // throttle resizing with a resize event and a timer
        function resize()
        {
            if ( resizing )
            {
                clearTimeout( resizing );
                resizing = null;
            }
            resizing = setTimeout( done, 50 );
        }

        // actual resize completion
        function done()
        {
            clearTimeout( resizing );
            resizing = null;
            callback();
        }
        
        // add the event
        window.addEventListener( 'resize', resize, false);

        // init the callback function once when the window loads
        window.addEventListener( 'load', callback, false);

    };
    
    /*! A fix for theWebKit Resize Bug https://bugs.webkit.org/show_bug.cgi?id=53166. */
    function fixWebkitResizeBug()
    {
        window.watchResize(function(){
            
            var o_style = body.getAttribute( 'style' ),
                height;
            
            body.style.overflow = 'hidden';
            height = body.offsetHeight;
            
            if ( o_style )
            {
                body.style = o_style;
            }
            else
            {
                body.removeAttribute( 'style' );
            }
            
        });
    }
    window.addEventListener( 'load', fixWebkitResizeBug, false);

}( this, this.document ));
/**
 *  Lazy Video Loading JavaScript
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
    
(function( window, document ){
    'use strict';

    if ( ! ( 'querySelectorAll' in document ) ){ return; }
    
    var $video_links = document.querySelectorAll( 'a[data-lazy-video-src]' ),
        link_count = $video_links.length,
        $iframe = document.createElement('iframe');
        
    if ( link_count > 0 )
    {
        $iframe.className = 'video-embed__video';
        $iframe.setAttribute('frameborder', '0');
        $iframe.setAttribute('allowfullscreen','');
        
        while ( link_count-- )
        {
            // should make loading faster
            if ( 'AG' in window &&
                 'preconnect' in window.AG )
            {
                window.AG.preconnect(
                    $video_links[link_count].getAttribute('data-lazy-video-src')
                );
            }
            
            // actual event handlers
            $video_links[link_count].addEventListener( 'click', start, false );
            $video_links[link_count].addEventListener( 'touchdown', start, false );
        }
    }
    
    $video_links = null;
    
    function start( event )
    {
        event.preventDefault();

        var $link = event.target,
            $video_embed = $iframe.cloneNode(true);
        
        while ( $link.nodeName.toLowerCase() != 'a' )
        {
            $link = $link.parentNode;
        }
        
        $video_embed.setAttribute( 'src', $link.getAttribute('data-lazy-video-src') );
        
        $link.parentNode.replaceChild( $video_embed, $link );
        
        $link = null;
        $video_embed = null;
        
        return false;
    }

}( this, this.document ));
(function( window ){
	'use strict';
	
	if ( ! ( 'Promise' in window ) ) { return; }

	var preconnectAvailable = new Promise(function(resolve, reject) {
  		var timer = setInterval(function(){
  			if ( 'AG' in window &&
  			 'preconnect' in window.AG )
	  		{
	  			clearInterval( timer );
	    		resolve( 'preconnect available' );
	  		}
  		},50);
	});

	preconnectAvailable.then(function(){
		window.AG.preconnect( '//www.google-analytics.com' );
		window.AG.prefetch( '//www.google-analytics.com/analytics.js' );
		window.AG.preconnect( '//use.typekit.net' );
		window.AG.prefetch( '//use.typekit.net/jje3afr.js' );
		window.AG.preconnect( '//gist.github.com' );
		window.AG.preconnect( '//assets-cdn.github.com' );
		window.AG.preconnect( 'https://images1-focus-opensocial.googleusercontent.com' );
	});

}(window));
(function( navigator ){
	// Register the service worker
	if ( 'serviceWorker' in navigator )
	{
		navigator.serviceWorker
			.register('/serviceworker.min.js')
				//.then(function(registration) {
				//	// Registration was successful
				//	console.log(
				//		'ServiceWorker registration successful with scope: ',
				//		registration.scope
				//	);
				//})
				//.catch(function(err) {
				//    // registration failed :(
				//    console.log( 'ServiceWorker registration failed: ', err );
				//})
				;
	}
}( this.navigator ));
(function( window, document ){
    'use strict';

    if ( !( 'AG' in window ) ){ window.AG = {}; }

    var preconnected = {},
        prefetched = {},
        $head = document.head,
        $link = document.createElement( 'link' );

    // Preconnect (from the AMP project)
    // https://github.com/ampproject/amphtml/
    window.AG.preconnect = function( url ){
        //console.log( 'preconnecting', url );

        // validate the URL
        var domain = getDomainFromURL( url );
        if ( ! domain ) { return; }
    
        // No need to run this twice
        if ( preconnected[domain] ) { return; }
        preconnected[domain] = true;
    
        var $dns = $link.cloneNode( true ),
            $preconnect = $link.cloneNode( true );
    
        $dns.setAttribute( 'rel', 'dns-prefetch' );
        $dns.setAttribute( 'href', domain );
    
        $preconnect.setAttribute( 'rel', 'preconnect' );
        $preconnect.setAttribute( 'href', domain );
    
        $head.appendChild( $dns );
        $head.appendChild( $preconnect );
    
        // Cleanup
        setTimeout(function(){
            if ( $dns.parentNode ) {
                $dns.parentNode.removeChild( $dns );
            }
            if ( $preconnect.parentNode ) {
                $preconnect.parentNode.removeChild( $preconnect );
            }
            $dns = null;
            $preconnect = null;
        }, 10000);
    
        // Polyfill Safari
        preconnectPolyfill( domain );
    };

    window.AG.prefetch = function( url ) {
        //console.log( 'prefetching', url );
        
        // validate the URL
        url = parseURL( url );
        if ( ! url ) { return; }

        // No need to run this twice
        if ( prefetched[url] ) { return; }
        prefetched[url] = true;

        var $prefetch = $link.cloneNode( true );
        $prefetch.setAttribute( 'rel', 'prefetch' );
        $prefetch.setAttribute( 'href', url );
        $head.appendChild( $prefetch );

        // As opposed to preconnect we do not clean this tag up, because there is
        // no expectation as to it having an immediate effect.
    };

    function parseURL( url ) {
        var $parser = document.createElement( 'a' );
        $parser.href = url;

        if ( $parser.protocol )
        {
          url = $parser.protocol + '//' + $parser.host + $parser.pathname + $parser.search + $parser.hash;
        }
        else
        {
          url = false;
        }

        // release the RAM
        $parser = null;

        // return the URL
        return url;
    }
    function getDomainFromURL( url ) {
        var $parser = document.createElement( 'a' ),
            domain;

        $parser.href = url;

        if ( $parser.protocol )
        {
          domain = $parser.protocol + '//' + $parser.host;
        }
        else
        {
          domain = false;
        }

        // release the RAM
        $parser = null;

        // return the URL
        return domain;
    }

    function preconnectPolyfill( domain ) {
        // Only necessary in Safari
        if ( ! isSafari() ) { return; }
    
        var url = domain + '/amp_preconnect_polyfill?' + Math.random(),
            // We use an XHR without withCredentials(true), so we do not send cookies
            // to the host and the host cannot set cookies.
            xhr = new XMLHttpRequest();

        xhr.open('HEAD', url, true);
        xhr.send();
    }

    // Safari check (for polyfilling)
    function isSafari() {
        return ( /Safari/i.test( window.navigator.userAgent ) && ! isChrome() );
    }
    // Chrome check (for polyfilling)
    // Note: Also true for MS Edge
    function isChrome() {
        return /Chrome|CriOS/i.test( window.navigator.userAgent );
    }

}( this, this.document ));
(function(window,document){
    'use strict';

    if ( ! ( 'querySelector' in document ) ||
         ! ( 'classList' in document.body ) ){
        return;
    }
    
    var $search_link = document.querySelector( '.main-navigation__link--search' ),
        $search_form = document.querySelector( '.form--search' ),
        open = ( window.location.hash == '#search' );
    
    $search_form.classList.add( 'toggleable' );
    $search_form.addEventListener( 'click', closeSearch, false );
    $search_form.addEventListener( 'touchdown', closeSearch, false );

    $search_link.addEventListener( 'click', openSearch, false );
    $search_link.addEventListener( 'touchdown', openSearch, false );
    
    // handle back
    window.addEventListener('pageshow', function(event) {
        open = ( window.location.hash == '#search' );
    });
    
    function openSearch( e ) {
        if ( open ) { return false; }
        open = true;
        
        e.preventDefault();
        $search_form.classList.add( 'toggleable--open' );
        $search_form.querySelector( '[type=search]' ).focus();
    }
    
    function closeSearch( e ) {
        if ( ! open ) { return false; }
        open = false;
        
        var target_tag = e.target.nodeName.toLowerCase();
        if ( target_tag == 'button' ||
             target_tag == 'input' ) {
            return false;
        } 
        
        e.preventDefault();
        window.location.hash = '#';
        $search_form.classList.remove( 'toggleable--open' );
        $search_link.focus();
    }
    
}(this,this.document));