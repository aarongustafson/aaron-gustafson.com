/**
 *  Lazy Video Loading JavaScript
 */

(function (window, document) {
	"use strict";

	if (!("querySelectorAll" in document) || !("URL" in window)) {
		return;
	}

	var $video_links = document.querySelectorAll("a[data-lazy-video-src]"),
		link_count = $video_links.length,
		$iframe = document.createElement("iframe"),
		allowed_hosts = [
			"player.vimeo.com",
			"www.youtube.com",
			"www.youtube-nocookie.com",
		];

	if (link_count > 0) {
		$iframe.className = "video-embed__video";
		$iframe.setAttribute("frameborder", "0");
		$iframe.setAttribute("allowfullscreen", "");

		while (link_count--) {
			var video_url = getVideoUrl($video_links[link_count]);
			if (!video_url) {
				continue;
			}
			$video_links[link_count].setAttribute("data-lazy-video-src", video_url);

			// should make loading faster
			if ("AG" in window && "preconnect" in window.AG) {
				window.AG.preconnect(video_url);
			}

			// actual event handlers
			$video_links[link_count].addEventListener("click", start, false);
			$video_links[link_count].addEventListener("touchdown", start, false);
		}
	}

	$video_links = null;

	function getVideoUrl($link) {
		try {
			var url = new window.URL(
				$link.getAttribute("data-lazy-video-src"),
				window.location.href,
			);
			if (
				url.protocol === "https:" &&
				allowed_hosts.indexOf(url.hostname) > -1
			) {
				return url.href;
			}
		} catch (error) {
			return null;
		}
		return null;
	}

	function start(event) {
		event.preventDefault();

		var $link = event.currentTarget,
			$video_embed = $iframe.cloneNode(true),
			video_url = getVideoUrl($link);

		if (!video_url) {
			return false;
		}
		$video_embed.setAttribute("src", video_url);

		$link.parentNode.replaceChild($video_embed, $link);

		$link = null;
		$video_embed = null;

		return false;
	}
})(this, this.document);
