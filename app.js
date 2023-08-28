if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const path = require('path')
const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const port = process.env.PORT || 3000
const routes = require('./routes')
const session = require('express-session')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const passport = require('./config/passport')
const { getUser } = require('./helpers/auth-helpers')
const SESSION_SECRET = 'secret'

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use(methodOverride('_method'))

app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`listening on port ${port}`)
})

module.exports = app