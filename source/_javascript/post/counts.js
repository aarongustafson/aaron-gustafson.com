(function( window, document ){
	
	if ( ! "querySelectorAll" in window )
	{
		return;
	}

	var s = document.createElement('script'),
		$webmentions_link = document.querySelector('.entry__jump--webmentions a'),
		webmentions_count = document.querySelectorAll( '.webmentions__item' ).length;

	// Add the webmentions count
	$webmentions_link.innerHTML = webmentions_count + ' ' + $webmentions_link.innerHTML;

	// Add the comment count
	s.async = true;
	s.type = 'text/javascript';
	s.src = '//aarongustafson.disqus.com/count.js';
	(document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);

}( this, this.document ));