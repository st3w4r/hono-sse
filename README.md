# Hono SSE

Use [Hono framework](https://hono.dev/) with [SSE (Server Sent Event)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)


## Blog post

[Introduction Hono with SSE](https://github.com/st3w4r/hono-sse/blob/main/BLOG.md)

## Installation

```bash
npx bun install
npx bun run dev
```

Open in browser, Inspect > Network tab to observe SSE events
```bash
open public/index.html
```

Receive SSE events with curl
```bash
curl http://localhost:3000/sse
```

Output
```bash
retry: 1000
id: 0
data: hello

id: 1
data: world

event: close
data: close
```
