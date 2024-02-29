'use strict';
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv')
  dotenv.config()
}
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};
const { loadSecrets } = require('../helpers/loadSecrets');

let sequelize;

async function initialize() {
  // if (env == 'production') {
  //   await loadSecrets()
  //   console.log(process.env.RDS_HOSTNAME)
  //   console.log('Secrets loaded.')
  // }

  console.log(`Using environment: ${env}`);
  console.log(`Database host is set to: ${config.host}`);

  sequelize = new Sequelize(config.database, config.username, config.password, config);

  fs.readdirSync(__dirname)
    .filter(file => {
      return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    })
    .forEach(file => {
      const modelPath = path.join(__dirname, file);
      const model = require(modelPath)(sequelize, Sequelize.DataTypes);
      if (model && model.name) {
        console.log(`Model loaded: ${model.name}`);
        db[model.name] = model;
      } else {
        console.log(`Failed to load model from file: ${file}`);
      }
    });

  console.log('Associating models...');
  Object.keys(db).forEach(modelName => {
    if (db[modelName] && db[modelName].associate) {
      console.log(`Associating model: ${modelName}`);
      db[modelName].associate(db);
    } else if (!db[modelName]) {
      console.log(`Model ${modelName} is not loaded correctly.`);
    } else {
      console.log(`No associations for model: ${modelName}`);
    }
  });

  await initializeDatabase();
}

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: env !== 'production' });
    console.log('All models were synchronized successfully.');
    await runSeeders();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

async function runSeeders() {
  const usersCount = await db.User.count();
  if (usersCount === 0) {
    console.log('Running seeders...');
    await require('../seeders/20230523031140-users-seed-file').up(sequelize.getQueryInterface(), Sequelize);
    await require('../seeders/20230525092648-categories-seed-file').up(sequelize.getQueryInterface(), Sequelize);
    await require('../seeders/20230525092649-restaurants-seed-file').up(sequelize.getQueryInterface(), Sequelize);
    await require('../seeders/20230527154731-user-comment-seed').up(sequelize.getQueryInterface(), Sequelize);
    console.log('Seeders have been executed successfully.');
  } else {
    console.log('Database already has data. Skipping seeders.');
  }
}

initialize();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
