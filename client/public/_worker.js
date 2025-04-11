export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Jika request ke API, teruskan ke API
    if (url.pathname.startsWith('/api/')) {
      return fetch(request);
    }
    
    // Tangani SPA routing untuk semua path frontend
    return env.ASSETS.fetch(url.pathname === '/' 
      ? request 
      : new Request(new URL('/', url), request));
  }
}