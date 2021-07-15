(function( window ){
  'use strict';

  if ( ! ( 'Promise' in window ) ) { return; }

  var preconnectAvailable = new Promise(function(resolve, reject) {
      var timer = setInterval(function(){
        if ( 'AG' in window &&
         'preconnect' in window.AG )
        {
          clearInterval( timer );
          resolve( 'preconnect available' );
        }
      },50);
  });

  preconnectAvailable.then(function(){
    window.AG.preconnect( '//gist.github.com' );
    window.AG.preconnect( '//assets-cdn.github.com' );
    window.AG.preconnect( 'https://images1-focus-opensocial.googleusercontent.com' );
  });

}(window));
