// Social media avatars disappear on occasion.
// If they aren’t available, hide em.
(function( window ){
	
	if ( 'addEventListener' in window )
	{
		window.addEventListener( 'load', checkImages, false );
	}

	function checkImages(){
		var images = document.getElementById("webmentions").getElementsByTagName('img'),
			i = images.length;
		while ( i-- )
		{
			if ( ! images[i].naturalWidth )
			{
				images[i].style.visibility = 'hidden';
			}
		}
		// release the DOM reference
		images = null;
	}

}( this ));