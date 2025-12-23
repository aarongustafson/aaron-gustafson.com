// Social media avatars disappear on occasion.
// If they aren’t available, hide em.
(function (window) {
	"use strict";

	if ("addEventListener" in window && document.getElementById("webmentions")) {
		window.addEventListener("load", init, false);
	}

	function logDebug() {
		if (typeof console !== "undefined" && console.debug) {
			console.debug.apply(console, arguments);
		}
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
		logDebug("[Avatars] Applying fallback avatar", {
			src: image.currentSrc || image.src,
			target: "/i/fallbacks/avatar.svg",
		});
		image.src = "/i/fallbacks/avatar.svg";
	}

	function guardImage(image) {
		if (!image || image.dataset.avatarGuarded === "true") {
			return;
		}
		image.dataset.avatarGuarded = "true";
		logDebug("[Avatars] Guarding image", {
			src: image.currentSrc || image.src,
			data: image.dataset,
		});

		if (image.complete) {
			if (image.naturalWidth === 0) {
				logDebug("[Avatars] Image was complete with naturalWidth 0", {
					src: image.currentSrc || image.src,
				});
				applyFallback(image);
			}
			return;
		}

		image.addEventListener(
			"error",
			function () {
				logDebug("[Avatars] Image error triggered fallback", {
					src: image.currentSrc || image.src,
				});
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
