// Add a comments message if offline
(function(){
    'use strict';

    if ( ! ( 'onLine' in window.navigator ) ){ return; }

    var offline = !window.navigator.onLine,
        $p,
        $comments;

    if ( offline )
    {
        $p = document.createElement('p');
        $p.innerText = 'Your internet connection is currently offline, so I can’t load in the comment thread from Disqus.';
        $comments = document.getElementById( 'disqus' );
        $comments.appendChild($p);

        $p = null;
        $comments = null;
    }

}());