import { Hono } from 'hono';

/**
 * Das Modul besteht aus dem Router für Liveness und Readiness.
 * @packageDocumentation
 */
export const router = new Hono();

router.get('/liveness', (c) => c.json({ status: 'up' }));

// TODO "SELECT 1" mit Prisma
router.get('/readiness', (c) => c.json({ status: 'up' }));
