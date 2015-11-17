(function(window,document){
    'use strict';

    if ( ! ( 'querySelector' in document ) ||
         ! ( 'classList' in document.body ) ){
        return;
    }
    
    var $search_link = document.querySelector( '.main-navigation__link--search' ),
        $search_form = document.querySelector( '.form--search' );
    
    $search_form.classList.add( 'toggleable' );

    $search_link.addEventListener( 'click', openSearch, false );
    $search_link.addEventListener( 'touchdown', openSearch, false );
    
    function openSearch( e ) {
        e.preventDefault();
        $search_form.classList.add( 'toggleable--open' );
        $search_form.querySelector( '[type=search]' ).focus();
    }
    
}(this,this.document));