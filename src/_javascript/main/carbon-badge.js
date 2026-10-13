(function (window, document) {
	"use strict";

	var badge = document.getElementById("wcb");
	if (!badge || !("fetch" in window)) {
		return;
	}

	var target = badge.getAttribute("data-carbon-target"),
		encodedTarget = encodeURIComponent(target),
		cacheKey = "wcb_" + encodedTarget,
		cacheMaxAge = 86400000,
		measurement,
		comparison;

	badge.innerHTML =
		'<div id="wcb_p">' +
		'<span id="wcb_g">Measuring CO<sub>2</sub>&hellip;</span>' +
		'<a id="wcb_a" target="_blank" rel="noopener" href="https://websitecarbon.com">Website Carbon</a>' +
		"</div>" +
		'<span id="wcb_2">&nbsp;</span>';
	measurement = document.getElementById("wcb_g");
	comparison = document.getElementById("wcb_2");

	function renderResult(result) {
		if (
			!result ||
			typeof result.c !== "number" ||
			typeof result.p !== "number"
		) {
			throw new TypeError("Website Carbon returned an invalid badge response");
		}

		measurement.innerHTML = result.c + "g of CO<sub>2</sub>/view";
		comparison.textContent = "Cleaner than " + result.p + "% of pages tested";
	}

	function requestResult(showResult) {
		fetch("https://api.websitecarbon.com/b?url=" + encodedTarget)
			.then(function (response) {
				if (!response.ok) {
					throw new Error(
						"Website Carbon request failed with status " + response.status,
					);
				}
				return response.json();
			})
			.then(function (result) {
				if (showResult) {
					renderResult(result);
				}
				result.t = Date.now();
				window.localStorage.setItem(cacheKey, JSON.stringify(result));
			})
			.catch(function (error) {
				console.error(error);
				if (showResult) {
					badge.remove();
				}
			});
	}

	var cachedResult = window.localStorage.getItem(cacheKey);
	if (cachedResult) {
		try {
			cachedResult = JSON.parse(cachedResult);
			renderResult(cachedResult);
			if (Date.now() - cachedResult.t > cacheMaxAge) {
				requestResult(false);
			}
		} catch (error) {
			console.error(error);
			window.localStorage.removeItem(cacheKey);
			requestResult(true);
		}
	} else {
		requestResult(true);
	}
})(this, this.document);
