'use strict'
const dotenv = require('dotenv')
dotenv.config()
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config')[env]
const db = {}
const { loadSecrets } = require('../helpers/loadSecrets')

if (process.env.NODE_ENV === 'production') {
  loadSecrets().then(() => {
    console.log('Secrets loaded')
  }).catch(err => {
    console.error('Error loading secrets:', err)
  })
}

console.log(process.env.RDS_HOSTNAME)
console.log(`Using environment: ${env}`)
console.log(`Database host is set to: ${config.host}`)

// 資料庫連線
let sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  port: config.port,
  logging: env === "production" ? console.log : false
})

// 動態引入其他 models
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

// 設定 Models 之間的關聯
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

async function runSeeders() {
  const usersCount = await db.User.count()
  if (usersCount === 0) {
    console.log('Running seeders...')
    await require('../seeders/20230523031140-users-seed-file').up(sequelize.getQueryInterface(), Sequelize)
    await require('../seeders/20230525092648-categories-seed-file').up(sequelize.getQueryInterface(), Sequelize)
    await require('../seeders/20230525092649-restaurants-seed-file').up(sequelize.getQueryInterface(), Sequelize)
    await require('../seeders/20230527154731-user-comment-seed').up(sequelize.getQueryInterface(), Sequelize)
    console.log('Seeders have been executed successfully.')
  } else {
    console.log('Database already has data. Skipping seeders.')
  }
}

// 初始化數據庫和運行 seeders
async function initializeDatabase() {
  try {

    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    await sequelize.sync({ force: true })  // 在開發環境中可考慮使用 { force: true }
    console.log('All models were synchronized successfully.')
    await runSeeders()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

// 匯出需要的物件
db.sequelize = sequelize
db.Sequelize = Sequelize
db.initializeDatabase = initializeDatabase

module.exports = db
