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
async function initializeDatabase() {
  if (env == 'production') {
    await loadSecrets()
  }
  console.log('Secrets loaded.')
  config = {
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_DB_PORT,
    dialect: 'mysql'
  }
  sequelize = new Sequelize(config.database, config.username, config.password, config)
  try {
    await sequelize.authenticate()
    await sequelize.sync() // 欲重跑 model 加入 { force: true }
    console.log('Table created successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) == '.js');
    })

    .forEach(file => {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });

  Object.keys(db).forEach(modelName => {
    if (modelName !== "sequelize" && modelName !== "Sequelize" && db[modelName].associate) {
      db[modelName].associate(db);
    }
  })

  db.sequelize = sequelize
  db.Sequelize = Sequelize
}

// 使用互動模組提取 models 路徑

db.initializeDatabase = initializeDatabase

module.exports = db
