/**
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { corsOptionsHeaders } from '../../lib/data';
import { handleOptions, handleRequest } from '../../lib/handlers';
import { makeAssertions } from '../../lib/utils';

const handler = {
  async fetch(request, env, ctx) {
    try {
      if (request.method === 'OPTIONS') {
        // Handle CORS preflight requests
        return await handleOptions(request);
      } else {
        const { url } = makeAssertions(request, env, ctx);
        return await handleRequest(request, url);
      }
    } catch (e) {
      console.error('ERROR', e);
      const message = JSON.stringify({ error: e.message });
      return new Response(message, {
        status: e.status || 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsOptionsHeaders,
        },
      });
    }
  },
};
export default handler;
