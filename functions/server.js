// Serverless API handler untuk Cloudflare Pages dan Netlify Functions
import { app, initDb } from '../server/index.js';
import serverless from 'serverless-http';

// Initialize database untuk Cloudflare Pages/Netlify
initDb();

// Konfigurasi serverless handler untuk Express
const serverlessHandler = serverless(app, {
  binary: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf', 'application/json']
});

// Handler untuk Cloudflare Functions
export const handler = async (request, env, ctx) => {
  try {
    // Tambahkan headers untuk CORS
    const response = await serverlessHandler(request, env, ctx);
    
    if (request.headers.get('Origin')) {
      response.headers.set('Access-Control-Allow-Origin', request.headers.get('Origin'));
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Max-Age', '86400');
    }
    
    return response;
  } catch (error) {
    console.error('Serverless error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

// Untuk Netlify Functions (kompatibilitas dengan CommonJS)
export { handler };

// Untuk Cloudflare Pages function, perlu export secara default
export default { fetch: handler };