const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const path = require('path')
const handlebars = require('express-handlebars')
const session = require('express-session')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const passport = require('./config/passport')
const { getUser } = require('./helpers/auth-helpers')
const app = express()
const client = require('./config/redis')
const RedisStore = require('connect-redis').default
const { loadSecrets } = require('./helpers/loadSecrets')

  (async () => {
    if (process.env.NODE_ENV == 'production') {
      await loadSecrets()
      console.log(process.env.RDS_HOSTNAME)
    }

    const db = require('./models')
    db.initializeDatabase().then(() => {
      console.log('Database initialization is complete.')
    })

    // 設置模板引擎
    const handlebarsHelpers = require('./helpers/handlebars-helpers')
    app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
    app.set('view engine', 'hbs')

    // 設置中間件
    app.use(express.urlencoded({ extended: true }))
    let redisStore = new RedisStore({ client })
    app.use(session({
      store: redisStore,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60 * 60 * 1000 * 24,
        secure: false,
        httpOnly: true,
        sameSite: 'lax'
      }
    }))

    app.use(flash())
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(methodOverride('_method'))

    // 設置靜態檔案路徑
    app.use('/upload', express.static(path.join(__dirname, 'upload')))

    // 設置全局變量
    app.use((req, res, next) => {
      res.locals.success_messages = req.flash('success_messages')
      res.locals.error_messages = req.flash('error_messages')
      res.locals.user = getUser(req)
      next()
    })

    // 引入路由
    const routes = require('./routes')
    app.use(routes)

    // 監聽端口
    const port = process.env.PORT || 3000
    app.listen(port, () => {
      console.info(`listening on port ${port}`)
    })
  })()

module.exports = app