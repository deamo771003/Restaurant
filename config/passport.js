const dotenv = require('dotenv');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');
const { User, Restaurant } = require('../models');

// 引入 dotenv 和執行環境變量配置
dotenv.config();

// 引入異步加載秘密的函數
const { loadSecrets } = require('../helpers/loadSecrets');

// 定義異步初始化函數來設置 Passport 策略
async function initializePassport() {
  if (process.env.NODE_ENV === 'production') {
    await loadSecrets();
  }

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    (req, email, password, cb) => {
      User.findOne({ where: { email } })
        .then(user => {
          if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'));
          bcrypt.compare(password, user.password)
            .then(res => {
              if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'));
              return cb(null, user);
            });
        })
        .catch(err => cb(err));
    }));

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json;
    User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          return done(null, user);
        }
        const randomPassword = Math.random().toString(36).slice(-8);
        return bcrypt.hash(randomPassword, 10)
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false));
      })
      .catch(err => done(err, false));
  }));

  passport.serializeUser((user, cb) => cb(null, user.id));
  passport.deserializeUser((id, cb) => {
    User.findByPk(id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: Restaurant, as: 'LikedRestaurants' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then(user => cb(null, user.toJSON()))
      .catch(err => cb(err));
  });
}

// 導出一個函數以便可以在外部初始化
module.exports = initializePassport;
