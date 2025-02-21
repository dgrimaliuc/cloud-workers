import { decryptToken, deleteUser, logIn, signUp } from '../../../lib';
import { getJsonBody } from '../../../lib/handlers';
import { allOk, forbidden } from '../../../lib/response';
import { validateBody } from '../../pet-store/utils/api';
import { removeAllPlayheads } from './playheads';
import { deleteWatchlist } from './watchlist';

async function deleteUserAction({ email, password }) {
  const logInResponse = await logIn({ email, password });
  if (!logInResponse.ok) {
    return logInResponse;
  }
  const user = await logInResponse.json();
  const deleteReq = await deleteUser(user);
  if (!deleteReq.ok) {
    return deleteReq;
  }
  await deleteWatchlist(user);
  await removeAllPlayheads(user);
  return allOk({ message: `User '${user.email}' deleted` });
}

export function handleBasicAuth(request, body) {
  if (request.headers.get('authorization')) {
    const token = request.headers.get('authorization');
    const user = decryptToken(token);
    if (user.failure) return forbidden(user.error);
    body.email = user.email;
    body.password = user.password;
  }
}

async function userRequestHandler(request, requestAction) {
  const body = await getJsonBody(request);
  // Handle Basic Auth
  const authTest = handleBasicAuth(request, body);
  if (authTest) return authTest;

  const testRes = validateBody(body, ['email', 'password']);
  if (testRes) return testRes;
  return await requestAction(body);
}

export async function deleteUserHandler(request) {
  return userRequestHandler(request, deleteUserAction);
}

export async function logInHandler(request) {
  return userRequestHandler(request, logIn);
}

export async function signUpHandler(request) {
  return userRequestHandler(request, signUp);
}
