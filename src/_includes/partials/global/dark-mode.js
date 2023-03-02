{% set svg_color_toggle %}{{ "/src/static/i/icons/color-toggle.svg" | svgContents | safe }}{% endset %}
(function(window,document){

	var	COOKIE_NAME = 'darkmode',
			dark_mode = false,
			$html = document.documentElement,
			$toggle = document.createElement('button'),
			dark_label = "Switch to the dark theme",
			light_label = "Switch to the light theme";
	
	$toggle.id = "theme-switcher";
	$toggle.innerHTML = '{{ svg_color_toggle | safe }}';
	
	function disableDarkMode() {
		$html.classList.remove('dark-mode');
		$html.style.colorScheme = 'light';
		dark_mode = false,
		document.cookie = COOKIE_NAME + '=false; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT;';
		$toggle.ariaLabel = dark_label;
	}
	function enableDarkMode() {
		$html.classList.add('dark-mode');
		$html.style.colorScheme = 'dark';
		dark_mode = true,
		document.cookie = COOKIE_NAME + '=true; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT;';
		$toggle.ariaLabel = light_label;
	}

	if ( document.cookie.indexOf( COOKIE_NAME + '=true' ) > -1 ) {
		enableDarkMode();
	}
	else if ( document.cookie.indexOf( COOKIE_NAME + '=false' ) > -1 ) {
		disableDarkMode();
	}
	else {
		if ( window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ) {
			enableDarkMode();
		} else {
			disableDarkMode();
		}
	}

	window.addEventListener('DOMContentLoaded', function(){
		document.querySelector('[role=banner]').appendChild($toggle);
		$toggle.addEventListener('click', () => {
			if ( dark_mode )
			{
				disableDarkMode();
			} else {
				enableDarkMode();
			}
		});
	});

})(this,this.document);