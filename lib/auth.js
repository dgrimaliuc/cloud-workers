import { makeRequest, requestWrapper, urlRequest } from './request';

let apiKey = '';
let idToken = '';

const baseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts';

export function initAuth(env) {
  apiKey = `?key=${env.FIREBASE_AUTH_KEY}`;
  idToken = env.FIREBASE_ADMIN_TOKEN;
}

export async function deleteUser({ idToken }) {
  return await req(`${baseUrl}:delete`, { idToken });
}

export async function logIn({ email, password }) {
  return await req(`${baseUrl}:signInWithPassword`, {
    email,
    password,
  });
}

export async function signUp({ email, password }) {
  return await req(`${baseUrl}:signUp`, { email, password });
}

async function req(url, body) {
  return makeRequest({
    url: url + apiKey,
    method: 'POST',
    body,
  });
}

export function decryptToken(token) {
  let credentials = null;
  try {
    credentials = atob(token.replace('Basic ', '')).split(':');
  } catch (e) {
    return { failure: true, error: 'Invalid token' };
  }
  return { email: credentials[0], password: credentials[1] };
}
