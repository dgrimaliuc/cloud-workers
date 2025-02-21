import { del, get, patch } from '../../../lib';
import { allOk, badRequest, notFound } from '../../../lib/response';
import { getContent } from '../../../lib/theMovieDatabase';
import { OrderedMap } from '../../../utils/OrderedMap';

const key = 'articles/playheads';

async function savePlayheads(user, playheads) {
  return await patch(`${key}`, {
    content: JSON.stringify(playheads),
    id: user.localId,
  });
}

async function getPl(user) {
  const res = JSON.parse(await get(`${key}/${user.localId}/content`));
  return new OrderedMap(res);
}

export async function getPlayheads(user) {
  const pl = await getPl(user);
  if (pl.isEmpty()) {
    return notFound("Playheads collection doesn't exist for this user");
  } else {
    return allOk(pl.getOrdered());
  }
}

export async function addPlayheads(body, user) {
  const pl = await getPl(user);
  const mdbItem = await getContent(body);
  if (!mdbItem.success) {
    return badRequest(mdbItem.status_message);
  }

  let key = `${body.mediaType}-${body.id}`;
  if (body.mediaType === 'episode') {
    key += `-s${body.season}-e${body.episode}`;
  }

  if (+body.playheads < 0 || +body.playheads > mdbItem.runtime * 60) {
    return badRequest(
      'Invalid playhead, must be between 0 and ' + mdbItem.runtime * 60
    );
  }

  const newPl = {
    id: mdbItem.id,
    title: mdbItem.title || mdbItem.name,
    duration: mdbItem.runtime * 60,
    playheads: body.playheads,
    image:
      mdbItem.backdrop_path || mdbItem.still_path
        ? `https://image.tmdb.org/t/p/w780${
            mdbItem.backdrop_path || mdbItem.still_path
          }`
        : '',
    mediaType: body.mediaType,
  };

  if (body.mediaType === 'episode') {
    newPl.season = body.season;
    newPl.episode = body.episode;
  }

  pl.set(key, newPl);

  await savePlayheads(user, pl);
  return allOk(pl.getOrdered());
}

export async function removePlayheads(body, user) {
  const pl = await getPl(user);
  let key = `${body.mediaType}-${body.id}`;
  if (body.mediaType === 'episode') {
    key += `-s${body.season}-e${body.episode}`;
  }

  if (!pl.has(key)) {
    return badRequest("Item doesn't exists in watchlist");
  }

  pl.delete(key);
  await savePlayheads(user, pl);
  return allOk(pl.getOrdered());
}

export async function removeAllPlayheads(user) {
  await del(`${key}/${user.localId}`);
  return allOk({ message: 'Playheads deleted' });
}
