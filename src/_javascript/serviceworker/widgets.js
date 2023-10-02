// Widgets are still experimental
// More: https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/PWAWidgets/README.md

const periodicSync = self.registration.periodicSync;
var widget_templates = {};

async function registerPeriodicSync( widget )
{
	console.log( "should we register a periodic sync?", "update" in widget.definition );
	// if the widget is set up to auto-update…
	if ( "update" in widget.definition ) {
		registration.periodicSync.getTags()
			.then( tags => {
				// only one registration per tag
				if ( ! tags.includes( widget.definition.tag ) ) {
					console.log( `registering a periodic sync for ${widget.definition.tag}` );
					periodicSync.register( widget.definition.tag, {
							minInterval: widget.definition.update
					});
				}
			});
	}
	return;
}

async function  unregisterPeriodicSync( widget )
{
	// clean up periodic sync?
	if ( widget.instances.length === 1 &&
			 "update" in widget.definition )
	{
		console.log( `cleaning up periodic sync for ${widget.definition.tag}` );
		periodicSync.unregister( widget.definition.tag );
	}
	return;
}

async function updateWidgets( host_id )
{
	console.log( `Updating all widgets in host ${host_id}`);
	const config = host_id ? { hostId: host_id }
												 : { installed: true };
	
	let queue = [];
	await widgets.matchAll( config )
		.then( async widgetList => {
			for (let i = 0; i < widgetList.length; i++) {
				queue.push(updateWidget( widgetList[i] ));
			}
		});
	await Promise.all(queue);
	return;
}

async function getTemplate( template_url )
{
	console.log( `Getting template at ${template_url}` );
	let template = "";
	if ( template_url in widget_templates )
	{
		console.log( "We have it in the cache" );
		template = widget_templates[ template_url ];
	}
	else
	{
		console.log( "We need to fetch it" );
		template = await ( await fetch( template_url ) ).text();
		widget_templates[ template_url ] = template;
	}

	return template;
}

async function initAllWidgets( widget )
{
	if ( ! self.widgets )
	{
		return;
	}

	const template_url = "/w/waiting.ac.json";
	const template = await getTemplate( template_url );
	const data = "{}";
	const all_widgets = await self.widgets.matchAll({
		installable: true
	});
	
	for ( widget of all_widgets ) {
		console.log( `Updating ${widget.definition.tag} with payload`, { template, data } );
		await self.widgets.updateByTag( widget.definition.tag, {
			template,
			data
		});
	}
}

async function initializeWidget( widget )
{
	await updateWidget( widget );
	await registerPeriodicSync( widget );
}

async function updateWidget( widget )
{
	const template = await getTemplate( widget.definition.msAcTemplate );
	const data = await ( await fetch( widget.definition.data ) ).text();
	
	console.log( `Updating ${widget.definition.tag} with payload`, { template, data } );
	await self.widgets.updateByTag(widget.definition.tag, {
		template,
		data
	});
}

async function uninstallWidget( widget )
{
	if ( widget.instances.length === 1 && "update" in widget.definition )
	{
		await self.registration.periodicSync.unregister( widget.definition.tag );
	}
}

self.addEventListener("activate", (event) => {
	console.log("Initializing all widgets");
	event.waitUntil(
		initAllWidgets()
	);
});

self.addEventListener("widgetinstall", function(event) {
	console.log( `Installing ${event.widget.tag}` );
	event.waitUntil(
		initializeWidget( event.widget )
	);
});

self.addEventListener("widgetuninstall", function(event) {
	console.log( `Uninstalling ${event.widget.tag}` );
	event.waitUntil(
		uninstallWidget( event.widget )
	);
});

self.addEventListener("widgetresume", function(event) {
	console.log( `Resuming ${event.widget.tag}` );
	event.waitUntil(
		updateWidget( event.widget )
	);
});

self.addEventListener("widgetclick", function(event) {

	const widget = event.widget;
	const action = event.action;
		
	switch ( action ) {
		
		// Custom Actions
		case "refresh":
			console.log("Asking a widget to refresh itself");
			event.waitUntil(
				updateWidget( widget )
			);
			break;
	}

});

self.addEventListener("periodicsync", event => {

	const tag = event.tag;
	
	if ( "widgets" in self )
	{
		const widget = widgets.getByTag( tag );
		if ( widget && "update" in widget.definition ) {
			event.waitUntil( updateWidget( widget ) );
		}
	}

});