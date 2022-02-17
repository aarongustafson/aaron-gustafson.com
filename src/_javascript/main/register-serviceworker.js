(function( window, navigator, document ){
  // Register the service worker
  if ( "serviceWorker" in navigator )
  {
    window.sw_version = "v8:";

    window.addEventListener('load', function() {
      navigator.serviceWorker.register( "/serviceworker.min.js" );

      // Store page names & descriptions
      if ( ! /\/notebook\/.+/.test( window.location ) )
      {
        var data = {
          title: document.querySelector("[property='og:title']").getAttribute("content"),
          description: document.querySelector( "meta[name='description']" ).getAttribute("content")
        };
        localStorage.setItem( location, JSON.stringify(data) );
      }
    });

    if ( navigator.serviceWorker.controller )
    {
      window.addEventListener( "load", function(){
        navigator.serviceWorker.controller.postMessage( "clean up" );
      });
    }

  }
}( this, this.navigator, this.document ));