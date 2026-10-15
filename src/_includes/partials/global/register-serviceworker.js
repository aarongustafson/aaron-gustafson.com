(function (window, navigator, document) {
	// Register the service worker
	if ("serviceWorker" in navigator) {
		window.sw_version = "v{{ sw.version }}";
		var hadController = Boolean(navigator.serviceWorker.controller);
		var refreshRequested = false;
		var updateBanner;
		var updateButton;
		var waitingWorker;
		var observedInstallingWorker;

		function showUpdateBanner(worker) {
			waitingWorker = worker || waitingWorker;

			if (!updateBanner) {
				updateBanner = document.createElement("announcement-banner");
				updateBanner.setAttribute("data-service-worker-update", "");
				updateBanner.setAttribute("hidden", "");
				updateBanner.innerHTML =
					'<div class="alert" role="status" aria-label="Site update">' +
					"<strong>A new version of this site is ready.</strong> " +
					'<button type="button" data-service-worker-refresh>Refresh now</button>' +
					"</div>";
				document.body.insertBefore(updateBanner, document.body.firstChild);

				updateButton = updateBanner.querySelector(
					"[data-service-worker-refresh]",
				);
				updateButton.addEventListener("click", function () {
					refreshRequested = true;
					updateButton.disabled = true;

					if (waitingWorker && waitingWorker.state === "installed") {
						waitingWorker.postMessage("skip waiting");
					} else {
						window.location.reload();
					}
				});
			}

			updateBanner.removeAttribute("hidden");
			// Override an older stylesheet that hid every announcement banner.
			updateBanner.style.display = "block";
		}

		function watchInstallingWorker(installingWorker) {
			if (
				!installingWorker ||
				installingWorker === observedInstallingWorker
			) {
				return;
			}
			observedInstallingWorker = installingWorker;

			if (
				installingWorker.state === "installed" &&
				navigator.serviceWorker.controller
			) {
				showUpdateBanner(installingWorker);
				return;
			}

			installingWorker.addEventListener("statechange", function () {
				if (
					installingWorker.state === "installed" &&
					navigator.serviceWorker.controller
				) {
					showUpdateBanner(installingWorker);
				}
			});
		}

		function watchForUpdates(registration) {
			if (registration.waiting && navigator.serviceWorker.controller) {
				showUpdateBanner(registration.waiting);
			}

			watchInstallingWorker(registration.installing);

			registration.addEventListener("updatefound", function () {
				watchInstallingWorker(registration.installing);
			});
		}

		navigator.serviceWorker.addEventListener("controllerchange", function () {
			if (!hadController) {
				hadController = true;
				return;
			}

			if (refreshRequested) {
				window.location.reload();
			} else {
				showUpdateBanner();
			}
		});

		window.addEventListener("load", function () {
			navigator.serviceWorker
				.register("/serviceworker.min.js", { updateViaCache: "none" })
				.then(watchForUpdates)
				.catch(function (error) {
					console.error("Service worker registration failed:", error);
				});

			// Store page names & descriptions
			if (!/\/notebook\/.+/.test(window.location)) {
				var data = {
					title: document
						.querySelector('[property="og:title"]')
						.getAttribute("content"),
					description: document
						.querySelector('meta[name="description"]')
						.getAttribute("content"),
				};
				localStorage.setItem(location, JSON.stringify(data));
			}
		});

		if (navigator.serviceWorker.controller) {
			window.addEventListener("load", function () {
				navigator.serviceWorker.controller.postMessage("clean up");
			});
		}
	}
})(this, this.navigator, this.document);
