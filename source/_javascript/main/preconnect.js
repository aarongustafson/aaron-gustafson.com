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