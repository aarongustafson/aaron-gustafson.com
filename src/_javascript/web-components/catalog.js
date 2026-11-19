export function initialize(gate, { signal }) {
	const search = document.querySelector("[data-web-component-search]");
	const category = document.querySelector("[data-web-component-category]");
	const list = document.querySelector("[data-web-component-list]");
	const status = document.querySelector("[data-web-component-status]");
	const controls = document.querySelector(".web-components__controls");
	const reset = document.querySelector("[data-web-component-reset]");

	if (!search || !category || !list || !status || !controls) return;

	const items = [...list.querySelectorAll("[data-web-component]")];
	controls.hidden = false;
	if (reset) reset.disabled = false;

	function updateList() {
		const query = search.value.trim().toLowerCase();
		const selectedCategory = category.value;
		let visible = 0;

		for (const item of items) {
			const matchesQuery = !query ||
				item.dataset.search.toLowerCase().includes(query);
			const matchesCategory = !selectedCategory ||
				item.dataset.category === selectedCategory;
			const show = matchesQuery && matchesCategory;

			item.hidden = !show;
			if (show) visible++;
		}

		status.textContent = visible === items.length
			? `${visible} ${visible === 1 ? "component" : "components"}`
			: `${visible} of ${items.length} components`;
	}

	search.addEventListener("input", updateList, { signal });
	category.addEventListener("change", updateList, { signal });
	if (reset) {
		reset.addEventListener("click", () => {
			search.value = "";
			category.value = "";
			search.focus();
			updateList();
		}, { signal });
	}

	updateList();
}
