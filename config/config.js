const dotenv = require('dotenv')
dotenv.config()


module.exports = {
  development: {
    username: 'root',
    password: 'password',
    database: 'restaurant_sequelize',
    host: 'mysql',
    dialect: 'mysql',
    port: 3306
  },
  test: {
    username: 'root',
    password: 'password',
    database: 'restaurant_sequelize',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_DB_PORT,
    dialect: 'mysql'
  }
}
