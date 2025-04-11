// Serverless API handler untuk Cloudflare Pages
import { app, initDb } from '../server';
import serverless from 'serverless-http';

// Initialize database
initDb();

// Wrap app with serverless handler
export const handler = serverless(app);

// Untuk Cloudflare Pages function, perlu export secara default
export default {
  fetch: handler
};