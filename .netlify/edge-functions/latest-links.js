const INTERVAL_MINUTES = 5;

export default async function latestLinks() {
  let timerId;
  let last_message;
  const body = new ReadableStream({
    start(controller) {
      timerId = setInterval(async function(){
        let feed = await fetch( "https://www.aaron-gustafson.com/feeds/latest-links.json" );
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
        resolve("Updated");
      }, ( INTERVAL_MINUTES * 60 * 1000 ) );
    },
    cancel() {
      if (typeof timerId === "number") {
        clearInterval(timerId);
      }
    },
  });
  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}