/**
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { handleOptions } from '../../lib/handlers';
import { buildResp } from '../../lib/response';
import { default as petsHandler } from './api/pets';
import { default as adoptionsHandler } from './api/adoptions';
import { initializeDB } from '../../lib';

const handler = {
  async handleRequest(request, env, ctx) {
    initializeDB(env);
    if (request.method === 'OPTIONS') {
      return await handleOptions(request);
    } else {
      const { pathname } = new URL(request.url);
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
      return await this.handleRequest(request, env, ctx);
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
