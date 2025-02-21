import { decryptToken, logIn } from '../../../lib';
import { getJsonBody, handlerWrapper } from '../../../lib/handlers';
import { badRequest, forbidden, notAllowed } from '../../../lib/response';
import { validateBody } from '../../pet-store/utils/api';
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  deleteWatchlist,
} from '../utils/watchlist';

export default async function watchlistHandler(request, env, ctx) {
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

      if (!['tv', 'movie'].includes(body.mediaType)) {
        return badRequest(
          'Invalid mediaType: ' + body.mediaType + ". Must be 'tv' or 'movie'"
        );
      }
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
        return notAllowed();
    }
  });
}
