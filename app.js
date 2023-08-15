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

app.use(express.urlencoded({ extended: true }))

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))

app.use(flash())

app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // res.locals設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // res.locals設定 warning_msg 訊息
  // res.locals.user = getUser(req) // 把 user 變數設放到 res.locals 裡讓所有的 view 都能存取
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`listening on port ${port}`)
})

module.exports = app