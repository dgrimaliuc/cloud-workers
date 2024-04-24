/**
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { getCorsHandler } from '../../lib/handlers';
import { readRequestBody } from '../../lib/utils';

const handler = {
  async fetch(request, env, ctx) {
    try {
      const { url } = getCorsHandler(request, env, ctx);
      const reqBody = await readRequestBody(request);

      return await fetch(url, {
        method: request.method,
        headers: request.headers,
        body: reqBody,
      });
    } catch (e) {
      const message = JSON.stringify({ error: e.message });
      return new Response(message, {
        status: e.status || 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  },
};
export default handler;
