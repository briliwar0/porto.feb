import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

const DEBUG = false;

addEventListener('fetch', (event) => {
  try {
    event.respondWith(handleEvent(event));
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      );
    }
    event.respondWith(new Response('Internal Error', { status: 500 }));
  }
});

async function handleEvent(event) {
  const url = new URL(event.request.url);
  let options = {};

  // Khusus untuk API routes
  if (url.pathname.startsWith('/api/')) {
    // Cloudflare Pages akan mengarahkan secara otomatis ke fungsi API
    return fetch(event.request);
  }

  try {
    if (DEBUG) {
      options.cacheControl = {
        bypassCache: true,
      };
    }
    
    const page = await getAssetFromKV(event, options);
    
    // Untuk single-page application (SPA)
    const response = new Response(page.body, page);
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'no-referrer-when-downgrade');
    response.headers.set('Feature-Policy', "camera 'none'; microphone 'none'");

    return response;
  } catch (e) {
    // Jika aset tidak ditemukan, kembalikan fallback ke index.html untuk SPA
    if (e.status === 404 || e.status === 405) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: (req) => new Request(`${new URL(req.url).origin}/index.html`, req),
        });

        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 200,
        });
      } catch (e) {}
    }

    return new Response(e.message || e.toString(), { status: 500 });
  }
}