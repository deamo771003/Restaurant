if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv')
  dotenv.config()
}
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')
const { loadSecrets } = require('../helpers/loadSecrets')

async function initializePassport() {
  // 在生產環境中異步加載秘密
  if (process.env.NODE_ENV == 'production') {
    await loadSecrets();
  }

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, cb) => {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'));
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'));
      }
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }));

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, async (accessToken, refreshToken, profile, done) => {
    const { email, name } = profile._json;
    try {
      let user = await User.findOne({ where: { email } });
      if (user) {
        return done(null, user);
      }
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await User.create({ name, email, password: hashedPassword });
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }));

  passport.serializeUser((user, cb) => cb(null, user.id));
  passport.deserializeUser(async (id, cb) => {
    try {
      const user = await User.findByPk(id, {
        include: [
          { model: Restaurant, as: 'FavoritedRestaurants' },
          { model: Restaurant, as: 'LikedRestaurants' },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      });
      cb(null, user.toJSON());
    } catch (err) {
      cb(err);
    }
  });
}

module.exports = initializePassport
