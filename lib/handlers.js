const { validateRequest } = require('./midleware.js');
const { extractHeaders, extractLocation, extractURL } = require('./utils.js');
const {
  verifyBlacklist,
  verifyHostName,
  verifyRequiredHeaders,
  verifyURL,
  verifyURLProvided,
  verifyWhitelist,
  verifyResourceHost,
} = require('./validation.js');

function getCorsHandler(req) {
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

module.exports = { getCorsHandler };
