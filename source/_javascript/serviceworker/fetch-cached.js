self.addEventListener( 'fetch', function( event ){
    
    console.log('WORKER: fetch event in progress.');

    if ( event.request.method !== 'GET' )
    {
        console.log( 'WORKER: fetch event ignored.', event.request.method, event.request.url );
        return;
    }

    event.respondWith(
        caches
            .match( event.request )
            .then(function( cached ){
                var networked = fetch( event.request )
                                    .then( fetchedFromNetwork, unableToResolve )
                                    .catch( unableToResolve );

                console.log( 'WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url );
                return cached || networked;
            })
    );

    function fetchedFromNetwork( response ) {
                    
        var cache_copy = response.clone();
        
        console.log( 'WORKER: fetch response from network.', event.request.url );

        caches
            .open( version + 'pages' )
            .then(function add( cache ){
                cache.put( event.request, cache_copy );
             })
            .then(function(){
                console.log( 'WORKER: fetch response stored in cache.', event.request.url );
             });

        // Return the response so that the promise is settled in fulfillment.
        return response;

    }

    function unableToResolve() {
        console.log('WORKER: fetch request failed in both cache and network.');

        var accepts = request.headers.get('Accept'),
            url = new URL( request.url );
        
        if ( accepts.indexOf('image') > -1 )
        {
            if ( url.host === 'www.gravatar.com' ) {
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