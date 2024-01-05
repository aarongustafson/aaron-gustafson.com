;(function(){

	function toggle($figure) {
		$figure.classList.toggle('show-alt');
	
		var showing = $figure.classList.contains('show-alt')
				$panel = $figure.querySelector('.alt-panel');
		
		$figure.querySelector('button.alt')
					 .innerText = showing ? 'Dismiss Alt' : 'View Alt';
		
		$panel.hidden = ! showing;
	}

	function establishPositioningContext( $el ) {
		if ( window.getComputedStyle( $el ).position === "static" ) {
			$el.style.position = "relative";
		}
	}

	var $alt_button = document.createElement('button'),
			$alt_panel = document.createElement('div'),
			$imgs = document.querySelectorAll('figure img[alt]:not([alt=""])'),
			$style = document.createElement('style');

	$style.innerText = 'button.alt { margin: 0; position: absolute; inset: 10px 10px auto auto; z-index: 1; } \
	.show-alt .alt-panel { top: 50%; transform: translateY(-50%); left: 0; right: 0; position: absolute; background: #000; color: #fff; padding: 25px; }';
	document.head.appendChild( $style );

	$alt_button.classList.add('alt');
	$alt_button.innerText = "View Alt";
	$alt_panel.classList.add('alt-panel');
	$alt_panel.hidden = true;

	$imgs.forEach(function($img){

		var $figure = $img.parentNode,
				$btn = $alt_button.cloneNode(true),
				$panel = $alt_panel.cloneNode(true),
				$fragment = document.createDocumentFragment();

		while ( $figure.nodeName.toLowerCase() != 'figure' ) {
			$figure = $figure.parentNode;
		}
		establishPositioningContext( $figure );
		$btn.figure = $figure;

		$btn.addEventListener( 'click', function(e){
			console.log( 'toggling', e.target.figure );
			toggle( e.target.figure );
		});

		$panel.innerText = $img.getAttribute('alt');

		$fragment.appendChild($btn);
		$fragment.appendChild($panel);

		$figure.appendChild($fragment);

	});

})();