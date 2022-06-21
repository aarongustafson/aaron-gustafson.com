// Widgets are still experimental
// More: https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/PWAWidgets/README.md

const { result } = require("lodash");

const periodicSync = self.registration.periodicSync;

// mocking widgets
self.widgets = function() {
  var _widgets = [{
    definition: {
      tag: "foo"
    },
    installable: true,
    instances: [{
      id: "foo-instance-1",
      hostId: "host-1",
    }],
  },
  {
    definition: {
      tag: "bar"
    },
    installable: true,
    instances: [{
      id: "bar-instance-1",
      hostId: "host-1",
    }],
  },
  {
    definition: {
      tag: "baz"
    },
    installable: false,
    instances: [],
  }];
  
  async function matchAll( obj )
  {
    return _widgets.filter( widget => {
      let result = true;
      if ( result && "installable" in obj ) {
        result = obj.installable === widget.installable;
      }
      if ( result && "installed" in obj ) {
        result = obj.installed ? widget.instances.length > 0
                                : widget.instances.length === 0;
      }
      if ( result && "tag" in obj ) {
        result = widget.definition.tag === obj.tag;
      }
      if ( result && ( "hostId" in obj || "instanceId" in obj ) ) {
        result = widget.instances.find( instance => {
          if ( "hostId" in obj ) {
            return instance.hostId === obj.hostId;
          }
          else if ( "instanceId" in obj ) {
            return instance.id === obj.instanceId;
          }
        });
      }
      return result;
    });
  };
  async function getByHostId( host_id ) 
  {
    const result = await matchAll({ hostId: host_id });
    console.log("getByHostId",result);
    return result;
  };
  async function getByInstanceId( instance_id )
  {
    const result = await matchAll({ instanceId: instance_id });
    console.log("getByInstanceId", result, result[0]);
    return result[0];
  };
  async function getByTag( tag )
  {
    const result = await matchAll({ tag: tag });
    console.log("getByTag", result, result[0]);
    return result[0];
  };

  const updateInstance = ( instance, payload ) => {
    instance.updated = Date.now();
    instance.payload = payload;
    return;
  };
  async function updateByInstanceId( instance_id, payload )
  {
    getByInstanceId( instance_id )
      .then( widget => {
        console.log("widget", widget);
        let instance = widget.instances.find( i => i.id === instance_id );
        updateInstance( instance, payload );
        return;
      });
  };
  async function updateByTag( tag, payload )
  {
    getByTag( tag )
      .then( widget => {
        console.log("widget", widget);
        widget.instances.forEach( instance => {
          updateInstance( instance, payload );
          return;
        });
      });
  };

  async function removeByInstanceId( instance_id )
  {
    getByInstanceId( instance_id )
      .then( widget => {
        console.log("widget", widget);
        widget.instances = widget.instances.filter( i => i.id !== instance_id );
        return;
      });
  };

  return {
    matchAll: matchAll,
    getByHostId: getByHostId,
    getByInstanceId: getByInstanceId,
    getByTag: getByTag,
    updateByInstanceId: updateByInstanceId,
    updateByTag: updateByTag,
    removeByInstanceId: removeByInstanceId,
  };
};

const registerPeriodicSync = async ( widget ) => {
  // if the widget is set up to auto-update…
  if ( "update" in widget.definition ) {
    return registration.periodicSync.getTags()
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
};

const unregisterPeriodicSync = async ( widget ) => {
  // clean up periodic sync?
  if ( widget.instances.length === 1 &&
       "update" in widget.definition )
  {
    periodicSync.unregister( widget.definition.tag );
  }
  return;
};

const createInstance = async ( instance_id, widget ) => {
  // get the data needed
  return updateInstance( instance_id, widget )
    .then( registerPeriodicSync( widget ) );
};

const updateWidgets = async ( host_id ) => {
  const config = host ? { hostId: host_id }
                      : { installed: true };
  return widgets.matchAll( config )
    .then(async widgetList => {
      for (let i = 0; i < widgetList.length; i++) {
        updateWidget( widgetList[i] );
      }
    });
};

const updateWidget = async ( widget ) => {
  // Widgets with settings should be updated on a per-instance level
  if ( widget.hasSettings )
  {
    return widget.instances.map( async (instance) => {
      updateInstance( instance, widget );
    });
  }
  // other widgets can be updated en masse via their tags
  else
  {
    return fetch( widget.definition.data )
      .then( response => {
        let payload = {
          template: widget.definition.template,
          data: response.body
        };
        widgets.updateByTag( widget.definition.tag, payload );
      });
  }
};

const updateInstance = async ( instance, widget ) => {
  // If we only get an instance id, get the instance itself
  if ( typeof instance === "string" ) {
    instance = widget.instances.find( i => i.id === instance );
  }
  if ( ! "settings" in instance ) {
    instance.settings = {};
  }
  let settings_data = new FormData();
  for ( let key in instance.settings ) {
    settings_data.append(key, instance.settings[key]);
  }
  return fetch( widget.data, {
      method: "POST",
      body: settings_data
    })
    .then( response => {
      let payload = {
        template: widget.definition.template,
        data: response.body,
        settings: instance.settings
      };
      widgets.updateByInstanceId( instance.id, payload );
    });
};

const removeInstance = async ( instance_id, widget ) => {
  console.log( `uninstalling ${widget.definition.name} instance ${instance_id}` );
  return unregisterPeriodicSync( widget )
    .then(() => {
      widgets.removeByInstanceId( instance_id );
    });
};

self.addEventListener("widgetclick", function(event) {

  const action = event.action;
  const host_id = event.hostId;
  const widget = event.widget;
  const instance_id = event.instanceId;
    
  switch ( action ) {
    
    // If a widget is being installed
    case "WidgetInstall":
      console.log("installing", widget, instance_id);
      event.waitUntil(
        createInstance( instance_id, widget )
      );
      break;
    
    // If a widget is being uninstalled
    case "WidgetUninstall":
      event.waitUntil(
        removeInstance( instance_id, widget )
      );
      break;

    // If a widget host is requesting all its widgets update
    case "WidgetResume":
      console.log("resuming all widgets");
      event.waitUntil(
        // refresh the data on each widget
        updateWidgets( host_id )
      );
      break;

    // Custom Actions
    case "refresh":
      console.log("Asking a widget to refresh itself");
      event.waitUntil(
        updateInstance( instance_id, widget )
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