// Widgets are still experimental
// More: https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/PWAWidgets/README.md

const periodicSync = self.registration.periodicSync;

async function updateWidget( widget )
{
  // Widgets with settings should be updated on a per-instance level
  if ( widget.hasSettings )
  {
    widget.instances.map( async (instance) => {
      let settings_data = new FormData();
      for ( let key in instance.settings ) {
        settings_data.append(key, instance.settings[key]);
      }
      fetch( widget.data, {
        method: "POST",
        body: settings_data
      })
      .then( response => {
        let payload = {
          definition: widget.definition,
          data: response.body,
          settings: instance.settings
        };
        widgets.updateInstance( instance.id, payload );
      });
    });
  
    // other widgets can be updated en masse via their tags
  }
  else
  {
    fetch( widget.data )
      .then( response => {
        let payload = {
          definition: widget.definition,
          data: response.body
        };
        widgets.updateByTag( widget.tag, payload );
      });
  }
}

self.addEventListener('widgetclick', function(event) {

  const action = event.action;
  const host_id = event.host;
  const tag = event.tag;
  const instance_id = event.instance;
    
  switch ( action ) {
    
    // If a widget is being installed
    case "WidgetInstall":
      console.log("installing", widget, instance_id);
      event.waitUntil(
        // find the widget
        widgets.getByTag( tag )
          .then( widget => {
            // get the data needed
            fetch( widget.data )
              .then( response => {
                let payload = {
                  definition: widget.definition,
                  data: response.body
                };
                // show the widget, passing in 
                // the widget definition and data
                widgets
                  .updateInstance( instance_id, payload )
                  .then(()=>{
                    // if the widget is set up to auto-update…
                    if ( "update" in widget.definition ) {
                      let tags = await registration.periodicSync.getTags();
                      // only one registration per tag
                      if ( ! tags.includes( tag ) ) {
                        periodicSync.register( tag, {
                            minInterval: widget.definition.update
                        });
                      }
                    }
                  });
              })
          })
      );
      break;
    
    // If a widget is being uninstalled
    case "WidgetUninstall":
      event.waitUntil(
        // find the widget
        widgets.getByInstance( instance_id )
          .then( widget => {
            console.log("uninstalling", widget.definition.name, "instance", instance_id);
            // clean up periodic sync?
            if ( widget.instances.length === 1 && "update" in widget.definition )
            {
              await periodicSync.unregister( tag );
            }
            widgets.removeInstance( instance_id );
          })
      );
      break;

    // If a widget host is requesting all its widgets update
    case "WidgetResume":
      console.log("resuming all widgets");
      event.waitUntil(
        // refresh the data on each widget
        widgets.matchAll({ host: host_id })
          .then(function(widgetList) {
            for (let i = 0; i < widgetList.length; i++) {
              updateWidget( widgetList[i] );
            }
          })
      );
      break;

    // Custom Actions
    case "refresh":
      console.log("Asking a widget to refresh itself");
      event.waitUntil(
        widgets.getByInstance( instance_id )
          .then( widget => updateWidget( widget ) )
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