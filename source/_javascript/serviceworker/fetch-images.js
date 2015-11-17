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