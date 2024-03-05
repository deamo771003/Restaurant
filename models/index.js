'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
let config = require('../config/config')[env]
const { loadSecrets } = require('../helpers/loadSecrets')

const db = {}
let sequelize

async function initializeDatabase() {
  try {
    if (env === 'production') {
      await loadSecrets()
    }
    console.log('Secrets loaded.')

    config = {
      username: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DB_NAME,
      host: process.env.RDS_HOSTNAME,
      port: process.env.RDS_PORT,
      dialect: 'mysql',
      logging: false
    }

    sequelize = new Sequelize(config.database, config.username, config.password, config)

    fs.readdirSync(__dirname)
      .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
      })
      .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
        db[model.name] = model
      })

    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate && typeof db[modelName].associate === 'function') {
        db[modelName].associate(db);
      }
    });

    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = { initializeDatabase, db }
