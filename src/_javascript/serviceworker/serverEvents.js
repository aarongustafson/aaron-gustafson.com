// Server Event: Latest Links
if ( "widgets" in self ) {

	function initServerEvents( url, widget_tag ) {
		const deployedEvent = new EventSource( url );
		deployedEvent.addEventListener('message', function (event) {
			var message = JSON.parse(event.data);
			// console.log(message);
			if ( message.event == "deployed" ) {
				updateWidgetByTag( widget_tag );
			}
		}, false);
	}
	
	initServerEvents( '/api/latest-links/', 'feed-links' );
}
