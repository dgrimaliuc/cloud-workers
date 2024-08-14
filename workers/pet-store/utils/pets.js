// import { put, list } from '@vercel/blob';
import { extractUUID, filterByStatus, getQueryParams, validateBody } from './request';
import { buildResp } from '../../../lib/response';
import { get, patch, del } from '../../../lib/firebase';

const { v4: uuid } = require('uuid');
const folder = 'articles/pets';

export async function getPets(location) {
  const pathName = `${folder}/${location}`;
  const pets = await get(pathName);

  if (!pets) {
    return {};
  } else {
    return pets;
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

export async function deletePets(request) {
  const { location } = getQueryParams(request.url);
  if (!location) {
    return buildResp({ body: { error: 'Location is required' } });
  }
  const pathName = `${folder}/${location}`;
  await del(pathName);
  return buildResp({ body: { message: 'Removed' } });
}

export async function createPet(request) {
  const pet = await request.json();
  pet.id = uuid();
  pet.status = 'available';

  const testRes = validateBody(pet, ['name', 'location']);
  if (testRes) return testRes;

  await savePet(pet);
  return buildResp({ body: pet });
}
