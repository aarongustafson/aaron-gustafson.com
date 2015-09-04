/* ! Sharing popup */
(function( window, document ){
	
	// Filter older browsers
	if ( ! 'querySelectorAll' in document )
	{
		return;
	}
	
	// event handler
	function click(e)
	{
		var target = e.target;

		// target must be an anchor and the inner width threshold must be met
		if ( e.target.nodeName.toLowerCase() == 'a' &&
			 window.innerWidth >= threshold )
		{
			// prevent the default link click
			e.preventDefault();

			// open the link in a popup
			window.open( target.href, 'share-this', 'height=300,width=500,status=no,toolbar=no' );

			// return
			return false;
		}
	}

		// gather the links container
	var share_links = document.querySelectorAll('.entry__sharing'),
		// set the threshold width
		threshold = 640;

	// watcher
	if ( share_links.length > 0 )
	{
		share_links[0].addEventListener( 'click', click, false );
	}

}( this, this.document ));