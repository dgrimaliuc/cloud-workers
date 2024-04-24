const {
  originBlacklist,
  originWhitelist,
  requiredHeaders,
  allowedResourceHosts,
} = require('./data.js');
const { regexp_tld } = require('./regexp-top-level-domain.js');
const net = require('net');

const verifyRequiredHeaders = (req, payload) => {
  let found = [];
  for (const key of req.headers.keys()) {
    if (requiredHeaders.includes(key.toLowerCase())) {
      found.push(key.toLowerCase());
    }
  }

  payload.error = 'Missing required headers: ' + requiredHeaders;
  return requiredHeaders.length == 0 || found.length === requiredHeaders.length;
};

const verifyURLProvided = (req, payload) => {
  payload.error = 'No URL specified: ' + req.url;
  return req.url.lastIndexOf('http') > 3;
};

const verifyURL = (_, payload) => {
  payload.error = `Invalid URL provided: ${payload.url}`;
  return /https?:\/\/.+/i.test(payload.url);
};

const verifyWhitelist = (_, payload) => {
  const origin = payload.headers.get('origin');
  payload.error = `The Origin is not whitelisted in this proxy: ${origin}`;
  return originWhitelist.length === 0 || originWhitelist.includes(origin);
};

const verifyResourceHost = (_, payload) => {
  payload.error = `The resource host is not allowed: `;
  return (
    allowedResourceHosts.length === 0 ||
    allowedResourceHosts.includes(payload.location.host)
  );
};

function verifyHostName(_, payload) {
  const host = payload.location.hostname;
  payload.error = 'Invalid host: ' + host;
  return !!(regexp_tld.test(host) || net.isIPv4(host) || net.isIPv6(host));
}

function verifyBlacklist(_, payload) {
  const origin = payload.headers.get('origin');
  payload.error = `The origin was blacklisted by the operator of this proxy.`;
  return originBlacklist.indexOf(origin) < 0;
}

module.exports = {
  verifyRequiredHeaders,
  verifyURLProvided,
  verifyResourceHost,
  verifyURL,
  verifyWhitelist,
  verifyHostName,
  verifyBlacklist,
};
