import { del, get, patch } from '../../../lib';
import { allOk, badRequest, notFound } from '../../../lib/response';
import { getContent } from '../../../lib/theMovieDatabase';
import { OrderedMap } from '../../../utils/OrderedMap';

const key = 'articles/watchlist';

async function saveWatchlist(user, watchlist) {
  return await patch(`${key}`, {
    content: JSON.stringify(watchlist),
    id: user.localId,
  });
}

async function getWL(user) {
  const res = JSON.parse(await get(`${key}/${user.localId}/content`));
  return new OrderedMap(res);
}

export async function getWatchlist(user) {
  const wl = await getWL(user);
  if (wl.isEmpty()) {
    return notFound("Watchlist collection doesn't exist for this user");
  } else {
    return allOk(wl.getOrdered());
  }
}

export async function addToWatchlist(body, user) {
  const wl = await getWL(user);
  const mdbItem = await getContent(body);
  const key = `${body.mediaType}-${body.id}`;

  if (!mdbItem.success) {
    return badRequest(mdbItem.status_message);
  }

  if (wl.has(key)) {
    return badRequest('Item already exists in watchlist');
  }

  wl.set(key, {
    id: mdbItem.id,
    title: mdbItem.title || mdbItem.name,
    tagline: mdbItem.tagline,
    image:
      mdbItem.backdrop_path || mdbItem.poster_path
        ? `https://image.tmdb.org/t/p/w780${
            mdbItem.backdrop_path || mdbItem.poster_path
          }`
        : '',
    mediaType: body.mediaType,
  });

  await saveWatchlist(user, wl);
  return allOk(wl.getOrdered());
}

export async function removeFromWatchlist(body, user) {
  const wl = await getWL(user);
  const key = `${body.mediaType}-${body.id}`;

  if (!wl.has(key)) {
    return badRequest("Item doesn't exists in watchlist");
  }

  wl.delete(key);
  await saveWatchlist(user, wl);
  return allOk(wl.getOrdered());
}

export async function deleteWatchlist(user) {
  await del(`${key}/${user.localId}`);
  return allOk({ message: 'Watchlist deleted' });
}
