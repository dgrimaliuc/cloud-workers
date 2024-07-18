import { corsOptionsHeaders } from '../../../lib/data';
import { createPet, deletePets, fetchPets, patchPet } from '../utils/pets';

export default async function handler(request) {
  switch (request.method) {
    case 'GET':
      return await fetchPets(request);
    case 'POST':
      return await createPet(request);
    case 'PATCH':
      return await patchPet(request);
    case 'DELETE':
      return await deletePets(request);
    case 'OPTIONS':
      return new Response(null, {
        status: 200,
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
