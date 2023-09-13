const redis = require('redis')

const client = redis.createClient(process.env.REDIS_URL)

client.connect()

client.on('ready', () => {
  console.log('Redis client is ready.')
})

client.on('connect', () => {
  console.log('Redis client has connected to the server.')
})

client.on('error', (err) => {
  console.error('Redis err:', err)
})

client.on('end', () => {
  console.error('Redis connection closed.')
})

module.exports = client