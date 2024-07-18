import { corsOptionsHeaders } from '../../../lib/data';
import { createAdoption, deleteAdoptions, fetchAdoptions, patchAdoption } from '../utils/adoptions';

export default async function handler(request) {
  switch (request.method) {
    case 'GET':
      return await fetchAdoptions(request);
    case 'POST':
      return await createAdoption(request);
    case 'PATCH':
      return await patchAdoption(request);
    case 'DELETE':
      return await deleteAdoptions(request);
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
}
