import { deleteUserHandler, logInHandler, signUpHandler } from '../utils/user';
import { handlerWrapper } from '../../../lib/handlers';
import { badRequest, notAllowed } from '../../../lib/response';

export default async function userHandler(request, env, ctx) {
  const { pathname } = new URL(request.url);
  return await handlerWrapper(async () => {
    switch (true) {
      case request.method === 'POST':
        if (pathname === '/user/create') {
          return await signUpHandler(request);
        } else if (pathname === '/user/login') {
          return await logInHandler(request);
        } else {
          return badRequest('Endpoint unknown: ' + pathname);
        }

      case request.method === 'DELETE' && pathname === '/user':
        return await deleteUserHandler(request);

      default:
        return notAllowed();
    }
  });
}
