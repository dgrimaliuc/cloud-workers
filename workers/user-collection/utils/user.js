import { deleteUser, logIn, signUp } from '../../../lib';
import { getJsonBody } from '../../../lib/handlers';
import { allOk } from '../../../lib/response';
import { validateBody } from '../../pet-store/utils/api';
import { deleteWatchlist } from './watchlist';

async function deleteUserAction({ email, password }) {
  const logInResponse = await logIn({ email, password });
  if (!logInResponse.ok) {
    return logInResponse;
  }
  const body = await logInResponse.json();
  const deleteReq = await deleteUser(body);
  if (!deleteReq.ok) {
    return deleteReq;
  }
  await deleteWatchlist(body);
  return allOk({ message: 'User deleted' });
}

async function userRequestHandler(request, requestAction) {
  const body = await getJsonBody(request);
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
