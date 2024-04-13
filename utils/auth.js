const auth = (req, res, next) => {
  if (!req.session.loggedIn) {
    res.redirect('/login');
  }
  next();
};

exports.auth = auth;
