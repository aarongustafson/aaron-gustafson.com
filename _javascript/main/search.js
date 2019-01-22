(function(window,document){

  "use strict";

  if ( !( "querySelector" in document ) ||
       !( "classList" in document.body ) ){
    return;
  }

  var $search_link = document.querySelector( ".main-navigation__link--search" ),
      $search_form = document.querySelector( ".form--search" ),
      open = ( window.location.hash === "#search" );

  $search_form.classList.add( "toggleable" );
  $search_form.addEventListener( "click", closeSearch, false );
  $search_form.addEventListener( "touchdown", closeSearch, false );

  $search_link.addEventListener( "click", openSearch, false );
  $search_link.addEventListener( "touchdown", openSearch, false );

  // handle back
  window.addEventListener("pageshow", function(event) {
    open = ( window.location.hash == "#search" );
  });

  function openSearch( e ) {
    if ( open ) { return false; }
    open = true;

    e.preventDefault();
    $search_form.classList.add( "toggleable--open" );
    $search_form.querySelector( "[type=search]" ).focus();
  }

  function closeSearch( e ) {
    if ( ! open ) { return false; }
    open = false;

    var target_tag = e.target.nodeName.toLowerCase();
    if ( target_tag == "button" ||
    target_tag == "input" ) {
      return false;
    } 

    e.preventDefault();
    window.location.hash = "#";
    $search_form.classList.remove( "toggleable--open" );
    $search_link.focus();
  }

}(this,this.document));