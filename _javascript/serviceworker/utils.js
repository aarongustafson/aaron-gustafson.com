function saveToCache( cache, request, response )
{
  // console.log( 'saving a copy of', request.url );
  caches.open( sw_caches[cache].name )
    .then( cache => {
      return cache.put( request, response );
    });
}

function refreshCachedCopy( the_request, cache_name )
{
  fetch( the_request )
    .then( the_response => {
      caches.open( cache_name )
        .then( the_cache => {
          return the_cache.put( the_request, the_response );
        });
    })
    .catch(
      respondWithOfflinePage
    );
}

function shouldBeIgnored( url )
{
  let i = ignore.length;
  while( i-- )
  {
    if ( url.indexOf( ignore[i] ) > -1 )
    {
      // console.log( "found", ignore[i], 'in', url );
      return true;
    }
  }
  return false;
}

function isHighPriority( url )
{
  let i = high_priority.length;
  while ( i-- )
  {
    if ( high_priority[i].test( url ) )
    {
      return true;
    }
  }
  return false;
}

function respondWithOfflinePage()
{
  return caches.match( offline_page )
           .catch(
             respondWithServerOffline
           );
}

function respondWithFallbackImage( url, fallback = fallback_image )
{
  const image = avatars.test( url ) ? fallback_avatar : fallback;
  return caches.match( image )
           .catch(
             respondWithServerOffline
           );
}

function respondWithOfflineImage()
{
  return caches.match( offline_image );
}

function respondWithServerOffline(){
  return new Response( "", {
    status: 408,
    statusText: "The server appears to be offline."
  });
}

function requestIsLikelyForHTML( url )
{
  return /.+(\/|\.html)$/.test( url );
}