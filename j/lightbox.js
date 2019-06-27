(function(document){

  if ( !( "querySelector" in document ) ||
       !( "closest" in document.body ) ){ return; }
  
  polyfill();

  var built = false,
      enabled = false,
      $triggering_element,
      $lightbox = document.getElementById("lightbox"),
      $img = $lightbox.querySelector(".lightbox__image"),
      $title = $lightbox.querySelector(".lightbox__caption"),
      $prev = $lightbox.querySelector("button[class$=prev]"),
      $next = $lightbox.querySelector("button[class$=next]"),
      $close = $lightbox.querySelector("button[class$=close]"),
      gallery = [],
      final_item,
      current_position = 0,
      item_selector = "[data-lightbox-item]",
      fade_class = "lightbox--fade",
      fade_duration = 500,
      img_prefix = "https://res.cloudinary.com/aarongustafson/image/fetch/c_fill,f_auto,q_auto,w_1080/";


  window.watchResize(function(){
    var MQ = window.getActiveMQ(),
        show = ( MQ == "medium" || MQ == "full" );
    if ( show ) {
      if ( ! built )
      {
        setupGallery();
        built = true;
      }

      // event listeners
      $prev.addEventListener("click", prev, false);
      $next.addEventListener("click", next, false);
      $close.addEventListener("click", close, false);

      enabled = true;
    }
    else if ( ! show && enabled )
    {
      // event listeners
      $prev.removeEventListener("click", prev, false);
      $next.removeEventListener("click", next, false);
      $close.removeEventListener("click", close, false);

      enabled = false;
    }
  });
  

  function setupGallery()
  {
    var $items = document.querySelectorAll( item_selector ),
        i = $items.length;
    
    final_item = $items.length - 1;
    
    while ( i-- )
    {
      addToGallery( $items[i] );
      assignEvents( $items[i] );
      setIndex( $items[i], i );
    }
  }
  function addToGallery( $item )
  {
    gallery.unshift({
      img: $item.querySelector("a").href,
      title: $item.querySelector("figcaption").innerHTML
    });
  }
  function assignEvents( $item )
  {
    var $link = $item.querySelector("a");
    $link.addEventListener("click", open, false);
  }
  function setIndex( $element, i )
  {
    $element.dataset.lightboxIndex = i;
  }
  function updateLightbox()
  {
    fadeIn(function(){
      $img.style.backgroundImage = "url(" + img_prefix + gallery[current_position].img + ")";
      $title.innerHTML = gallery[i].title;
    });
  }
  function fadeOut( callback )
  {
    $lightbox.classList.add( fade_class );
    if ( typeof callback  == "function" )
    {
      setTimeout(callback, fade_duration );
    }
  }
  function fadeIn( callback )
  {
    setTimeout(function(){
      if ( typeof callback  == "function" )
      {
        callback();
      }
      $lightbox.classList.remove( fade_class );
    }, fade_duration );
  }
  function open( e )
  {
    if ( ! enabled ) { return; }

    e.preventDefault();
    $triggering_element = e.target;
    current_position = $triggering_element.closest( item_selector ).dataset.lightboxIndex;
    
    fadeOut(function(){
      updateLightbox();
      $lightbox.showModal();
      fadeIn(function(){
        $lightbox.focus();
      });
    });
  }
  function next()
  {
    current_position++;
    if ( current_position > final_item )
    {
      current_position = 0;
    }
    move();
  }
  function prev()
  {
    current_position--;
    if ( current_position < 0 )
    {
      current_position = final_item;
    }
    move();
  }
  function move()
  {
    fadeOut(function(){
      updateLightbox();
    });
  }
  function close()
  {
    fadeOut(function(){
      current_index = null;
      $lightbox.close();
      updateFocus( $triggering_element );
    });
  }
  function updateFocus( $element )
  {
    $element.focus();
  }

  function polyfill(){

    var $dialog = document.createElement("dialog"),
        $polyfill_js = document.createElement("script"),
        $polyfill_css = document.createElement("link");
    
        if( {}.toString.call($dialog) === '[object HTMLUnknownElement]' )
    {
      $polyfill_js.src = "/j/dialog-polyfill.js";
      $polyfill_js.async = true;
      document.head.appendChild($polyfill_js);
      $polyfill_css.rel = "stylesheet";
      $polyfill_css.href = "/c/dialog-polyfill.css";
      document.head.appendChild($polyfill_css);
    }
  
  }
}(this.document));
