import { decryptToken, logIn } from '../../../lib';
import { getJsonBody, handlerWrapper } from '../../../lib/handlers';
import { badRequest, forbidden } from '../../../lib/response';
import { validateBody } from '../../pet-store/utils/api';
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  deleteWatchlist,
} from '../utils/watchlist';

export default async function watchlistHandler(request, env, ctx) {
  const { pathname } = new URL(request.url);
  return await handlerWrapper(async () => {
    const body = await getJsonBody(request);
    // Handle Basic Auth
    if (request.headers.get('authorization')) {
      const token = request.headers.get('authorization');
      const user = decryptToken(token);
      if (user.failure) return forbidden(user.error);
      body.email = user.email;
      body.password = user.password;
    }

    const testRes = validateBody(body, ['email', 'password']);
    if (testRes) return forbidden('Not Authorized');

    if (['POST', 'PATCH'].includes(request.method)) {
      const bodyTest = validateBody(body, ['id', 'mediaType']);
      if (bodyTest) return bodyTest;
    }

    const logInResponse = await logIn(body);

    if (!logInResponse.ok) {
      return logInResponse;
    }
    const user = await getJsonBody(logInResponse);

    switch (request.method) {
      case 'PUT':
        return await addToWatchlist(body, user);
      case 'GET':
        return await getWatchlist(user);
      case 'PATCH':
        return await removeFromWatchlist(body, user);
      case 'DELETE':
        return await deleteWatchlist(user);

      default:
        return new Response('Method not allowed', {
          status: 405,
        });
    }
  });
}
