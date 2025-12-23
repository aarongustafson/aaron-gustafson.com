addEventListener("message", (messageEvent) => {
	if (messageEvent.data == "clean up") {
		for (let key in sw_caches) {
			if (sw_caches[key].limit !== undefined) {
				trimCache(sw_caches[key].name, sw_caches[key].limit);
			}
		}
	}
});

function trimCache(cache_name, limit) {
	caches.open(cache_name).then((cache) => {
		cache.keys().then((items) => {
			if (items.length > limit) {
				cache.delete(items[0]).then(trimCache(cache_name, limit)); // end delete
			} // end if
		}); // end keys
	}); // end open
}
