# Hono SSE

Use [Hono framework](https://hono.dev/) with [SSE (Server Sent Event)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)


## Blog post


Hono is a next gen web framework, made for the edge that can run on any JavaScript runtime. We can use its streaming functionalities to eanble SSE Server Sent Event with it. Sending events from server to client only.

Server Sent Event is a protocol that can be followed and leverage the browser's implementation.

The client can listen a stream of event and the server can send event like notification or messages.

- Set the headers
- Send event and data
- Send id and retry timeout

### Headers

We can start by setting up the headers inside a middleware to avoid repeating the header setup:
```javascript
app.use('/sse/*', async (c, next) => {
    c.header('Content-Type', 'text/event-stream');
    c.header('Cache-Control', 'no-cache');
    c.header('Connection', 'keep-alive');
    await next();
});
```

Wehn the headers are setup we can use the stream feature of Hono to start streaming content to the client.

### Send data

Follow the SSE format with data and the double line at the end.

```javascript
app.get('/sse', (c) => {

    return c.stream(async (stream) => {
        stream.write('data: hello\n\n');
        stream.write('data: world\n\n');
    })

});
```

### Custom event type

We can send more data and setup a different event type.

```javascript
stream.write('event: close\n');
stream.write('data: close\n\n');
```


### Add an id to the event

The id of each event can be configured with:
```javascript
stream.write('id: 0\n');
```


### Retry timeout for the browser

The retry timeout can be configured as well for the client to retry if the request failed:
```javascript
stream.write('retry: 1000\n'); // Miliseconds
```

## Example endpoint

Example of an sse endpoint:
```javascript
app.get('/sse', (c) => {

    return c.stream(async (stream) => {
        stream.write('retry: 1000\n');

        stream.write('id: 0\n');
        stream.write('data: hello\n\n');
        
        stream.write('id: 1\n');
        stream.write('data: world\n\n');

        stream.write('event: close\n');
        stream.write('data: close\n\n');
    })

});
```


### Complete API example

Full API example:

```javascript
import { Hono } from 'hono'
import { cors } from 'hono/cors'


const app = new Hono()

app.use('*', cors(
    {
        origin: '*',
        allowMethods: ['GET'],
        allowHeaders: ['Content-Type'],
    }
))

app.get('/', (c) => c.text('Hello Hono!'))

app.use('/sse/*', async (c, next) => {
    c.header('Content-Type', 'text/event-stream');
    c.header('Cache-Control', 'no-cache');
    c.header('Connection', 'keep-alive');
    await next();
});

app.get('/sse', (c) => {

    return c.stream(async (stream) => {
        stream.write('retry: 1000\n');

        stream.write('id: 0\n');
        stream.write('data: hello\n\n');
        
        stream.write('id: 1\n');
        stream.write('data: world\n\n');

        stream.write('event: close\n');
        stream.write('data: close\n\n');
    })

});

export default app;
```


### Client example

The client will listen to the SSE endpoint and receive the incoming messages:

- By default a data will be received as a `message` event.
- We can add a listener, in that case the listener on `close` event have been set. The connection will be closed.



```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>SSE Example</title>
</head>

<body>
    <h1>SSE Example</h1>
    <div id="sse-data"></div>

    <script>
        const baseURL = "http://localhost:3000";
        const sseData = document.getElementById('sse-data');

        const eventSource = new EventSource(`${baseURL}/sse`);

        eventSource.onmessage = (event) => {
            sseData.innerHTML += event.data + '<br>';
        };

        eventSource.addEventListener("close", (event) => {
            console.log('Received "close" event. Closing connection...');
            eventSource.close();
        });

        eventSource.onerror = (error) => {
            console.error('EventSource error:', error);
        };
    </script>
</body>

</html>
```


Browse to the page with a browser and the SSE will be handled.


