self.addEventListener( "install", function( event ){

  // console.log( "WORKER: install event in progress." );

  event.waitUntil(
    caches.open( sw_caches.static.name )
      .then(function( cache ){
        return cache.addAll( preinstall );
      })
  );

});
