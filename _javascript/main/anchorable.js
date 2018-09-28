(function( window, document ){
    
    // Bail on older browsers
    if ( ! 'querySelectorAll' in document )
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
    if ( speech )
    {
        speak = function( msg ){
            var msg = new SpeechSynthesisUtterance( msg );
            window.speechSynthesis.speak( msg );
        }; 
    }
        
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