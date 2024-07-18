import { config } from '../workers/pet-store/config';
const { prod } = config;

const { db } = prod;

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
  const response = await fetch(`${db}/${path}.json`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  return response.json();
}
