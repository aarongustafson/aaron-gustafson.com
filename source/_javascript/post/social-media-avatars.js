// Social media avatars disappear on occasion.
// If they aren’t available, hide em.
(function( images ){
	
	var i = images.length;
	while ( i-- )
	{
		if ( ! images[i].naturalWidth )
		{
			images[i].style.visibility = 'hidden';
		}
	}

}( document.getElementsByTagName('img') ));