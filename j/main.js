(function( window, document ){

  // Bail on older browsers
  if ( !('querySelectorAll' in document) )
  {
    return false;
  }

  var anchorable_elements = 'h1 h2 h3 h4 h5 h6 figure .gist'.split( ' ' ),
  $anchorable,
  length,
  $active,
  location = window.location.href,
  $body = document.body,
  prefix = 'anchorable',
  // Anchor
  $anchor,
  anchor_class = prefix + '__anchor',
  anchor_svg = '<svg xmlns="http://www.w3.org/2000/svg" class="' + prefix + '__icon" width="15" height="15" viewBox="0 0 8 8"><path d="M5.88.03c-.18.01-.36.03-.53.09-.27.1-.53.25-.75.47a.5.5 0 1 0 .69.69c.11-.11.24-.17.38-.22.35-.12.78-.07 1.06.22.39.39.39 1.04 0 1.44l-1.5 1.5c-.44.44-.8.48-1.06.47-.26-.01-.41-.13-.41-.13a.5.5 0 1 0-.5.88s.34.22.84.25c.5.03 1.2-.16 1.81-.78l1.5-1.5c.78-.78.78-2.04 0-2.81-.28-.28-.61-.45-.97-.53-.18-.04-.38-.04-.56-.03zm-2 2.31c-.5-.02-1.19.15-1.78.75l-1.5 1.5c-.78.78-.78 2.04 0 2.81.56.56 1.36.72 2.06.47.27-.1.53-.25.75-.47a.5.5 0 1 0-.69-.69c-.11.11-.24.17-.38.22-.35.12-.78.07-1.06-.22-.39-.39-.39-1.04 0-1.44l1.5-1.5c.4-.4.75-.45 1.03-.44.28.01.47.09.47.09a.5.5 0 1 0 .44-.88s-.34-.2-.84-.22z"/></svg>',
  anchor_message = '<b class="' + anchor_class + '__text">Click to get a link to this exact spot.</b>',
  anchor_notifier = '<strong aria-live="assertive" class="' + prefix + '__alert"></strong>',
  anchor_html = anchor_svg + anchor_message + anchor_notifier,
  // Alert
  alert_duration = 2000,
  success_message = '<b class="hidden">The link was </b>copied<b class="hidden"> to your clipboard.</b>',
  // Textarea
  $textarea,
  // Speech
  speech = 'speechSynthesis' in window,
  speak = function(){},
  // keyboard
  keypress = false;

  // collect the anchorable elements
  length = anchorable_elements.length;
  while ( length-- )
  {
    anchorable_elements[length] = 'main ' + anchorable_elements[length] + '[id]';
  }
  anchorable_elements = anchorable_elements.join( ', ' );

  // collect the elements
  $anchorable = document.querySelectorAll( anchorable_elements );
  length = $anchorable.length;

  // exit early
  if ( ! length )
  {
    // console.log('nothing found');
    return;
  }

  // DOM
  function createAnchor()
  {
    $anchor = document.createElement('a');
    $anchor.className = anchor_class;
    $anchor.innerHTML = anchor_html;
  }
  function createHiddenTextarea()
  {
    var $div = document.createElement( 'div' );
    $textarea = document.createElement( 'textarea' );

    // we can’t actually hide these, need to do inline CSS
    // lovingly adapted from Trello
    $div.style = 'position: fixed; left: 0px; top: 0px; width: 0px; height: 0px; z-index: 100; opacity: 0;';
    $textarea.style = 'width: 1px; height: 1px; padding: 0px;';

    $div.appendChild( $textarea );
    $body.appendChild( $div );
    $div = null;
  }

  // ACTIONS
  function copy( url )
  {
    // create a hidden textarea to copy from
    if ( ! $textarea )
    {
      createHiddenTextarea();
    }

    $textarea.innerText = url;
    $textarea.select();

    try {
      return document.execCommand('copy');
    } catch (err) {
      return false;
    }
  }
  function alertUser( message )
  {
    var $alert = $active.querySelector( '.' + prefix + '__alert' );

    $alert.innerHTML = message;
    speak( $alert.innerText );

    $alert.classList.add( prefix + '__alert--fading' );
    setTimeout( hideAlert, alert_duration );
  }
  function hideAlert()
  {
    var $alert = $active.querySelector( '.' + prefix + '__alert' );

    $alert.innerHTML = '';
    $alert.classList.remove( prefix + '__alert--fading' );
    $active = false;
  }

  // Speak
  // if ( speech )
  // {
  //   speak = function( msg ){
  //     var msg = new SpeechSynthesisUtterance( msg );
  //     window.speechSynthesis.speak( msg );
  //   }; 
  // }

  // EVENTS
  function keypressHandler( event )
  {
    if ( event.which == '13' )
    {
      keypress = true;
      clickHandler( event );
    }
  }
  function clickHandler( event )
  {
    //console.log( event );
    // only way to detech Enter keypress on a link
    if ( ! event.screenX &&
         ! event.screenY )
      {
        keypress = true;
      }

      var $element = event.target,
      url;

      // Make sure we have the link
      while ( $element.nodeName.toLowerCase() != 'a' )
      {
        $element = $element.parentNode;
      }

      // don’t go 2x if tapped
      if ( !! $element.throttled )
      {
        return;
      }
      $element.throttled = true;
      setTimeout(function(){
        $element.throttled = false;
      }, 500);

      $active = $element;

      // copy the location (if possible )
      url = ( $element.href.indexOf('#') == 0 ) ? location + $element.href : $element.href;
      if ( copy( url ) )
      {
        event.preventDefault();
        alertUser( success_message );
      }

      // return focus
      //console.log( keypress );
      if ( keypress )
      {
        $element.focus();
      }
      keypress = false;
    }

    // wire it all up
    function enableAnchorables()
    {
      var $element,
      $a;

      length = $anchorable.length;
      while ( length-- )
      {
        $element = $anchorable[length];

        // Check to make sure the previous sibling is not also anchorable.
        // If it is, skip it
        if ( $element.previousElementSibling === $anchorable[length-1] )
        {
          continue;
        }

        // classify
        $element.classList.add( prefix );

        // Clone the link
        $a = $anchor.cloneNode( true );

        // Set the URL
        $a.href = '#' + $element.id;

        // set a tap/click/keypress to copy the URL
        $a.addEventListener( 'touchdown', clickHandler, false );
        $a.addEventListener( 'click', clickHandler, false );
        $a.addEventListener( 'keypress', keypressHandler, false );

        // Add
        $element.appendChild( $a );
      }

      // release DOM references
      element = null;
    }

    // Initialize
    function init()
    {
      //console.log('init');

      createAnchor();
      enableAnchorables();
    }

    // Teardown
    function teardown()
    {
      var $element;

      length = $anchorable.length;
      while ( length-- )
      {
        $a = $anchorable[length].querySelector( 'a.' + anchor_class );
        // remove events
        $a.removeEventListener( 'touchdown', clickHandler, false );
        $a.removeEventListener( 'click', clickHandler, false );
        $a.removeEventListener( 'keypress', keypressHandler, false );
      }

      // release DOM references
      $element = null;
      $anchorable = null;
      $anchor = null;
      $alert = null;
      $textarea = null;
    }

    // initialize
    init();

    // cleanup
    window.addEventListener( 'unload', teardown, false );

  }( this, this.document ));
(function( document, location ){

  // Bail on older browsers
  if ( ! ('querySelectorAll' in document) )
  {
    return false;
  }

  var $navigation = window.document.querySelectorAll('nav a'),
      current_host = window.location.origin,
      current_path = window.location.pathname.split('/'),
      link_i = $navigation.length,
      $link,
      $current_page_descriptor = false;

  // remove empties
  current_path.shift();
  current_path.pop();
  
  while ( link_i-- )
  {
    $link = $navigation[link_i];
    if ( linkIsInPath( $link ) )
    {
      markLinkCurrent( $link );
    }
  }

  function linkIsInPath( $link )
  {
    var link_href = $link.href,
        link_path = $link.attributes.href.nodeValue,
        segment_i;
    if ( link_href.indexOf( current_host ) > -1 )
    {
      if ( link_path.indexOf('#') === 0 )
      {
        return false;
      }
      link_path = link_path.split( '/' );
      i = 0;
      segment_i = link_path.length;
      // remove first & last
      link_path.shift();
      link_path.pop();
      while ( i < segment_i )
      {
        if ( link_path[i] &&
             current_path[i] != link_path[i] )
        {
          return false;
        }
        i++;
      }
      return true;
    }
  }

  function markLinkCurrent( $link ){
    var $mark = document.createElement('mark');
    $link.parentNode.appendChild($mark);
    $mark.appendChild($link);

    if ( ! $current_page_descriptor )
    {
      insertCurrentPageDescriptor();
    }
    $link.setAttribute('aria-describedby','current-page-descriptor');
  }

  function insertCurrentPageDescriptor()
  {
    $current_page_descriptor = document.createElement('small');
    $current_page_descriptor.id = 'current-page-descriptor';
    $current_page_descriptor.style.display = 'none';
    $current_page_descriptor.innerHTML = '(You are on this page or in this section)';
    document.body.appendChild( $current_page_descriptor );
  }

}( this.document, this.location ));
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
        //  // Registration was successful
        //  console.log(
        //    'ServiceWorker registration successful with scope: ',
        //    registration.scope
        //  );
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