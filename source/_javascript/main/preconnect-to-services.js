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
		window.AG.preconnect( '//www.google-analytics.com' );
		window.AG.prefetch( '//www.google-analytics.com/analytics.js' );
		window.AG.preconnect( '//use.typekit.net' );
		window.AG.prefetch( '//use.typekit.net/jje3afr.js' );
		window.AG.preconnect( '//gist.github.com' );
		window.AG.preconnect( '//assets-cdn.github.com' );
	});

}(window));