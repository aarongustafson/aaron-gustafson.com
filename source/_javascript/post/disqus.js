(function( window, document ) {
    'use strict';

    var $discuss_script = document.createElement('script'),
    	script_name = '//' + disqus_shortname + '.disqus.com/' + disqus_script;
   	
	if ( 'AG' in window &&
		 'preconnect' in window.AG )
	{
        window.AG.preconnect( '//disqus.com/' );
        window.AG.preconnect( '//aarongustafson.disqus.com' );
        window.AG.preconnect( '//links.services.disqus.com/' );
        window.AG.preconnect( '//a.disquscdn.com' );
        window.AG.prefetch( '//use.typekit.net/jje3afr.js' );
        window.AG.prefetch( script_name );
        if ( script_name.indexOf('count') < 0 )
        {
            window.AG.prefetch( '//' + disqus_shortname + '.disqus.com/count.js' );
        }
    }
	
	$discuss_script.type = 'text/javascript';
    $discuss_script.async = true;
    $discuss_script.src = script_name;
    
    (document.head || document.body).appendChild( $discuss_script );

    $discuss_script = null;

}( this, this.document ));