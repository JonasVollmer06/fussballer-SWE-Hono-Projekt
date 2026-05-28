import {Hono} from 'hono';

/**
 * Hier befindet sich der Liveness und Readiness Router
 * @packageDocumentation
 */


export const router = new Hono();

router.get('/liveness', (c) => c.json({ status: 'up'}));

router.get('/readiness', (c) => c.json({ status: 'up'}));