const url = require('url');
const {
  verifyRequiredHeaders,
  verifyURLProvided,
  verifyURL,
  verifyHostName,
  verifyBlacklist,
  verifyWhitelist,
  verifyResourceHost,
} = require('./validation');
const { validateRequest } = require('./midleware');

function parseEnvList(env, defaultValue = []) {
  if (!env) {
    return defaultValue;
  }
  return env.split(',');
}

const extractURL = (req, payload) => {
  const startIndex = req.url.lastIndexOf('http');
  payload.url = req.url.substring(startIndex);
  payload.error = 'Failed to extract URL';
  return true;
};

const extractLocation = (_, payload) => {
  payload.location = parseURL(payload.url);
  payload.error = 'Failed to extract Location from: ' + payload.url;
  return !!payload.location;
};

const extractHeaders = (req, payload) => {
  payload.headers = req.headers;
  payload.error = 'Failed to extract headers.';
  return !!payload.headers;
};

const errorMessage = (...messages) => {
  return {
    message: messages.filter(it => it !== '' && typeof it !== 'object').join(' '),
  };
};

function parseURL(req_url) {
  var match = req_url.match(
    /^(?:(https?:)?\/\/)?(([^\/?]+?)(?::(\d{0,5})(?=[\/?]|$))?)([\/?][\S\s]*|$)/i,
  );
  //                              ^^^^^^^          ^^^^^^^^      ^^^^^^^                ^^^^^^^^^^^^
  //                            1:protocol       3:hostname     4:port                 5:path + query string
  //                                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //                                            2:host
  if (!match) {
    return null;
  }
  if (!match[1]) {
    if (/^https?:/i.test(req_url)) {
      // The pattern at top could mistakenly parse "http:///" as host="http:" and path=///.
      return null;
    }
    // Scheme is omitted.
    if (req_url.lastIndexOf('//', 0) === -1) {
      // "//" is omitted.
      req_url = '//' + req_url;
    }
    req_url = (match[4] === '443' ? 'https:' : 'http:') + req_url;
  }
  var parsed = url.parse(req_url);
  if (!parsed.hostname) {
    // "http://:1/" and "http:/notenoughslashes" could end up here.
    return null;
  }
  return parsed;
}

/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
async function readRequestBody(request) {
  const contentType = request.headers.get('content-type') ?? request.headers.get('Content-Type');

  if (contentType === null) {
    return undefined;
  }
  if (contentType.includes('application/json')) {
    return JSON.stringify(await request.json());
  } else if (contentType.includes('application/text')) {
    return request.text();
  } else if (contentType.includes('text/html')) {
    return request.text();
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await request.formData();
    return new URLSearchParams(formData);
  } else if (contentType.includes('form')) {
    const formData = await request.formData();
    const body = {};
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }
    return JSON.stringify(body);
  } else {
    throw new Error(`Content-Type ${contentType} not supported`);
  }
}

function makeAssertions(req) {
  const payload = {};
  const validations = [
    {
      action: verifyRequiredHeaders,
      status: 400,
    },
    {
      action: verifyURLProvided,
      status: 400,
    },
    {
      action: extractURL,
      status: 400,
    },
    {
      action: verifyURL,
      status: 400,
    },
    {
      action: extractLocation,
      status: 400,
    },
    {
      action: verifyHostName,
      status: 404,
    },
    {
      action: extractHeaders,
      status: 500,
    },
    {
      action: verifyBlacklist,
      status: 403,
    },
    {
      action: verifyWhitelist,
      status: 403,
    },
    {
      action: verifyResourceHost,
      status: 403,
    },
  ];

  return validateRequest({ req, payload, validations });
}

module.exports = {
  makeAssertions,
  readRequestBody,
  parseEnvList,
  extractURL,
  errorMessage,
  extractLocation,
  extractHeaders,
  parseURL,
};
