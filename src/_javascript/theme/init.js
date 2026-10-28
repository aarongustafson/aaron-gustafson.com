async function initializeThemeDialog() {
	const opener = document.getElementById("theme-switcher");
	const dialog = document.getElementById("theme-dialog");
	const switcher = dialog.querySelector("theme-switcher");
	if (!window.customElements || typeof dialog.showModal !== "function") return;

	// Preserve the bootstrap's legacy-cookie choice even if storage is blocked.
	switcher.setAttribute("value", document.documentElement.dataset.theme);
	await import("@aarongustafson/theme-switcher/define.js");
	await switcher.ready;

	if (!("commandForElement" in HTMLButtonElement.prototype)) {
		opener.addEventListener("click", () => dialog.showModal());
		dialog.querySelector('[command="close"]').addEventListener("click", () => dialog.close());
	}
	dialog.addEventListener("close", () => opener.focus());
	opener.hidden = false;
}

initializeThemeDialog().catch((error) => {
	console.error("Could not initialize the theme chooser.", error);
});
