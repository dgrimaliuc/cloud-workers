import { corsOptionsHeaders } from './data';

const headers = {
  'Content-Type': 'application/json',
  ...corsOptionsHeaders,
};

const stringify = (obj) => JSON.stringify(obj);

export function buildResp(resp) {
  return new Response(JSON.stringify(resp.body), {
    status: 200,
    headers: {
      ...headers,
    },
    ...resp,
  });
}

const response = ({ message, status }) =>
  new Response(message, { status, headers });

export const notAllowed = () =>
  response({ status: 405, message: 'Method not allowed' });

export const badRequest = (message = 'Bad request') =>
  response({ status: 400, message: stringify({ error: message }) });

export const notFound = (message = 'Not found') =>
  response({ status: 404, message: stringify({ error: message }) });

export const forbidden = (message = 'Forbidden') =>
  response({ status: 403, message: stringify({ error: message }) });

export const created = (message = { message: 'Created' }) =>
  response({ status: 201, message: stringify(message) });

export const allOk = (message = { message: 'All OK' }) =>
  response({ status: 200, message: stringify(message) });
