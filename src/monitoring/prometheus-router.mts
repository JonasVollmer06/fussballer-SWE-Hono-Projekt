import { Hono } from 'hono';
import { register } from 'prom-client';

export const router = new Hono();

router.get('/', async (c) => {
    const text = await register.metrics();

    return c.text(text, 200, {
        'Content-Type': register.contentType,
    });
});
