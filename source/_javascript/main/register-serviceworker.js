(function( navigator ){
	// Register the service worker
	if ( 'serviceWorker' in navigator )
	{
		navigator.serviceWorker
			.register('/serviceworker.min.js')
				.then(function(registration) {
					// Registration was successful
					console.log(
						'ServiceWorker registration successful with scope: ',
						registration.scope
					);
				})
				.catch(function(err) {
				    // registration failed :(
				    console.log( 'ServiceWorker registration failed: ', err );
				});
	}
}( this.navigator ));