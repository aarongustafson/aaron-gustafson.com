(function (window, document) {
	"use strict";

	if (!("AG" in window)) {
		window.AG = {};
	}

	var preconnected = {},
		prefetched = {},
		$head = document.head,
		$link = document.createElement("link");

	// Preconnect (from the AMP project)
	// https://github.com/ampproject/amphtml/
	window.AG.preconnect = function (url) {
		//console.log( 'preconnecting', url );

		// validate the URL
		var domain = getDomainFromURL(url);
		if (!domain) {
			return;
		}

		// No need to run this twice
		if (preconnected[domain]) {
			return;
		}
		preconnected[domain] = true;

		var $dns = $link.cloneNode(true),
			$preconnect = $link.cloneNode(true);

		$dns.setAttribute("rel", "dns-prefetch");
		$dns.setAttribute("href", domain);
		$dns.setAttribute("crossorigin", "");

		$preconnect.setAttribute("rel", "preconnect");
		$preconnect.setAttribute("href", domain);
		$preconnect.setAttribute("crossorigin", "");

		$head.appendChild($dns);
		$head.appendChild($preconnect);

		// Cleanup
		setTimeout(function () {
			if ($dns.parentNode) {
				$dns.parentNode.removeChild($dns);
			}
			if ($preconnect.parentNode) {
				$preconnect.parentNode.removeChild($preconnect);
			}
			$dns = null;
			$preconnect = null;
		}, 10000);
	};

	window.AG.prefetch = function (url) {
		//console.log( 'prefetching', url );

		// validate the URL
		url = parseURL(url);
		if (!url) {
			return;
		}

		// No need to run this twice
		if (prefetched[url]) {
			return;
		}
		prefetched[url] = true;

		var $prefetch = $link.cloneNode(true);
		$prefetch.setAttribute("rel", "prefetch");
		$prefetch.setAttribute("href", url);
		$prefetch.setAttribute("crossorigin", "");
		$head.appendChild($prefetch);

		// As opposed to preconnect we do not clean this tag up, because there is
		// no expectation as to it having an immediate effect.
	};

	function parseURL(url) {
		var $parser = document.createElement("a");
		$parser.href = url;

		if ($parser.protocol) {
			url =
				$parser.protocol +
				"//" +
				$parser.host +
				$parser.pathname +
				$parser.search +
				$parser.hash;
		} else {
			url = false;
		}

		// release the RAM
		$parser = null;

		// return the URL
		return url;
	}
	function getDomainFromURL(url) {
		var $parser = document.createElement("a"),
			domain;

		$parser.href = url;

		if ($parser.protocol) {
			domain = $parser.protocol + "//" + $parser.host;
		} else {
			domain = false;
		}

		// release the RAM
		$parser = null;

		// return the URL
		return domain;
	}
})(this, this.document);
