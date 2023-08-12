const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const port = process.env.PORT || 3000
const routes = require('./routes')
const session = require('express-session')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const SESSION_SECRET = 'secret'

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))

app.use(flash())

app.use(methodOverride('_method'))

app.use(routes)

app.listen(port, () => {
  console.info(`listening on port ${port}`)
})

module.exports = app