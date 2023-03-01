// tabbable-code.js
(function(window, document){
	'use strict';
	
	if ( ! ( 'querySelectorAll' in document ) ) { return; }

	var $code_blocks = document.querySelectorAll('pre[class^=language-]');

	function overflows($el) {
		return $el.scrollHeight > $el.clientHeight || $el.scrollWidth > $el.clientWidth;
	}

	function indexOverflows() {
		$code_blocks.forEach(function($pre){
			if ( overflows($pre) )
			{
				$pre.setAttribute('tabindex','0');
			}
			else
			{
				$pre.removeAttribute('tabindex');
			}
		});
	}

	if ( $code_blocks.length )
	{
		indexOverflows();
		window.addEventListener('resize',indexOverflows,false);
	}

}(this, this.document));