// oxlint-disable no-magic-numbers

import { type Context, type Next } from 'hono';
import { Counter, Histogram, collectDefaultMetrics } from 'prom-client';
import { createMiddleware } from 'hono/factory';

collectDefaultMetrics();
const httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Gesamte Anzahl an HTTP-Requests',
    labelNames: ['method', 'path', 'status_code'],
});

const httpRequestDurationSeconds = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Dauer von HTTP-Requests in Sekunden',
    labelNames: ['method', 'path', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

export const trackMetrics = createMiddleware(async (c: Context, next: Next) => {
    const start = Date.now();
    const { path, method } = c.req;

    // oxlint-disable-next-line node/callback-return
    await next();

    const { res } = c;
    const { status } = res;
    const duration = (Date.now() - start) / 1000;

    httpRequestsTotal.inc({ method, path, status_code: status });
    httpRequestDurationSeconds.observe(
        { method, path, status_code: status },
        duration,
    );
});
