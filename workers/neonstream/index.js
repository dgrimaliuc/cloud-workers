/**
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { corsOptionsHeaders } from '../../lib/data';
import { handleOptions } from '../../lib/handlers';
import neonHandler from './api/routes';

const handler = {
  async fetch(request, env, ctx) {
    try {
      if (request.method === 'OPTIONS') {
        // Handle CORS preflight requests
        return await handleOptions(request);
      } else {
        return await neonHandler(request);
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
