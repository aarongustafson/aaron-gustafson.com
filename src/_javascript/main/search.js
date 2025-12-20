(function (window, document) {
	"use strict";

	if (!("querySelector" in document) || !("classList" in document.body)) {
		return;
	}

	var $search_link = document.querySelector(".main-navigation__link--search"),
		$search_form = document.querySelector("#search"),
		open = window.location.hash === "#search";

	//$search_form.classList.add( "toggleable" );
	$search_form.addEventListener("click", closeSearch, false);
	$search_form.addEventListener("touchdown", closeSearch, false);

	$search_link.addEventListener("click", openSearch, false);
	$search_link.addEventListener("touchdown", openSearch, false);

	// handle back
	window.addEventListener("pageshow", function () {
		open = window.location.hash == "#search";
	});

	function openSearch(e) {
		if (open) {
			return false;
		}
		open = true;
		console.log("open");
		e.preventDefault();
		$search_form.showModal();
		//$search_form.querySelector( "[type=search]" ).focus();
	}

	function closeSearch(e) {
		if (!open) {
			return false;
		}
		open = false;
		console.log("close");

		var target_tag = e.target.nodeName.toLowerCase();
		if (target_tag == "button" || target_tag == "input") {
			return false;
		}

		e.preventDefault();
		window.location.hash = "#";
		$search_form.close();
		//$search_form.classList.remove( "toggleable--open" );
		//$search_link.focus();
	}
})(this, this.document);
