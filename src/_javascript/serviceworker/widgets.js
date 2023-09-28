// Widgets are still experimental
// More: https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/PWAWidgets/README.md

const periodicSync = self.registration.periodicSync;

async function registerPeriodicSync( widget )
{
  // if the widget is set up to auto-update…
  if ( "update" in widget.definition ) {
    registration.periodicSync.getTags()
      .then( tags => {
        // only one registration per tag
        if ( ! tags.includes( widget.definition.tag ) ) {
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
    periodicSync.unregister( widget.definition.tag );
  }
  return;
}

async function updateWidgets( host_id )
{
  const config = host_id ? { hostId: host_id }
                         : { installed: true };
  
  let queue = [];
  await widgets.matchAll( config )
    .then(async widgetList => {
      for (let i = 0; i < widgetList.length; i++) {
        queue.push(updateWidget( widgetList[i] ));
      }
    });
  await Promise.all(queue);
  return;
}

async function initializeWidget( widget )
{
  await updateWidget( widget );
	await registerPeriodicSync( widget );
}

async function updateWidget( widget )
{
	const template = await ( await fetch( widget.definition.msAcTemplate ) ).json();
  const data = await ( await fetch( widget.definition.data ) ).json();
	
	await self.widgets.updateByTag(widget.definition.tag, {template, data});
}

async function uninstallWidget( widget )
{
	if ( widget.instances.length === 1 && "update" in widget.definition )
	{
    await self.registration.periodicSync.unregister( widget.definition.tag );
  }
}

self.addEventListener("widgetinstall", function(event) {
	console.log("installing", event.widget);
	event.waitUntil(
		initializeWidget( event.widget )
	);
});

self.addEventListener("widgetuninstall", function(event) {
	console.log("uninstalling", event.widget);
	event.waitUntil(
		uninstallWidget( event.widget )
	);
});

self.addEventListener("widgetresume", function(event) {
	console.log("resuming widget", event.widget);
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