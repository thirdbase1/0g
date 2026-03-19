export function applySecurityHeaders(response: Response): Response {
  const newResponse = new Response(response.body, response);

  // Set default security headers similar to Helmet
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('X-Frame-Options', 'SAMEORIGIN');
  newResponse.headers.set('X-XSS-Protection', '1; mode=block');
  newResponse.headers.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  newResponse.headers.set('Referrer-Policy', 'no-referrer');
  newResponse.headers.set('Access-Control-Allow-Origin', '*'); // Basic CORS
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  return newResponse;
}
