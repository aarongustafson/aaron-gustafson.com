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

  // remove empties
  current_path.shift();
  current_path.pop();
  
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
    var link_href = $link.href,
        link_path = $link.attributes.href.nodeValue,
        segment_i;
    if ( link_href.indexOf( current_host ) > -1 )
    {
      if ( link_path.indexOf('#') === 0 )
      {
        return false;
      }
      link_path = link_path.split( '/' );
      i = 0;
      segment_i = link_path.length;
      // remove first & last
      link_path.shift();
      link_path.pop();
      while ( i < segment_i )
      {
        if ( link_path[i] &&
             current_path[i] != link_path[i] )
        {
          return false;
        }
        i++;
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