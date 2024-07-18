/**
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { handleOptions } from '../../lib/handlers';
import { buildResp } from '../../lib/response';
import { parseURL } from '../../lib/utils';
import { default as petsHandler } from './api/pets';
import { default as adoptionsHandler } from './api/adoptions';

const handler = {
  async handleRequest(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      // Handle CORS preflight requests
      console.log('Handling CORS preflight request');
      return await handleOptions(request);
    } else {
      const { pathname } = parseURL(request.url);
      switch (true) {
        case pathname.startsWith('/api/pets'):
          return await petsHandler(request, env, ctx);
        case pathname.startsWith('/api/adoptions'):
          return await adoptionsHandler(request, env, ctx);
        default:
          return new Response('Endpoint unknown: ' + pathname, {
            status: 400,
          });
      }
    }
  },

  async fetch(request, env, ctx) {
    try {
      return this.handleRequest(request, env, ctx);
    } catch (e) {
      console.error('ERROR', e);
      const message = JSON.stringify({ error: e.message });
      return buildResp({
        body: { message },
        status: e.status || 400,
      });
    }
  },
};
export default handler;
