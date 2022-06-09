const version = "v9:", // be sure to update ../main/register-serviceworker.js too

      // Stuff to load on install
      fallback_avatar = "/i/fallbacks/avatar.svg",
      fallback_image = "/i/fallbacks/image.svg",
      offline_image = "/i/fallbacks/offline.svg",
      offline_page = "/offline/",
      preinstall = [
        // images
        "/favicon.png",
        fallback_avatar,
        fallback_image,
        offline_image,
        // CSS
        "/c/default.min.css",
        "/c/advanced.min.css",
        // JavaScript
        "/j/main.min.js",
        // Offline
        offline_page
      ],

      // caches
      sw_caches = {
        static: {
          name: `${version}static`
        },
        images: {
          name: `${version}images`,
          limit: 75
        },
        pages: {
          name: `${version}pages`,
          limit: 5
        },
        posts: {
          name: `${version}posts`,
          limit: 10,
          path: /\/notebook\/.+/
        },
        other: {
          name: `${version}other`,
          limit: 50
        }
      },

      // Never cache
      ignore = [
        'www.google-analytics.com/r/collect',
        '.ogg',
        '.mp3',
        '.mp4',
        '.ogv',
        '.webm',
        'chrome-extension'
      ],

      // How to decide what gets cached and
      // what might not be left out
      high_priority = [
        /aaron\-gustafson\.com/,
        /adaptivewebdesign\.info/
      ],

      avatars = /webmention\.io/,
      
      fetch_config = {
        images: {
          mode: 'no-cors'
        }
      };

let slow_connection = false,
save_data;

if ( 'connection' in navigator )
{
  slow_connection = ( navigator.connection.downlink < .5 );
  save_data = navigator.connection.saveData;
}