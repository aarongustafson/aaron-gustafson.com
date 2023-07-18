exports.handler = () => new Response("Hello world");

/* export default async function latestLinks(request: Request) {
  let timerId: number | undefined;
  const body = new ReadableStream({
    start(controller) {
      timerId = setInterval(() => {
        const msg = new TextEncoder().encode(
          `data: hello at ${new Date().toUTCString()}\r\n\r\n`,
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
} */