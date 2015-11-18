// Listen to fetch events
self.addEventListener('fetch', function(event) {

    var request = event.request,
        url = request.url,
        re_local_image = /^(?:https?:)?\/\/www\.aaron-gustafson\.com\/.+\.(:?jpg|png)$/;

    // Check if the image is a local jpg or png
    if ( re_local_image.test( url ) )
    {
        // console.log('WORKER: caught a request for a local image');

        var supports_webp = false, // pessimism
            webp_url;

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