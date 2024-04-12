const withAuth = (req, res, next) => {
  if (!req.session.loggedIn) {
    res.redirect('/login');
  }
  next();
};

exports.withAuth = withAuth;
