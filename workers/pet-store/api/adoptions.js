import { corsOptionsHeaders } from '../../../lib/data';
import { handlerWrapper } from '../../../lib/handlers';
import { notAllowed } from '../../../lib/response';
import {
  createAdoption,
  deleteAdoption,
  deleteAdoptions,
  fetchAdoption,
  fetchAdoptions,
  patchAdoption,
} from '../utils/adoptions';

export default async function handler(request) {
  return await handlerWrapper(async () => {
    switch (request.method) {
      case 'GET':
        if (request.url.includes('/adoptions?')) {
          return await fetchAdoptions(request);
        } else {
          return await fetchAdoption(request);
        }

      case 'POST':
        return await createAdoption(request);
      case 'PATCH':
        return await patchAdoption(request);
      case 'DELETE':
        if (request.url.includes('/adoptions?')) {
          return await deleteAdoptions(request);
        } else {
          return await deleteAdoption(request);
        }
      case 'OPTIONS':
        return new Response(null, {
          status: 204,
          headers: {
            ...corsOptionsHeaders,
          },
        });
      default:
        return notAllowed();
    }
  });
}
