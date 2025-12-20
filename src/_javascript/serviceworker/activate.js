self.addEventListener("activate", (event) => {
	// console.log('WORKER: activate event in progress.');

	// clean up stale caches
	event.waitUntil(
		caches
			.keys()
			.then((keys) => {
				return Promise.all(
					keys
						.filter((key) => {
							return !key.startsWith(version);
						})
						.map((key) => {
							return caches.delete(key);
						}),
				); // end promise
			}) // end then
			.then(() => clients.claim()),
	); // end event
});
