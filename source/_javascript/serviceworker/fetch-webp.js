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