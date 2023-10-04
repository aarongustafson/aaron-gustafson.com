export default async function latestLinks() {
  let timerId;
  const body = new ReadableStream({
    start(controller) {
      timerId = setInterval(() => {
        const date = new Date().toUTCString();
        const message = "deployed";
        const msg = new TextEncoder().encode(
          `data: ${JSON.stringify( { date, message } )}\r\n\r\n`
        );
        controller.enqueue(msg);
      }, 1000);
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