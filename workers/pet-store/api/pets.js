import { corsOptionsHeaders } from '../../../lib/data';
import {
  createPet,
  deletePet,
  deletePets,
  fetchPet,
  fetchPets,
  patchPet,
} from '../utils/pets';

export default async function handler(request) {
  switch (request.method) {
    case 'GET':
      if (request.url.includes('/pets?')) {
        return await fetchPets(request);
      } else return await fetchPet(request);

    case 'POST':
      return await createPet(request);
    case 'PATCH':
      return await patchPet(request);
    case 'DELETE':
      if (request.url.includes('/pets?')) {
        return await deletePets(request);
      } else return await deletePet(request);
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
