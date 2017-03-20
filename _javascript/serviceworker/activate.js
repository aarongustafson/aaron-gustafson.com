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