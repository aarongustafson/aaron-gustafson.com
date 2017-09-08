'use strict';

var version = 'v1504886147253:',
	default_avatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y',
	missing_image = 'https://i.imgur.com/oWLuFAa.gif';
self.addEventListener( 'activate', function( event ){

    // console.log('WORKER: activate event in progress.');

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
            //.then(function(){
            //    console.log('WORKER: activate completed.');
            //})
    );
});
self.addEventListener( 'fetch', function( event ){
    
    // console.log( 'WORKER: fetch event in progress.' );

    var request = event.request,
        url = request.url,
        // don’t bother caching these
        ignore = [
            'p.typekit.net/p.gif',
            'www.google-analytics.com/r/collect',
            'ogg',
            'mp3',
            'mp4',
            'ogv',
            'webm',
            'chrome-extension'
        ],
        // only grab these once (they’re unlikely to need refreshing)
        fetch_once = [
            'https://pbs.twimg.com',
            'https://webmention.io/avatar/',
            'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy',
            'https://disqus.com',
            'https://a.disquscdn.com',
            'https://referrer.disqus.com',
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
// Listen to fetch events
self.addEventListener('fetch', function(event) {

    var request = event.request,
        url = request.url,
        url_object = new URL( url ),
        re_jpg_or_png = /\.(?:jpg|png)$/,
        supports_webp = false, // pessimism
        webp_url;

    // Check if the image is a local jpg or png
    if ( re_jpg_or_png.test( request.url ) &&
         url_object.origin == location.origin ) {

        // console.log('WORKER: caught a request for a local PNG or JPG');

        // Inspect the accept header for WebP support
        if ( request.headers.has('accept') )
        {
            supports_webp = request.headers.get('accept').includes('webp');
        }

        // Browser supports WebP
        if ( supports_webp )
        {
            // Make the new URL
            webp_url = url.substr(0, url.lastIndexOf('.')) + '.webp';

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

    // console.log( 'WORKER: install event in progress.' );

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
            // .then(function(){
            //     console.log('WORKER: install completed');
            // })
    );
});