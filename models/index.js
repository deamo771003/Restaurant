'use strict'
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv')
  dotenv.config()
}
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
let config = require('../config/config')[env]
const db = {}
const { loadSecrets } = require('../helpers/loadSecrets')

let sequelize

async function initialize() {
  if (env == 'production') {
    await loadSecrets()
    console.log('Secrets loaded.')
    config = {
      username: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DB_NAME,
      host: process.env.RDS_HOSTNAME,
      port: process.env.RDS_DB_PORT,
      dialect: 'mysql'
    }
    console.log(`RDS_HOSTNAME=${process.env.RDS_HOSTNAME}`)
  }

  sequelize = new Sequelize(config.database, config.username, config.password, config);

  // 使用互動模組提取 models 路徑
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) == '.js');
    })
  console.log(`filter.file=${file}`)
    .forEach(file => {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  })

  // await initializeDatabase()
}

// async function initializeDatabase() {
//   try {
//     await sequelize.authenticate()
//     console.log('Connection has been established successfully.')
//     await sequelize.sync({ force: true })
//     console.log('All models were synchronized successfully.')
//     await runSeeders()
//   } catch (error) {
//     console.error('Unable to connect to the database:', error)
//   }
// }

// async function runSeeders() {
//   const usersCount = await db.User.count()
//   if (usersCount == 0) {
//     console.log('Running seeders...')
//     await require('../seeders/20230523031140-users-seed-file').up(sequelize.getQueryInterface(), Sequelize)
//     await require('../seeders/20230525092648-categories-seed-file').up(sequelize.getQueryInterface(), Sequelize)
//     await require('../seeders/20230525092649-restaurants-seed-file').up(sequelize.getQueryInterface(), Sequelize)
//     await require('../seeders/20230527154731-user-comment-seed').up(sequelize.getQueryInterface(), Sequelize)
//     console.log('Seeders have been executed successfully.')
//   } else {
//     console.log('Database already has data. Skipping seeders.')
//   }
// }

initialize()

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
