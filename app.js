if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv')
  dotenv.config()
}
const express = require('express')
const path = require('path')
const handlebars = require('express-handlebars')
const session = require('express-session')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const { getUser } = require('./helpers/auth-helpers')
const app = express()
// const client = require('./config/redis')
// const RedisStore = require('connect-redis').default
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const passport = require('./config/passport')
const routes = require('./routes')
const port = process.env.PORT || 3000
const db = require('./models')
const { loadSecrets } = require('./helpers/loadSecrets')

async function startApp() {
  if (process.env.NODE_ENV === 'production') {
    await loadSecrets();
  }

  try {
    await db.initializeDatabase();
    console.log('Database initialization complete.');

    app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }));
    app.set('view engine', 'hbs');

    app.use(express.urlencoded({ extended: true }));
    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60 * 60 * 1000 * 24,
        secure: false,
        httpOnly: true,
        sameSite: 'lax'
      }
    }));

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(methodOverride('_method'));

    app.use('/upload', express.static(path.join(__dirname, 'upload')));

    app.use((req, res, next) => {
      res.locals.success_messages = req.flash('success_messages');
      res.locals.error_messages = req.flash('error_messages');
      res.locals.user = getUser(req);
      next();
    });

    app.use(routes);

    app.listen(port, () => {
      console.info(`App listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to initialize the database or the server:", error);
    process.exit(1);
  }
}

startApp();

module.exports = app
