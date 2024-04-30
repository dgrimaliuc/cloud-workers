const { corsOptionsHeaders } = require("./data.js");
const { readRequestBody } = require("./utils.js");

async function handleRequest(request, url) {
  const reqBody = await readRequestBody(request);

  console.log("reqBody", reqBody);
  let response = await fetch(url, {
    method: request.method,
    headers: request.headers,
    body: reqBody,
  });
  // Recreate the response so you can modify the headers
  response = new Response(response.body, response);
  // Set CORS headers
  Object.entries(corsOptionsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  // Append to/Add Vary header so browser will cache response correctly
  response.headers.append("Vary", "Origin");
  return response;
}
async function handleOptions(request) {
  if (
    request.headers.get("Origin") !== null &&
    request.headers.get("Access-Control-Request-Method") !== null &&
    request.headers.get("Access-Control-Request-Headers") !== null
  ) {
    // Handle CORS preflight requests.
    return new Response(null, {
      headers: {
        ...corsOptionsHeaders,
        "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers"),
      },
    });
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      headers: {
        Allow: "GET, HEAD, POST, OPTIONS",
      },
    });
  }
}
module.exports = { handleOptions, handleRequest };
