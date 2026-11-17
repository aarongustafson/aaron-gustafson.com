import "../img-alt-overlay/define.js";
import "../print-link-list/define.js";

document.querySelectorAll("figure img[alt]").forEach((image) => {
	if (!image.alt.trim() || image.closest("img-alt-overlay")) {
		return;
	}

	const figure = image.closest("figure");
	let content = image;
	for (
		let parent = image.parentElement;
		parent !== figure;
		parent = parent.parentElement
	) {
		if (parent.matches("a, picture")) {
			content = parent;
		}
	}

	if (
		content.querySelectorAll("img").length > 1 ||
		content.parentElement.closest("a, button, label")
	) {
		console.warn(
			"<img-alt-overlay> - Cannot wrap an image inside a shared image link or interactive control.",
			image,
		);
		return;
	}

	const overlay = document.createElement("img-alt-overlay");
	overlay.setAttribute("button-label", "View Alt");
	overlay.setAttribute("close-label", "Dismiss Alt");
	if (window.getComputedStyle(figure).position === "static") {
		figure.style.position = "relative";
	}
	content.before(overlay);
	overlay.append(content);
});
