import { decryptToken, logIn } from '../../../lib';
import { getJsonBody, handlerWrapper } from '../../../lib/handlers';
import { badRequest, forbidden, notAllowed } from '../../../lib/response';
import { validateBody } from '../../pet-store/utils/api';
import {
  addPlayheads,
  getPlayheads,
  removePlayheads,
  removeAllPlayheads,
} from '../utils/playheads';
import { handleBasicAuth } from '../utils/user';

export default async function playheadsHandler(request, env, ctx) {
  return await handlerWrapper(async () => {
    const body = await getJsonBody(request);
    // Handle Basic Auth
    const authTest = handleBasicAuth(request, body);
    if (authTest) return authTest;

    const testRes = validateBody(body, ['email', 'password']);
    if (testRes) return forbidden('Not Authorized');

    if (['PUT', 'PATCH'].includes(request.method)) {
      const bodyTest = validateBody(body, ['id', 'mediaType', 'playheads']);
      if (bodyTest) return bodyTest;

      if (!['episode', 'movie'].includes(body.mediaType)) {
        return badRequest(
          'Invalid mediaType: ' +
            body.mediaType +
            ". Must be 'episode' or 'movie'"
        );
      }

      if (body.mediaType === 'episode') {
        const episodeTest = validateBody(body, ['season', 'episode']);
        if (episodeTest) return episodeTest;
      }
    }

    const logInResponse = await logIn(body);

    if (!logInResponse.ok) {
      return logInResponse;
    }
    const user = await getJsonBody(logInResponse);

    switch (request.method) {
      case 'PUT':
        return await addPlayheads(body, user);
      case 'GET':
        return await getPlayheads(user);
      case 'PATCH':
        return await removePlayheads(body, user);
      case 'DELETE':
        return await removeAllPlayheads(user);

      default:
        return notAllowed();
    }
  });
}
