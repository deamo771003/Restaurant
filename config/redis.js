const redis = require('redis')
const { loadSecrets } = require('../helpers/loadSecrets');

(async () => {
  if (process.env.NODE_ENV == 'production') {
    await loadSecrets()
    console.log(process.env.REDIS_URL)
  }

  const client = redis.createClient({ url: process.env.REDIS_URL })

  await client.connect()

  client.on('ready', () => {
    console.log('Redis client is ready.')
  });

  client.on('connect', () => {
    console.log('Redis client has connected to the server.')
  });

  client.on('error', (err) => {
    console.error('Redis err:', err)
  });

  client.on('end', () => {
    console.log('Redis connection closed.')
  });

  // Uncomment if needed
  // client.on('reconnecting', () => {
  //   console.log('Redis client is reconnecting.');
  // });

  module.exports = client
})();
