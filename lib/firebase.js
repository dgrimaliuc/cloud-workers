let dbUrl;

export function initializeFirebase(env) {
  // Initialize the global dbUrl with the value from the environment
  dbUrl = env.FIREBASE_DB;
}

export async function get(path) {
  return await req('GET', path);
}

export async function patch(path, data) {
  if (!data.id) {
    throw new Error('Missing id');
  }

  return await req('PATCH', path, { [data.id]: data });
}

export async function del(path) {
  return await req('DELETE', path);
}

export async function post(path, data) {
  return await req('POST', path, data);
}

export async function put(path, data) {
  return await req('PUT', path, data);
}

async function req(method, path, data) {
  const response = await fetch(`${dbUrl}/${path}.json`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  return response.json();
}
