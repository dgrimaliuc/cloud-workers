import {
  accumulateByStatus,
  extractUUID,
  filterByStatus,
  getQueryParams,
  validateBody,
} from './api';
import { buildResp } from '../../../lib/response';
import { get, patch, del } from '../../../lib/firebase';
import { deleteAdoptions, getAdoptions } from './adoptions';

const { v4: uuid } = require('uuid');
const folder = 'articles/pets';

export async function getPets(location, status) {
  const pathName = `${folder}/${location}`;
  const pets = await get(pathName);

  if (!pets) {
    return {};
  } else {
    return status ? accumulateByStatus(pets, status) : pets;
  }
}

export async function getPet(id, location) {
  const pathName = `${folder}/${location}/${id}`;
  const pet = await get(pathName);

  if (!pet) {
    return {
      error: {
        body: { error: `Pet ${id} not found in ${location}` },
        status: 404,
      },
    };
  } else {
    return pet;
  }
}

export async function savePets(location, content) {
  const pathName = `${folder}/${location}`;
  for (const pet of content) {
    await patch(pathName, pet);
  }
  return buildResp({ body: content });
}

async function savePet(pet) {
  const pathName = `${folder}/${pet.location}`;
  return await patch(pathName, pet);
}

export async function fetchPet(request) {
  const petId = extractUUID(request.url);
  if (!petId) {
    return buildResp({
      body: { error: 'Pet ID is invalid' },
      status: 400,
    });
  }
  const { location } = getQueryParams(request.url);

  if (!location) {
    return buildResp({ body: { error: 'Missing location' }, status: 400 });
  }
  const pet = await getPet(petId, location);

  if (pet.error) {
    return buildResp(pet.error);
  } else {
    return buildResp({ body: pet });
  }
}
export async function fetchPets(request) {
  const { location, status } = getQueryParams(request.url);

  if (!location) {
    return buildResp({ body: { error: 'Missing location' }, status: 400 });
  }
  const petsCache = Object.values(await getPets(location));

  if (!petsCache.length) {
    return buildResp({ body: [] });
  }

  return buildResp({
    body: status ? filterByStatus(petsCache, status) : petsCache,
  });
}

export async function patchPet(request) {
  const newPet = await request.json();
  const petId = extractUUID(request.url);
  newPet.id = petId;
  const testRes = validateBody(newPet, ['id', 'location']);
  if (testRes) return testRes;

  const { id, location } = newPet;
  const pets = await getPets(location);

  const oldPet = pets[id];

  if (!oldPet) {
    return new Response('Pet not found', {
      status: 404,
    });
  }

  if (newPet.name) {
    oldPet.name = newPet.name;
  }
  if (newPet.status) {
    oldPet.status = newPet.status;
  }

  await savePet(newPet);
  return buildResp({ body: oldPet });
}

export async function deletePet(request) {
  const { location } = getQueryParams(request.url);
  if (!location) {
    return buildResp({ body: { error: 'Location is required' }, status: 400 });
  }

  const petId = extractUUID(request.url);
  if (!petId) {
    return buildResp({ body: { error: 'Pet ID is invalid' }, status: 400 });
  }

  for (let adoption of Object.values(await getAdoptions(location))) {
    if (adoption.status === 'available' && adoption.pets.includes(petId)) {
      return buildResp({
        body: { error: `Pet '${petId}' is onhold` },
        status: 400,
      });
    }
  }
  const pathName = `${folder}/${location}/${petId}`;
  await del(pathName);

  return buildResp({ body: { message: 'Pet removed: ' + petId } });
}

export async function deletePets(request) {
  const { location } = getQueryParams(request.url);
  if (!location) {
    return buildResp({ body: { error: 'Location is required' } });
  }
  const pathName = `${folder}/${location}`;
  await del(pathName);
  await deleteAdoptions(request);
  return buildResp({ body: { message: 'Removed' } });
}

export async function createPet(request) {
  const pet = await request.json();
  pet.id = uuid();
  pet.status = 'available';

  const testRes = validateBody(pet, ['name', 'location']);
  if (testRes) return testRes;

  await savePet(pet);
  return buildResp({ body: pet, status: 201 });
}
