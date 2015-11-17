'use strict';

var version = 'v1::',
	default_avatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y',
	missing_image = 'https://i.imgur.com/oWLuFAa.gif';
self.addEventListener( 'activate', function( event ){

    console.log('WORKER: activate event in progress.');

    event.waitUntil(
        caches
            .keys()
            .then(function( keys ){
                return Promise.all(
                    keys.filter(function( key ){
                        return !key.startsWith(version);
                         })
                        .map(function( key ){
                            return caches.delete( key );
                         })
                );
            })
            .then(function(){
                console.log('WORKER: activate completed.');
            })
    );
});
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
// Listen to fetch events
self.addEventListener('fetch', function(event) {

    // Check if the image is a jpg or png
    if ( /\.jpg$|.png$/.test(event.request.url) )
    {

        var supports_webp = false, // pessimism
            webp_url;

        // Inspect the accept header for WebP support
        if ( event.request.headers.has('accept') )
        {
            supports_webp = event.request.headers.get('accept').includes('webp');
        }

        // Browser supports WebP
        if ( supports_webp )
        {
            // Make the new URL
            webp_url = event.request.url.substr(0, event.request.url.lastIndexOf('.')) + '.webp';

            event.respondWith(
                fetch(
                    webp_url,
                    { mode: 'no-cors' }
                )
            );
        }
    }
});
self.addEventListener( 'install', function( event ){

    console.log('WORKER: install event in progress.');

    var offline_assets = [
        'favicon.png',
        'c/default.css',
        'c/advanced.css',
        'j/main.js',
        default_avatar,
        missing_image
    ];

    event.waitUntil(
        caches
            .open(version + 'assets')
            .then(function( cache ){
                return cache.addAll( offline_assets );
            })
            .then(function(){
                console.log('WORKER: install completed');
            })
    );
});