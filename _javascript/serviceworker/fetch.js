self.addEventListener( "fetch", event => {
  
  // console.log( "WORKER: fetch event in progress." );
  
  const request = event.request,
        url = request.url;
  
  if ( request.method !== "GET" || shouldBeIgnored( url ) )
  {
    // console.log( "ignoring " + url );
    return;
  }

  if ( save_data == undefined )
  {
    save_data = request.headers.get("save-data");
  }

  // console.log(request.url, request.headers);

  // JSON & such
  if ( /\.json$/.test( url ) ||
       /jsonp\=/.test( url ) )
  {
    event.respondWith(
      caches.match( request )
        .then( cached_result => {
          // cached first
          if ( cached_result )
          {
            // Update the cache in the background, but only if we’re not trying to save data
            if ( ! save_data && ! slow_connection )
            {
              event.waitUntil(
                refreshCachedCopy( request, sw_caches.other.name )
              );
            }
            return cached_result;
          }
          // fallback to network
          return fetch( request )
              .then( response => {
                const copy = response.clone();
                event.waitUntil(
                  saveToCache( sw_caches.pages.name, request, copy )
                );
                return response;
              })
              // fallback to offline page
              .catch(
                respondWithServerOffline
              );
        })
    );
  }

  // JavaScript
  else if ( /\.js$/.test( url ) && isHighPriority( url ) )
  {
    event.respondWith(
      caches.match( request )
      .then( cached_result => {
        // cached first
        if ( cached_result )
        {
          // Update the cache in the background, but only if we’re not trying to save data
          if ( ! save_data && ! slow_connection )
          {
            event.waitUntil(
              refreshCachedCopy( request, sw_caches.static.name )
            );
          }
          return cached_result;
        }
        // fallback to network
        return fetch( request )
            .then( response => {
              const copy = response.clone();
              event.waitUntil(
                saveToCache( sw_caches.pages.name, request, copy )
              );
              return response;
            })
            // fallback to offline page
            .catch(
              respondWithServerOffline
            );
      })
    );
  }

  // HTML
  else if ( request.headers.get("Accept").includes("text/html") ||
            requestIsLikelyForHTML( url ) )
  {
  
    // notebook entries - cache first, then network (posts will be saved for offline individually), offline fallback
    if ( sw_caches.posts.path.test( url ) )
    {
      event.respondWith(
        caches.match( request )
          .then( cached_result => {
            // cached first
            if ( cached_result )
            {
              // Update the cache in the background, but only if we’re not trying to save data
              if ( ! save_data && ! slow_connection )
              {
                event.waitUntil(
                  refreshCachedCopy( request, sw_caches.posts.name )
                );
              }
              return cached_result;
            }
            // fallback to network
            return fetch( request )
              // fallback to offline page
              .catch(
                respondWithOfflinePage
              );
          })
      );
    }

    // all other pages - check the cache first, then network, cache reponse, offline fallback
    else
    {
      event.respondWith(
        // check the cache first
        caches.match( request )
          .then( cached_result => {
            if ( cached_result )
            {
              // Update the cache in the background, but only if we’re not trying to save data
              if ( ! save_data && ! slow_connection )
              {
                event.waitUntil(
                  refreshCachedCopy( request, sw_caches.pages.name )
                );
              }
              return cached_result;
            }
            // fallback to network, but cache the result
            return fetch( request )
              .then( response => {
                const copy = response.clone();
                event.waitUntil(
                  saveToCache( sw_caches.pages.name, request, copy )
                ); // end waitUntil
                return response;
              })
              // fallback to offline page
              .catch(
                respondWithOfflinePage
              );
          })
      );
    }
  }

  // images - cache first, then determine if we should request form the network & cache, fallbacks
  else if ( request.headers.get("Accept").includes("image") )
  {
    event.respondWith(
      // check the cache first
      caches.match( request )
        .then( cached_result => {
          if ( cached_result )
          {
            return cached_result;
          }

          // high priority imagery
          if ( isHighPriority( url ) )
          {
            return fetch( request, fetch_config.images )
              .then( response => {
                const copy = response.clone();
                event.waitUntil(
                  saveToCache( sw_caches.images.name, request, copy )
                ); // end waitUntil
                return response;
              })
              .catch(
                respondWithOfflineImage
              );
          }
          // all others
          else
          {
            // console.log('other images', url);
            // save data?
            if ( save_data || slow_connection )
            {
              // console.log('saving data, responding with fallback');
              return respondWithFallbackImage( url );
            }

            // normal operation
            else
            {
              // console.log('fetching');
              return fetch( request, fetch_config.images )
                .then( response => {
                  const copy = response.clone();
                  event.waitUntil(
                    saveToCache( sw_caches.other.name, request, copy )
                  );
                  return response;
                })
                // fallback to offline image
                .catch(function(){
                  return respondWithFallbackImage( url, offline_image );
                });
            }
          }
        })
    );
  }

  // everything else - cache first, then network
  else
  {
    event.respondWith(
      // check the cache first
      caches.match( request )
        .then( cached_result => {
          if ( cached_result )
          {
            return cached_result;
          }

          // save data?
          if ( save_data || slow_connection )
          {
            return new Response( "", {
              status: 408,
              statusText: "This request was ignored to save data."
            });
          }
          
          // normal operation
          else
          {
            return fetch( request )
              .then( response => {
                const copy = response.clone();
                if ( isHighPriority( url ) )
                {
                  event.waitUntil(
                    saveToCache( sw_caches.static.name, request, copy )
                  );
                }
                else
                {
                  event.waitUntil(
                    saveToCache( sw_caches.other.name, request, copy )
                  );
                }
                return response;
              })
              // fallback to offline image
              .catch(
                respondWithServerOffline
              );
          }
        })
    );
  }

});
