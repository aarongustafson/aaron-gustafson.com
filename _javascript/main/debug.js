(function(qs){
    if ( qs.indexOf('debug=1') > -1 )
    {
        var styles = document.querySelectorAll('link[rel=stylesheet]'),
            len = styles.length;
        while ( len-- )
        {
            styles[len].href = styles[len].href.replace( '.min', '' ); 
        }
    }    
}(window.location.search));