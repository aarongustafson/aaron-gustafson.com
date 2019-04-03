(function( window, navigator ){
  // Register the service worker
  if ( "serviceWorker" in navigator )
  {
    navigator.serviceWorker.register( "/serviceworker.js" );

    if ( navigator.serviceWorker.controller )
    {
      window.addEventListener( "load", function(){
        navigator.serviceWorker.controller.postMessage( "clean up" );
      });
    }

  }
}( this, this.navigator ));