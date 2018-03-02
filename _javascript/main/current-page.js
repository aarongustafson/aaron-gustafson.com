(function( document, location ){

  // Bail on older browsers
  if ( ! 'querySelectorAll' in document )
  {
    return false;
  }

  var $navigation = window.document.querySelectorAll('nav a'),
      current_host = window.location.origin,
      current_path = window.location.pathname.split('/'),
      link_i = $navigation.length,
      $link,
      $current_page_descriptor = false;

  current_path.reverse(); // looping backwards is faster

  while ( link_i-- )
  {
    $link = $navigation[link_i];
    if ( linkIsInPath( $link ) )
    {
      markLinkCurrent( $link );
    }
  }

  function linkIsInPath( $link )
  {
    var link_path = $link.href,
        segment_i;
    if ( link_path.indexOf( current_host ) > -1 )
    {
      link_path = link_path.replace( current_host, '' ).split( '/' );
      link_path.reverse();
      segment_i = link_path.length;
      while ( segment_i-- )
      {
        if ( segment_i in current_path &&
             current_path[segment_i] != link_path[segment_i] )
        {
          return false;
        }
      }
      return true;
    }
  }

  function markLinkCurrent( $link ){
    var $mark = document.createElement('mark');
    $link.parentNode.appendChild($mark);
    $mark.appendChild($link);

    if ( ! $current_page_descriptor )
    {
      insertCurrentPageDescriptor();
    }
    $link.setAttribute('aria-describedby','current-page-descriptor');
  }

  function insertCurrentPageDescriptor()
  {
    $current_page_descriptor = document.createElement('small');
    $current_page_descriptor.id = 'current-page-descriptor';
    $current_page_descriptor.style.display = 'none';
    $current_page_descriptor.innerHTML = '(You are on this page or in this section)';
    document.body.appendChild( $current_page_descriptor );
  }

}( this.document, this.location ));