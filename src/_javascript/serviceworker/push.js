self.addEventListener("push", function (event) {
	var data = event.data.json();

	// console.log( "WORKER: push event inbound.", data );

	// Pass to the client
	clients.matchAll().then((all) =>
		all.map((client) => {
			console.log("client: ", client);
			client.postMessage(JSON.stringify(data));
		}),
	);
});
