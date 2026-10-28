export function initialize(element, { signal }) {
	const dialog = element.closest("dialog");
	if (!dialog) throw new Error("The theme chooser must be inside a dialog.");
	element.addEventListener("theme-switcher:change", (event) => {
		if (event.detail.source === "user" && dialog.open) dialog.close();
	}, { signal });
}
