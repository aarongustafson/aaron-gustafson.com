(function(doc){
  if ( typeof HTMLDialogElement !== 'function' )
  {
    var polyfill = "https://cdn.jsdelivr.net/npm/a11y-dialog@7/dist/a11y-dialog.min.js",
        script = doc.createElement('script');
    script.async = true;
    script.src = polyfill;
    
    script.onload = function() {
      var $els = doc.querySelectorAll("dialog"),
          i = $els.length;
      while ( i-- ) {
        new A11yDialog($els[i]);
      }
    };
    doc.body.appendChild(script);
  }
}(document));
