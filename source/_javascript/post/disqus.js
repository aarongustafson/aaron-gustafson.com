(function( window, document ) {
    'use strict';
    
    var dsq = document.createElement('script'),
    	script_name = '//' + disqus_shortname + '.disqus.com/' + disqus_script;
   	
	if ( 'AG' in window &&
		 'preconnect' in window.AG )
	{
        window.AG.preconnect( '//disqus.com/' );
        window.AG.preconnect( '//aarongustafson.disqus.com' );
        window.AG.preconnect( '//links.services.disqus.com/' );
        window.AG.preconnect( '//a.disquscdn.com' );
        window.AG.prefetch( script_name );
    }
	
	dsq.type = 'text/javascript';
    dsq.async = true;
    dsq.src = script_name;
    
    (document.head || document.body).appendChild(dsq);

}( this, this.document ));