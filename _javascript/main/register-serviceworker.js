(function( window, navigator, document ){
  // Register the service worker
  if ( "serviceWorker" in navigator )
  {
    window.sw_version = "v2:";
    navigator.serviceWorker.register( "/serviceworker.min.js" );

    if ( navigator.serviceWorker.controller )
    {
      window.addEventListener( "load", function(){
        navigator.serviceWorker.controller.postMessage( "clean up" );
      });
    }

    // Store page names & descriptions
    if ( ! /\/notebook\/.+/.test( window.location ) )
    {
      var data = {
        title: document.querySelector("[property='og:title']").getAttribute("content"),
        description: document.querySelector( "meta[name='description']" ).getAttribute("content")
      };
      localStorage.setItem( location, JSON.stringify(data) );
    }

  }
}( this, this.navigator, this.document ));