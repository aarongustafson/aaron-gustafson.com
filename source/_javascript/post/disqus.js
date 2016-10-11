(function( window, document ) {
    'use strict';

    var $s = document.createElement('script');
    $s.src = '//' + window.AG.disqus.shortname + '.disqus.com/' + window.AG.disqus.script;
    $s.setAttribute( 'data-timestamp', '' + new Date() );
    (document.head || document.body).appendChild( $s );
    $s = null;

}( this, this.document ));