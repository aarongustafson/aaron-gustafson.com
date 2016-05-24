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