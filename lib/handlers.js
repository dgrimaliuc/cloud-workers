const { corsOptionsHeaders } = require('./data.js');
const { readRequestBody } = require('./utils.js');

async function handleRequest(request, url) {
  request = new Request(url, request);

  const userAgent =
    request.headers.get('user-agent') || request.headers.get('User-Agent');
  if (url.includes('hdrezka') && userAgent.includes('iPhone;')) {
    request.headers.set(
      'User-Agent',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    );
  }

  const headers = new Headers(request.headers);
  const infoUrl = new URL(url);

  headers.append('referer', infoUrl.origin);
  headers.append('origin', infoUrl.origin);
  headers.append('host', infoUrl.host);

  request = new Request(request, { headers });

  const reqBody = await readRequestBody(request);

  let response = await fetch(url, {
    method: request.method,
    headers: request.headers,
    body: reqBody,
    cf: { resolveOverride: 'hdrezka.ag' },
  });

  // Recreate the response so you can modify the headers
  response = new Response(response.body, response);
  // Set CORS headers
  Object.entries(corsOptionsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  // Append to/Add Vary header so browser will cache response correctly
  response.headers.append('Vary', 'Origin');
  return response;
}

async function handleOptions(request) {
  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS preflight requests.
    return new Response(null, {
      headers: {
        ...corsOptionsHeaders,
        'Access-Control-Allow-Headers': request.headers.get(
          'Access-Control-Request-Headers'
        ),
      },
    });
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, OPTIONS',
      },
    });
  }
}

async function handlerWrapper(handler) {
  try {
    return await handler();
  } catch (e) {
    console.error(e);
    return new Response(e.message, {
      status: 400,
    });
  }
}

async function getJsonBody(request) {
  try {
    const body = await request.json();
    return body;
  } catch (e) {
    return {};
  }
}

module.exports = { handleOptions, handleRequest, handlerWrapper, getJsonBody };
