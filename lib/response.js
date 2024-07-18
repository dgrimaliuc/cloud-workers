import { corsOptionsHeaders } from './data';

export function buildResp(resp) {
  return new Response(JSON.stringify(resp.body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...corsOptionsHeaders,
    },
    ...resp,
  });
}
