(function( window ){

  if ( "serviceWorker" in navigator )
  {
    var $button = document.createElement('button'),
        $intro = document.createElement('dt'),
        $controls = document.createElement('dd'),
        $df = document.createDocumentFragment(),
        post_cache = window.sw_version + "posts",
        caches = window.caches,
        location = window.location.href;

    $button.innerText = "Save offline";
    caches.match( location )
      .then( item => {
        if ( item )
        {
          $button.innerText = "Already saved!";
          $button.disabled = true;
        }
      });

    $button.addEventListener( "click", function( e ){
      e.preventDefault();

      $button.innerText = "Saving…";

      caches.open( post_cache )
        .then( cache => {
          cache.add( location )
            .then(function(){
              $button.innerText = "Saved!";
              $button.disabled = true;

              var data = {
                title: document.querySelector("[property='og:title']").getAttribute("content"),
                description: document.querySelector( "meta[name='description']" ).getAttribute("content")
              };
              localStorage.setItem( location, JSON.stringify(data) );
            })
            .catch(function(){
              $button.innerText = "Save failed :-(";
            })
        });

    }, false );

    $intro.classList.add( "dont-read" );
    $intro.innerText = "Want to read this offline?";
    $df.appendChild( $intro );
    $controls.appendChild( $button );
    $controls.classList.add( "dont-read" );
    $df.appendChild( $controls );
    document.querySelector('.entry__meta > dl').appendChild( $df );
  }

}( this ));