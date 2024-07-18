import { extractUUID, filterByStatus, getQueryParams, validateBody } from './request';

import { getPets, savePets } from './pets';
import { buildResp } from '../../../lib/response';
import { del, get, patch } from '../../../lib/firebase';
const { v4: uuid } = require('uuid');

const folder = 'articles/adoptions';

// Trigger other events based on status change. And update the status
// requested -> rejected | available
// available -> denied | adopted
// adopted -> END
// rejected -> END
// denied -> END

async function getAdoptions(location) {
  const pathName = `${folder}/${location}`;
  const adoptions = await get(pathName);

  if (!adoptions) {
    return {};
  } else {
    return adoptions;
  }
}

async function saveAdoption(adoption) {
  const pathName = `${folder}/${adoption.location}`;
  return await patch(pathName, adoption);
}

export async function fetchAdoptions(request) {
  const { location, status } = getQueryParams(request.url);

  if (!location) {
    return buildResp({ body: { error: 'Missing location' }, status: 400 });
  }
  const adoptionsCache = Object.values(await getAdoptions(location));

  if (!adoptionsCache.length) {
    return buildResp({ body: [] });
  }

  return buildResp({
    body: status ? filterByStatus(adoptionsCache, status) : adoptionsCache,
  });
}

// Change status to DENIED or ADOPTED
export async function patchAdoption(request) {
  const newAdoption = await request.json();
  const adoptionId = extractUUID(request.url);
  newAdoption.id = adoptionId;
  const testRes = validateBody(newAdoption, ['id', 'location']);
  if (testRes) return testRes;

  const { id, location } = newAdoption;

  const adoptions = await getAdoptions(location);

  const oldAdoption = adoptions[id];

  if (!oldAdoption) {
    return buildResp({ body: { error: 'Adoption not found' }, status: 404 });
  }

  if (newAdoption.status && ['denied', 'approved'].includes(newAdoption.status)) {
    oldAdoption.status = newAdoption.status;
  } else {
    return buildResp({
      body: { error: 'Invalid status: ' + newAdoption.status },
      status: 400,
    });
  }

  const pets = Object.values(await getPets(location));
  if (newAdoption.status === 'approved') {
    pets.forEach(pet => {
      if (oldAdoption.pets.includes(pet.id)) {
        pet.status = 'adopted';
      }
    });
  } else if (newAdoption.status === 'denied') {
    pets.forEach(pet => {
      if (oldAdoption.pets.includes(pet.id)) {
        pet.status = 'available';
      }
    });
  }
  await savePets(location, pets);
  await saveAdoption(oldAdoption);
  return buildResp({ body: oldAdoption });
}

export async function deleteAdoptions(request) {
  const { location } = getQueryParams(request.url);
  if (!location) {
    return buildResp({ body: { error: 'Location is required' } });
  }

  const pathName = `${folder}/${location}`;
  const pets = Object.values(await getAdoptions(location)).flatMap(adoption => adoption.pets);
  const validPets = await getPets(location);
  pets.forEach(pet => {
    validPets[pet].status = 'available';
  });
  await savePets(location, validPets);
  await del(pathName);
  return buildResp({ body: { message: 'Removed' } });
}

export async function createAdoption(request) {
  const adoption = await request.json();
  adoption.id = uuid();
  adoption.status = 'available';

  const testRes = validateBody(adoption, ['pets', 'location']);
  if (testRes) return testRes;

  const location = adoption.location;
  let validPets = await getPets(location);
  const invalidPets = adoption.pets.filter(id => !validPets[id]);
  const petsToAdopt = adoption.pets.map(id => validPets[id]);

  if (invalidPets.length) {
    return buildResp({
      body: { error: 'Invalid pets: ' + invalidPets },
      status: 400,
    });
  }

  const petsNonAvailable = petsToAdopt
    .filter(pet => pet.status !== 'available')
    .map(pet => {
      return { id: pet.id, message: pet.status };
    });

  if (petsNonAvailable.length) {
    adoption.status = 'rejected';
  }
  validPets = Object.values(validPets);
  if (adoption.status !== 'rejected') {
    validPets.forEach(pet => {
      if (adoption.pets.includes(pet.id)) {
        pet.status = 'onhold';
      }
    });
    await savePets(location, validPets);
  } else {
    adoption.reasons = petsNonAvailable;
  }

  await saveAdoption(adoption);
  return buildResp({ body: adoption, status: 201 });
}
