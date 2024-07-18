const originBlacklist = [];

const allowedResourceHosts = ['hdrezka.ag'];

const originWhitelist = ['http://localhost:3030'];
const regexAllowedOrigin = [/http:.*:3030/g, /https:\/\/neon-?stream/g];

const requiredHeaders = ['origin'];

const corsHeaders = {
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};
const corsOptionsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, PATCH, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
};

module.exports = {
  corsHeaders,
  corsOptionsHeaders,
  regexAllowedOrigin,
  originBlacklist,
  originWhitelist,
  requiredHeaders,
  allowedResourceHosts,
};
