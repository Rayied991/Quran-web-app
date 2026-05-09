import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

app.get('/', (c) => c.json({ status: 'ok', service: 'Quran API' }));

app.get('/health', (c) => c.json({ status: 'healthy', timestamp: new Date().toISOString() }));

export default app;