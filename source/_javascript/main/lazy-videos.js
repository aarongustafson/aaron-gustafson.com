/**
 *  Lazy Video Loading JavaScript
 *  A re-tooling of Aaron Parecki’s recommended JS for using the WebMention.io API
 * 
 *  Updates Webmentions on a static site immediately when the page is loaded and
 *  in real-time (using WebSockets) as the user engages with the page.
 * 
 * To inform the JavaScript of additional URLs to check (e.g. when the current page 
 * receives redirects from old URLs), use the following meta element:
 * 
 *  <meta property="webmention:redirected_from" content="URL_1,URL_2">
 * 
 * The content should be a single URL or multiple, separated by commas.
 */
    
(function( window, document ){
    
    if ( ! 'querySelectorAll' in document ){ return; }
    
    var $video_links = document.querySelectorAll( 'a[data-lazy-video-src]' ),
        link_count = $video_links.length,
        $iframe = document.createElement('iframe');
        
    if ( link_count > 0 )
    {
        $iframe.className = 'video-embed__video';
        $iframe.setAttribute('frameborder', '0');
        $iframe.setAttribute('allowfullscreen','');
        
        function start(e)
        {
             e.preventDefault();

             var $link = e.target,
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

        while ( link_count-- )
        {
            console.log($video_links[link_count]);
            $video_links[link_count].addEventListener( 'click', start, false );
            $video_links[link_count].addEventListener( 'touchdown', start, false );
        }
    }
    
    $video_links = null;
    
}( this, this.document ));