const config = {
  dev: {
    db: 'https://petstore-eb41f-default-rtdb.europe-west1.firebasedatabase.app',
    url: 'http://localhost:4444/',
  },
  prod: {
    db: 'https://petstore-eb41f-default-rtdb.europe-west1.firebasedatabase.app',
    url: 'https://pet-store.nodeapp.workers.dev/',
  },
  debug: true,
};

module.exports = { config };
