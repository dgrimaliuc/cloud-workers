import { buildResp } from '../../../lib/response';

export function getQueryParams(url) {
  // Create a URL object from the input URL string
  const parsedUrl = new URL(url);

  // Extract the search parameters using URLSearchParams
  const params = new URLSearchParams(parsedUrl.search);

  // Convert the search parameters to an object
  const queryParams = {};
  for (const [key, value] of params) {
    queryParams[key.toLowerCase()] = value;
  }

  return queryParams;
}

export function filterByStatus(items, status) {
  let statuses = status.split('&');
  return items.filter((item) =>
    statuses.every((s) => {
      if (s.startsWith('!')) {
        return item.status !== s.slice(1);
      } else {
        return item.status === s;
      }
    })
  );
}

export function accumulateByStatus(object, status) {
  return Object.values(object).reduce((acc, item) => {
    if (item.status === status) {
      acc[item.id] = item;
    }
    return acc;
  }, []);
}

export function validateBody(body, props) {
  const errors = props.filter((prop) => !body[prop]);

  if (errors.length > 0) {
    return buildResp({
      body: { error: 'Missing required fields: ' + errors },
      status: 400,
    });
  }

  return null;
}

export function extractUUID(url) {
  // Simplified regular expression to match UUID format
  const regex = /[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}/i;

  // Extract UUID from the URL using regex
  const match = url.match(regex);

  // Return the extracted UUID or null if not found
  return match ? match[0] : null;
}
