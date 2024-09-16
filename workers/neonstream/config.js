const localConfig = {
  dev: {
    proxy: 'http://localhost:4040',
    url: 'http://localhost:4001',
  },
  prod: {
    proxy: 'https://...ip-address.../',
    url: 'https://neonstream.nodeapp.workers.dev',
  },
  debug: true,
};

const env =
  process.env.NODE_ENV?.toLocaleLowerCase() === 'dev' ? 'dev' : 'prod';

const config = localConfig[env];

module.exports = { config };
