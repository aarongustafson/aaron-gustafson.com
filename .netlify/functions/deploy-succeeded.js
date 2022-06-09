exports.handler = async (event) => {
  //console.log(event);
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/event-stream"
    },
    body: 'data:' + JSON.stringify({event:"deployed"})
  };
};