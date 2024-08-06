const express = require("express");
const router = express.Router();
const EventController = require("../controllers/EventController");
const CandidatureController = require("../controllers/CandidatureController");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

// Route for rendering events, requires admin access
router.get("/events", isAuthenticated, isAdmin, EventController.showEventsPage);
router.get("/events-management", isAuthenticated, isAdmin, (req,res)=>res.render('events-management'));

// Route for rendering a specific event, requires authentication
router.get("/event/:id", isAuthenticated, EventController.showEventPage);

// Other routes...
router.get("/", EventController.showHomePage);

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/category", (req, res) => {
  res.render("category");
});

router.get("/speakers", (req, res) => {
  res.render("speakers");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

router.get("/404", (req, res) => {
  res.render("404");
});


router.post('/candidature/:evenement_id', isAuthenticated, CandidatureController.addCandidature);
module.exports = router;
