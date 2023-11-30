if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const path = require('path')
const handlebars = require('express-handlebars')
const port = process.env.PORT || 3000
const routes = require('./routes')
const session = require('express-session')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const passport = require('./config/passport')
const { getUser } = require('./helpers/auth-helpers')
const app = express()
const client = require('./config/redis')
const RedisStore = require('connect-redis').default

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))

let redisStore = new RedisStore({ client })
app.use(session({
  store: redisStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  rolling: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000 * 24,
    // secure: process.env.NODE_ENV === 'production',
    secure: false,
    httpOnly: true,
    sameSite: 'lax'
  }
}))

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

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