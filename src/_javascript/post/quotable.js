// quotable.js
(function(document){
    'use strict';
    
    if ( ! ( 'querySelectorAll' in document ) ) { return; }

    var $quotes = document.querySelectorAll('[data-quotable]'),
        q = $quotes.length,
        $container,
        re_blocks = /^(blockquote|[uod]l|p|h[1-6])$/,
        re_containers = /^(body|main|section|article|aside)$/,
        re_headings = /^h[1-6]$/,
        $quote,
        quote,
        last,
        $template,
        $parent,
        $current_sibling,
        $previous_heading;

    if ( q )
    {
        $template = document.createElement('blockquote');
        $template.setAttribute('class', 'quotable');
        $template.setAttribute('aria-hidden', 'true');
        $template.appendChild( document.createElement('p') );

        while ( q-- )
        {
            $container = $quotes[q];
            $quote = $template.cloneNode( true );
            quote = $container.innerText.split(' ');
            last = quote.pop();
            $quote.querySelector('p').innerText = quote.join(' ') + '\xA0' + last;

            // make sure we’re at a block container
            while ( ! $container.nodeName.toLowerCase().match( re_blocks ) )
            {
                if ( !! $container.nodeName.toLowerCase().match( re_containers ) )
                {
                    break;
                }

                $container = $container.parentNode;
            }
            
            // if there is a previous sibling that is a heading,
            // drop the quote in after the second block element after it
            $parent = $container.parentNode;
            $current_sibling = $container.previousElementSibling;
            while ( $current_sibling )
            {
                if ( $current_sibling.nodeName.toLowerCase().match( re_headings ) )
                {
                    $previous_heading = $current_sibling;
                    break;
                }
                $current_sibling = $current_sibling.previousElementSibling;
            }
            if ( $previous_heading )
            {
                $current_sibling = $previous_heading.nextElementSibling.nextElementSibling;
                // no blockquotes next to blockquotes
                while ( $current_sibling.nodeName.toLowerCase() == 'blockquote' )
                {
                    $current_sibling = $current_sibling.nextElementSibling.nextElementSibling;
                }               
            }

            // insert
            if ( $current_sibling )
            {
                $parent.insertBefore( $quote, $current_sibling );
            }
            else
            {
                $parent.insertBefore( $quote, $container );
            }
        
        }
    }


}(document));