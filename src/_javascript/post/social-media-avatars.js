// Social media avatars disappear on occasion.
// If they aren’t available, hide em.
(function (window) {
	"use strict";

	if ("addEventListener" in window && document.getElementById("webmentions")) {
		window.addEventListener("load", init, false);
	}

	function init() {
		checkImages();
		setupObserver();
	}

	function setupObserver() {
		var container = document.getElementById("webmentions");
		if (!container || !("MutationObserver" in window)) {
			return;
		}
		var observer = new MutationObserver(function (mutations) {
			var i = mutations.length;
			while (i--) {
				var addedNodes = mutations[i].addedNodes,
					j = addedNodes.length;
				while (j--) {
					if (addedNodes[j].querySelectorAll) {
						var imgs = addedNodes[j].querySelectorAll("img");
						var k = imgs.length;
						while (k--) {
							guardImage(imgs[k]);
						}
					}
				}
			}
		});
		observer.observe(container, { childList: true, subtree: true });
	}

	function applyFallback(image) {
		if (image.dataset.avatarFallbackApplied === "true") {
			return;
		}
		image.dataset.avatarFallbackApplied = "true";
		image.src = "/i/fallbacks/avatar.svg";
	}

	function guardImage(image) {
		if (!image || image.dataset.avatarGuarded === "true") {
			return;
		}
		image.dataset.avatarGuarded = "true";

		if (image.complete) {
			if (image.naturalWidth === 0) {
				applyFallback(image);
			}
			return;
		}

		image.addEventListener(
			"error",
			function () {
				applyFallback(image);
			},
			{ once: true },
		);
	}

	function checkImages() {
		var container = document.getElementById("webmentions");
		if (!container) {
			return;
		}
		var images = container.getElementsByTagName("img"),
			i = images.length;
		while (i--) {
			guardImage(images[i]);
		}
		images = null;
	}
})(this);
