// Social media avatars disappear on occasion.
// If they aren’t available, hide em.
(function( window ){
    'use strict';

    if ( 'addEventListener' in window )
    {
        window.addEventListener( 'load', checkImages, false );
    }

    function checkImages(){
        var images = document.getElementById('webmentions').getElementsByTagName('img'),
            i = images.length;
        while ( i-- )
        {
            if ( ! images[i].naturalWidth )
            {
                images[i].src = "/i/fallbacks/avatar.svg";
            }
        }
        // release the DOM reference
        images = null;
    }

}( this ));