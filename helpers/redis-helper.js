// const client = require('../config/redis')

// const deleteRedisSession = (clientSessionId) => {
//   return new Promise((resolve, reject) => {
//     client.del('sess:' + clientSessionId, (err, reply) => err ? reject(err) : resolve(reply === 1))
//   })
// }

// const addBlackList = (userId) => {
//   return new Promise((resolve, reject) => {
//     client.sadd('blackList', userId, (err, reply) => {
//       err ? reject(err) : resolve(reply)
//     })
//   })
// }

// const checkBlackList = (userId) => {
//   return new Promise((resolve, reject) => {
//     client.sismember('blackList', userId, (err, reply) => {
//       err ? reject(err) : resolve(reply === 1)
//     })
//   })
// }

// module.exports = {
//   deleteRedisSession,
//   addBlackList,
//   checkBlackList
// }
