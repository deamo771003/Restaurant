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
const Category = require('./category')
const Comment = require('./comment')
const Favorite = require('./favorite')
const Followship = require('./followship')
const Like = require('./like')
const Restaurant = require('./restaurant')
const User = require('./user')

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
  const sequelize = new Sequelize(config.database, config.username, config.password, config)

  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')

    // 使用互動模組提取 models 路徑
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

    await sequelize.sync() // 欲重跑 model 加入 { force: true }
    console.log('Table created successfully.')

    db.sequelize = sequelize
    db.Sequelize = Sequelize
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

db.initializeDatabase = initializeDatabase

module.exports = {
  db,
  Category,
  Comment,
  Favorite,
  Followship,
  Like,
  Restaurant,
  User
}
