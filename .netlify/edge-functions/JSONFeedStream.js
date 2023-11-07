export default function JSONStreamFeed( url, interval ) {
  let timerId;
  let last_message;
  return new ReadableStream({
    start(controller) {
      timerId = setInterval(async function(){
        let feed = await fetch( url );
        let latest_links = await feed.json();
        let updated = latest_links.items[0].date_published;
        if ( updated &&
             last_message != updated )
        {
          const date = updated;
          const message = "deployed";
          const msg = new TextEncoder().encode(
            `data: ${JSON.stringify( { date, message } )}\r\n\r\n`
          );
          controller.enqueue(msg);
          last_message = updated;
        }
      }, interval );
    },
    cancel() {
      if (typeof timerId === "number") {
        clearInterval(timerId);
      }
    },
  });
}