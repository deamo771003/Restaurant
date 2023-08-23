helpers = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/users/signin')

}

// adm
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).is_admin) return next()
    res.redirect('/')
  } else {
    res.redirect('/users/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
