'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const restaurants = []
    for (let i = 0; i <= 50; i++) {
      restaurants.push(
        {
          name: faker.name.findName(),
          tel: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          opening_hours: '08:00',
          image: `https://loremflickr.com/320/240/restaurant,food/?lock=${i + 1}`,
          description: faker.lorem.text(500),
          created_at: new Date(),
          updated_at: new Date(),
          category_id: categories[Math.floor(Math.random() * categories.length)].id
        }
      )
    }
    await queryInterface.bulkInsert('Restaurants', restaurants)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', {})
  }
}