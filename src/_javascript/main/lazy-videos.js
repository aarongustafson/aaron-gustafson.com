/**
 *  Lazy Video Loading JavaScript
 */
    
(function( window, document ){
    'use strict';

    if ( ! ( 'querySelectorAll' in document ) ){ return; }
    
    var $video_links = document.querySelectorAll( 'a[data-lazy-video-src]' ),
        link_count = $video_links.length,
        $iframe = document.createElement('iframe');
        
    if ( link_count > 0 )
    {
        $iframe.className = 'video-embed__video';
        $iframe.setAttribute('frameborder', '0');
        $iframe.setAttribute('allowfullscreen','');
        
        while ( link_count-- )
        {
            // should make loading faster
            if ( 'AG' in window &&
                 'preconnect' in window.AG )
            {
                window.AG.preconnect(
                    $video_links[link_count].getAttribute('data-lazy-video-src')
                );
            }
            
            // actual event handlers
            $video_links[link_count].addEventListener( 'click', start, false );
            $video_links[link_count].addEventListener( 'touchdown', start, false );
        }
    }
    
    $video_links = null;
    
    function start( event )
    {
        event.preventDefault();

        var $link = event.target,
            $video_embed = $iframe.cloneNode(true);
        
        while ( $link.nodeName.toLowerCase() != 'a' )
        {
            $link = $link.parentNode;
        }
        
        $video_embed.setAttribute( 'src', $link.getAttribute('data-lazy-video-src') );
        
        $link.parentNode.replaceChild( $video_embed, $link );
        
        $link = null;
        $video_embed = null;
        
        return false;
    }

}( this, this.document ));
