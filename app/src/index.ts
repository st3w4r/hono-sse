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
