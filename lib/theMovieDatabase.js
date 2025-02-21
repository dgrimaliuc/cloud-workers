import { urlRequest } from './request';

let token = null;
const url = 'https://api.themoviedb.org/3/';
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZWQ0N2FkMmYxYWMxNTIwMWRkOTZjOTkzNzFjYjIyMCIsIm5iZiI6MTczOTk3ODA3MC4yNTksInN1YiI6IjY3YjVmNTU2NjBiMThhNTY5OGRmZjI3OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UTRy-E8L4nQw2WGr-LGZygCRNS7CC5odKv7bj-PVWw8'
//   }
// };

export function initMDB(env) {
  token = `Bearer ${env.TMDB_TOKEN}`;
}

/**
 * Add success true on success and keep success false on failure
 * @param {Ad} request request function
 * @returns
 */
async function mdbRequest(params) {
  const response = await urlRequest({
    ...params,
    method: 'GET',
    headers: {
      Authorization: token,
    },
  });
  if (response.success === undefined) {
    response.success = true;
  }
  return response;
}

export async function getMovie(id) {
  return await mdbRequest({
    url: url + 'movie/' + id + '?language=en-US',
  });
}

export async function getTv(id) {
  return await mdbRequest({
    url: url + 'tv/' + id + '?language=en-US',
  });
}
export async function getEpisode(id, season, episode) {
  return await mdbRequest({
    url:
      url +
      'tv/' +
      id +
      `/season/${season}/episode/${episode}` +
      '?language=en-US',
  });
}

export async function getContent({ id, mediaType, season, episode }) {
  switch (mediaType) {
    case 'movie':
      return await getMovie(id);
    case 'episode':
      return await getEpisode(id, season, episode);
    case 'tv':
      return await getTv(id);
    default:
      return {
        success: false,
        status_message: 'Invalid mediaType: ' + mediaType,
      };
  }
}
