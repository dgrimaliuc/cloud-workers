export async function urlRequest(params) {
  const response = await fetch(params.url, {
    method: params.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...params.headers,
    },
    body: params.body ? JSON.stringify(params.body) : undefined,
  });
  return await response.json();
}

/**
 *
 * @param {*} promise - urlRequest promise with response.json() last code line
 * @returns
 */

export async function requestWrapper(promise) {
  const response = await promise;
  const body = await response.json();
  return new Response(JSON.stringify(body), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Make a request and return a Response object
 * @param {*} params request params
 * @returns
 */
export async function makeRequest(params) {
  return await requestWrapper(
    fetch(params.url, {
      method: params.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...params.headers,
      },
      body: params.body ? JSON.stringify(params.body) : undefined,
    })
  );
}
