const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const port = process.env.PORT || 3000
const routes = require('./routes')
const handlebarsHelpers = require('./helpers/handlebars-helpers')

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

app.use(routes)

app.listen(port, () => {
  console.info(`listening on port ${port}`)
})

module.exports = app