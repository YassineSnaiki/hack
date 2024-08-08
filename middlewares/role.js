const User = require("../models/User"); // Adjust path as needed

const setUserRole = async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      const user = await User.findById(req.user.id);
      res.locals.isAdmin = user && user.role === "admin";
    } catch (err) {
      res.locals.isAdmin = false;
    }
  } else {
    res.locals.isAdmin = false;
  }
  next();
};

module.exports = setUserRole;
