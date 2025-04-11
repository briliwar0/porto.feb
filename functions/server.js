// Serverless API handler untuk Cloudflare Pages
import { app, initDb } from '../server';
import serverless from 'serverless-http';

// Initialize database untuk Cloudflare Pages
initDb();

// Wrap Express app dengan serverless handler
const serverlessHandler = serverless(app, {
  binary: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf']
});

// Handler untuk Cloudflare Functions
export const handler = async (request, env, ctx) => {
  // Tambahkan headers untuk CORS
  const response = await serverlessHandler(request, env, ctx);
  
  if (request.headers.get('Origin')) {
    response.headers.set('Access-Control-Allow-Origin', request.headers.get('Origin'));
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
  }
  
  return response;
};

// Untuk Cloudflare Pages function, perlu export secara default
export default { fetch: handler };