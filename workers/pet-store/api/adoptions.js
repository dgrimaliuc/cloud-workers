import { corsOptionsHeaders } from '../../../lib/data';
import {
  createAdoption,
  deleteAdoption,
  deleteAdoptions,
  fetchAdoption,
  fetchAdoptions,
  patchAdoption,
} from '../utils/adoptions';

export default async function handler(request) {
  try {
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
        return new Response('Method not allowed', {
          status: 405,
        });
    }
  } catch (e) {
    return new Response(e.message, {
      status: 400,
    });
  }
}
