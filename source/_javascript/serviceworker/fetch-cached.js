self.addEventListener( 'fetch', function( event ){
    
    // console.log( 'WORKER: fetch event in progress.' );

    var request = event.request,
        url = request.url,
        // don’t bother caching these
        ignore = [
            'p.typekit.net/p.gif',
            'www.google-analytics.com/r/collect'
        ],
        // only grab these once (they’re unlikely to need refreshing)
        fetch_once = [
            'https://pbs.twimg.com',
            'https://webmention.io/avatar/',
            'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy'
        ];

    if ( request.method !== 'GET' || urlShouldBeIgnored() )
    {
        // console.log( 'WORKER: fetch event ignored.', request.method, url );
        return;
    }

    event.respondWith(
        caches
            .match( request )
            .then(function( cached ){

                // If the URL should only be fetched once and it’s already cached
                // don’t grab it again.
                if ( cached && urlShouldBeFetchedOnce() )
                {
                    // console.log( 'WORKER: fetch event skipped', url, 'should only be cached once' );
                    return cached;
                }

                // pull "eventually fresh" from the network
                var networked = fetch( request )
                                    .then( fetchFromNetwork, resolve )
                                    .catch( resolve );

                // console.log( 'WORKER: fetch event', cached ? '(cached)' : '(network)', url );
                return cached || networked;
            })
    );

    function urlShouldBeIgnored() {
        // console.log( 'WORKER: Checking ignore list', ignore );
        var i = ignore.length;
        
        while( i-- )
        {
            // console.log( 'WORKER: Testing', url, 'against', ignore[i] );
            if ( url.indexOf( ignore[i] ) > -1 ) {
                return true;
            }
        }

        return false;
    }

    function urlShouldBeFetchedOnce() {
        // console.log( 'WORKER: Checking fetch_once list', fetch_once );
        var i = fetch_once.length;
        
        while( i-- )
        {
            // console.log( 'WORKER: Testing', url, 'against', fetch_once[i] );
            if ( url.indexOf( fetch_once[i] ) > -1 ) {
                return true;
            }
        }

        return false;
    }

    function fetchFromNetwork( response ) {
                    
        var cache_copy = response.clone();
        
        // console.log( 'WORKER: fetch response from network.', url );

        caches
            .open( version + 'pages' )
            .then(function add( cache ){
                cache.put( request, cache_copy );
             })
            .then(function(){
                // console.log( 'WORKER: fetch response stored in cache.', url );
             });

        // Return the response so that the promise is settled in fulfillment.
        return response;

    }

    function resolve() {
        // console.log( 'WORKER: fetch request failed in both cache and network.' );

        var accepts = request.headers.get('Accept'),
            requested_url = new URL( url );
        
        if ( accepts.indexOf('image') > -1 )
        {
            if ( requested_url.host === 'www.gravatar.com' ) {
                return caches.match( default_avatar );
            }
            return caches.match( missing_image );
        }

        return generateOfflineResponse();
    }

    function generateOfflineResponse() {
        return new Response(
            '<h1>Service Unavailable</h1>',
            {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                    'Content-Type': 'text/html'
                })
            }
        );
    }

});