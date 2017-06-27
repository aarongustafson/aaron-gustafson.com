(function( window, document ){
    'use strict';

    if ( ! ( 'querySelectorAll' in document ) ) { return; }

    var s = document.createElement('script'),
        $webmentions_counter = document.querySelector( '.webmention-count' );

    // Add the webmentions count
    $webmentions_link.innerHTML = document.querySelectorAll( '.webmentions__item' ).length;

    // Preconnect to Disqus if possible
    if ( 'AG' in window &&
         'preconnect' in window.AG )
    {
        window.AG.preconnect( '//disqus.com/' );
        window.AG.preconnect( '//aarongustafson.disqus.com' );
        window.AG.preconnect( '//links.services.disqus.com/' );
        window.AG.preconnect( '//a.disquscdn.com' );
    }
    else
    {
        //console.log('No preconnect');
    }

    // Add the comment count
    s.async = true;
    s.type = 'text/javascript';
    s.src = '//aarongustafson.disqus.com/count.js';
    (document.head || document.body).appendChild(s);

}( this, this.document ));