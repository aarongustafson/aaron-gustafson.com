(function( window, document ){
    'use strict';

    if ( ! ( 'querySelectorAll' in document ) ) { return; }

    var s = document.createElement('script'),
        $webmentions_counter = document.querySelector( '.webmention-count' );

    // Add the webmentions count
    $webmentions_link.innerHTML = document.querySelectorAll( '.webmentions__item' ).length;

    // Preconnect to Disqus if possible
    if ( 'AG' in window &&
         'preconnect' in window.AG )
    {
        window.AG.preconnect( '//disqus.com/' );
        window.AG.preconnect( '//aarongustafson.disqus.com' );
        window.AG.preconnect( '//links.services.disqus.com/' );
        window.AG.preconnect( '//a.disquscdn.com' );
    }
    else
    {
        //console.log('No preconnect');
    }

    // Add the comment count
    s.async = true;
    s.type = 'text/javascript';
    s.src = '//aarongustafson.disqus.com/count.js';
    (document.head || document.body).appendChild(s);

}( this, this.document ));
(function( window, document ) {
    'use strict';

    var $s = document.createElement('script');
    $s.src = '//' + window.AG.disqus.shortname + '.disqus.com/' + window.AG.disqus.script;
    $s.setAttribute( 'data-timestamp', '' + new Date() );
    (document.head || document.body).appendChild( $s );
    $s = null;

}( this, this.document ));
// Add a comments message if offline
(function(){
    'use strict';

    if ( ! ( 'onLine' in window.navigator ) ){ return; }

    var offline = !window.navigator.onLine,
        $p,
        $comments;

    if ( offline )
    {
        $p = document.createElement('p');
        $p.innerText = 'Your internet connection is currently offline, so I can’t load in the comment thread from Disqus.';
        $comments = document.getElementById( 'disqus' );
        $comments.appendChild($p);

        $p = null;
        $comments = null;
    }

}());
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
/* ! Sharing popup */
(function( window, document ){
    'use strict';

    // Filter older browsers
    if ( ! ( 'querySelectorAll' in document ) )
    {
        return;
    }
    
    // event handler
    function click(e)
    {
        var target = e.target;

        // target must be an anchor and the inner width threshold must be met
        if ( e.target.nodeName.toLowerCase() == 'a' &&
             window.innerWidth >= threshold )
        {
            // prevent the default link click
            e.preventDefault();

            // open the link in a popup
            window.open( target.href, 'share-this', 'height=300,width=500,status=no,toolbar=no' );

            // return
            return false;
        }
    }

        // gather the links container
    var share_links = document.querySelectorAll('.entry__sharing'),
        // set the threshold width
        threshold = 640;

    // watcher
    if ( share_links.length > 0 )
    {
        share_links[0].addEventListener( 'click', click, false );
    }

}( this, this.document ));
// Social media avatars disappear on occasion.
// If they aren’t available, hide em.
(function( window ){
    'use strict';

    if ( 'addEventListener' in window )
    {
        window.addEventListener( 'load', checkImages, false );
    }

    function checkImages(){
        var images = document.getElementById('webmentions').getElementsByTagName('img'),
            i = images.length;
        while ( i-- )
        {
            if ( ! images[i].naturalWidth )
            {
                images[i].style.visibility = 'hidden';
            }
        }
        // release the DOM reference
        images = null;
    }

}( this ));
if ( 'speechSynthesis' in window )
{
	// Housekeeping
	window.addEventListener( 'beforeunload', function(){
		window.speechSynthesis.cancel();
	});

	function play() {
		if ( paused )
		{
			//console.log( 'resume', speech );
			window.speechSynthesis.resume();
		}
		else
		{
			//console.log( 'play', speech );
			window.speechSynthesis.speak( speech );
		}
		
		// reset the button
		//setTimeout(toggleButtons, 500);
	}

	function pause() {
		window.speechSynthesis.pause();
		paused = true;

		//setTimeout(toggleButtons, 500);
	}

	//function adjustSpeed()
	//{
	//	// cancel the original utterance
	//	//console.log('cancelling the original utterance');
	//	window.speechSynthesis.cancel();
	//
	//	// find the previous space
	//	//console.log( 'progress char', progress_index );
	//	var previous_space = speech.text.lastIndexOf( ' ', progress_index );
	//	//console.log( 'found a space at char', previous_space );
	//	
	//	// get the remains of the original string
	//	speech.text = speech.text.slice( previous_space );
	//	//console.log( 'new text', speech.text );
	//
	//	// Math to 1 decimal place
	//	speed = Math.round( $speed_value.value * 10 ) / 10;
	//
	//	// adjust the rate
	//	if ( speed > 10 )
	//	{
	//		speed = 10;
	//	}
	//	else if ( speed < 0.1 )
	//	{
	//		speed = 0.1;
	//	}
	//	speech.rate = speed;
	//
	//	// return to speaking
	//	// console.log( 'starting a new one', speech );
	//	window.speechSynthesis.speak( speech );
	//}

	//function toggleButtons() {
	//	if ( $play.disabled === false )
	//	{
	//		//$play.disabled = true;
	//		//$pause.disabled = false;
	//		//$speed_value.disabled = false;
	//	}
	//	else
	//	{
	//		//$play.disabled = false;
	//		//$pause.disabled = true;
	//		//$speed_value.disabled = true;
	//	}
	//}

	var speech = new SpeechSynthesisUtterance(),
		paused = false,
		text,
		progress_index = 0,
		$content = document.querySelector('main').cloneNode(true),
		$space = $content.querySelectorAll('pre'),
		$pause_before = $content.querySelectorAll('h2, h3, h4, h5, h6, p, li, dt, blockquote, pre, figure, footer'),
		$skip = $content.querySelectorAll('.anchorable__anchor, aside, .dont-read'),
		$intro = document.createElement('dt'),
		$controls = document.createElement('dd'),
		$button = document.createElement('button'),
		$buttons = document.createElement('p'),
		$play,
		$pause,
		default_speed = 1.4,
		//$speed = $buttons.cloneNode(true),
		//$speed_label = document.createElement('label'),
		//$speed_value = document.createElement('input'),
		$caveat = $buttons.cloneNode(true);
	
	// Don’t read
	Array.prototype.forEach.call( $skip, function( $el ){
		$el.innerHTML = '';
	});
	
	// spacing out content
	Array.prototype.forEach.call( $space, function( $el ){
		$el.innerHTML = ' ' + $el.innerHTML.replace(/[\r\n\t]/g, ' ') + ' ';
	});
	
	// Synthetic Pauses
	Array.prototype.forEach.call( $pause_before, function( $el ){
		$el.innerHTML = ' , ' + $el.innerHTML;
	});

	// capture character index as we move.
	speech.onboundary = function( e ) {
		if ( e.name == 'word' )
		{
			progress_index = e.charIndex;
		}
	};

	// clear the queue when done
	speech.onend = function( e ) {
		window.speechSynthesis.cancel();
	};

	text = $content.textContent;
	speech.text = text;
	
	//----------------------
	// Build the GUI
	// ---------------------
	
	$intro.innerHTML = 'Would you prefer to have this post read to you?';
	
	$controls.classList.add('media-controls');
	
	// Buttons
	$buttons.classList.add('media-controls__buttons');
	$button.classList.add('media-controls__button');
	// Default active buttons
	$play = $button.cloneNode('true');
	$play.classList.add('media-controls__button--play');
	$play.setAttribute( 'aria-label', 'Play' );
	$play.addEventListener( 'click', play, false );
	//$play.addEventListener( 'touchend', play, false );
	$buttons.appendChild($play);
	// Default disabled buttons
	//$button.disabled = true;
	$pause = $button.cloneNode('true');
	$pause.classList.add('media-controls__button--pause');
	$pause.setAttribute( 'aria-label', 'Pause' );
	$pause.addEventListener( 'click', pause, false );
	//$pause.addEventListener( 'touchend', pause, false );
	$buttons.appendChild($pause);
	$controls.appendChild($buttons);

	// Speed
	speech.rate = default_speed;
	//$speed.classList.add('media-controls__speed');
	//$speed_label.innerText = 'Speed';
	//$speed_label.htmlFor = 'speed_value';
	//$speed.appendChild( $speed_label );
	//$speed_value.type = 'number';
	//$speed_value.id = 'speed_value';
	////$speed_value.disabled = true;
	//$speed_value.min = '0.1';
	//$speed_value.max = '10';
	//$speed_value.step = '0.1';
	//$speed_value.value = default_speed;
	//$speed_value.addEventListener( 'change', adjustSpeed, false );
	////$speed_value.addEventListener( 'blur', adjustSpeed, false );
	////$speed_value.addEventListener( 'keyup', adjustSpeed, false );
	////$speed_value.addEventListener( 'click', adjustSpeed, false );
	////$speed_value.addEventListener( 'touchend', adjustSpeed, false );
	//$speed.appendChild( $speed_value );
	//$controls.appendChild($speed);

	// Caveat
	$caveat.innerHTML = '<small>SpeechSynthesis is still experimental. This could be buggy</small>';
	$controls.appendChild($caveat);

	document.querySelector('.entry__meta').appendChild($intro);
	document.querySelector('.entry__meta').appendChild($controls);
}