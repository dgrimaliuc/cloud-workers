import { handleRequest } from '../../../lib/handlers';
import { config } from '../config';

const translationsEndpoint = '/cms/translations';
const streamEndpoint = '/cms/stream';
const corsEndpoint = '/';

const getURLByRoute = (pathname) => {
  if (!pathname) {
    throw new Error('Route not found');
  }
  const routes = {
    [translationsEndpoint]: `${config.proxy}${translationsEndpoint}`,
    [streamEndpoint]: `${config.proxy}${streamEndpoint}`,
  };
  const url = routes[pathname];
  if (!url && pathname.startsWith(`${corsEndpoint}http`)) {
    return `${config.proxy}${pathname}`;
  } else return url;
};

export default async function neonHandler(request) {
  let pathname = new URL(request.url)?.pathname;
  console.log('Requesting: ', pathname);
  const url = getURLByRoute(pathname);
  console.log('Redirecting to: ', url);
  return await handleRequest(request, url);
}
