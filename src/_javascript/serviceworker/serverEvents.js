// Server Event: Deploy Successful
const deployedEvent = new EventSource('/api/latest-links');
deployedEvent.addEventListener('message', function (event) {

  var message = JSON.parse(event.data);
  console.log(message);
  if ( message.event == "deployed" )
  {
    updateWidgets();
  }
}, false);