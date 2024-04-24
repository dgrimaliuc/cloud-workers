const streamParams = {
  id: '66771',
  translator_id: '474',
  is_camrip: '0',
  is_ads: '0',
  is_director: '0',
  favs: '9c7a77c1-1ed6-462f-80dd-4ea478c1f18b',
  action: 'get_movie',
};

const streamURL = 'https://hdrezka.ag/ajax/get_cdn_series/?t=1713247286067';
const urlHTML = 'https://hdrezka.ag/engine/ajax/search.php?q=%2Btt3359350';
const requiredHeaders = { Origin: 'https://neon-stream.web.app' };

module.exports = {
  requiredHeaders,
  streamParams,
  streamURL,
  urlHTML,
};
