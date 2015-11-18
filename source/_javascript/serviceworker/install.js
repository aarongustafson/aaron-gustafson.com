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