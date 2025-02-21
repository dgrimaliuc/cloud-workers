/**
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { handleOptions } from '../../lib/handlers';
import { badRequest, buildResp } from '../../lib/response';
import { default as userHandler } from './api/user';
import { default as playheadsHandler } from './api/playheads';
import { default as watchlistHandler } from './api/watchlist';
import { initializeDB, initAuth } from '../../lib';
import { initMDB } from '../../lib/theMovieDatabase';

const handler = {
  async handleRequest(request, env, ctx) {
    initAuth(env);
    initMDB(env);
    initializeDB(env);
    if (request.method === 'OPTIONS') {
      return await handleOptions(request);
    } else {
      const { pathname } = new URL(request.url);
      switch (true) {
        case pathname.startsWith('/user'):
          return await userHandler(request, env, ctx);
        case pathname === '/watchlist':
          return await watchlistHandler(request, env, ctx);
        case pathname.startsWith('/playheads'):
          return await playheadsHandler(request, env, ctx);
        default:
          return badRequest('Endpoint unknown: ' + pathname);
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
