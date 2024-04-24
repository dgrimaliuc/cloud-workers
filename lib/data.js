const originBlacklist = [];

// TODO implement
const allowedResourceHosts = ['hdrezka.ag'];

const originWhitelist = [
  'https://neon-stream.web.app',
  'https://neonstream.vercel.app',
];

const requiredHeaders = ['origin'];

module.exports = {
  originBlacklist,
  originWhitelist,
  requiredHeaders,
  allowedResourceHosts,
};
