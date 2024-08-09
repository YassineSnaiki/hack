const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  req.flash("error_msg", "Vous devez etre authentifié.");
  res.redirect("/login");
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  req.flash("error_msg", "Vous devez etre un admin.");
  res.redirect("/");
};

module.exports = { isAuthenticated, isAdmin };
