const originBlacklist = [];

const allowedResourceHosts = ["hdrezka.ag"];

const originWhitelist = ["http://localhost:3030"];

const requiredHeaders = ["origin"];

const corsHeaders = {
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
};
const corsOptionsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

module.exports = {
  corsHeaders,
  corsOptionsHeaders,
  originBlacklist,
  originWhitelist,
  requiredHeaders,
  allowedResourceHosts,
};
