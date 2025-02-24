import { urlRequest } from './request';

let dbUrl;

export function initializeDB(env) {
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
  return await urlRequest({
    url: `${dbUrl}/${path}.json`,
    method,
    body: data,
  });
}
