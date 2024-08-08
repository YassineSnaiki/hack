const express = require("express");
const router = express.Router();
const EventController = require("../controllers/EventController");
const CandidatureController = require("../controllers/CandidatureController");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");
const sendEmail = require("../utils/sendEmail"); 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});

const upload = multer({ storage: storage });

// Route for rendering events, requires admin access
router.get("/events", isAuthenticated, isAdmin, EventController.showEventsPage);
router.get(
  "/modifyevent/:id",
  isAuthenticated,
  isAdmin,
  EventController.showModifyPage
);

// Route for rendering a specific event, requires authentication
router.get("/event/:id", isAuthenticated, EventController.showEventPage);
router.get('/modifyevent/:id/program',isAuthenticated,isAdmin, EventController.showProgramPage);
//add event
router.post("/addevent", EventController.addEvent);

// Update an existing event
router.post("/updateevent", EventController.updateEvent);

// Route for deleting an event
router.delete("/deleteevent/:id", EventController.deleteEvent);

router.patch(
  "/modifyevent/:id",
  upload.single("image_url"),
  EventController.updateEvent
);

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

router.get("/contact",isAuthenticated, (req, res) => {
  res.render("contact");
});

router.get("/404", (req, res) => {
  res.render("404");
});

router.get(
  "/candidatures",
  isAuthenticated,
  isAdmin,
  CandidatureController.getCandidatures
);
router.post(
  "/candidature/:id/accept",
  isAuthenticated,
  isAdmin,
  CandidatureController.acceptCandidature
);
router.post(
  "/candidature/:id/refuse",
  isAuthenticated,
  isAdmin,
  CandidatureController.refuseCandidature
);
router.post(
  "/candidature/:evenement_id",
  isAuthenticated,
  CandidatureController.addCandidature
);


router.post('/send-email', isAuthenticated, async (req, res) => {
  const { subject, message } = req.body;

  try {
      await sendEmail('snaiki282@gmail.com', subject, message);
      req.flash('success_msg', 'Votre message a été envoyé avec succès !');
      res.redirect('/contact');
  } catch (error) {
      req.flash('error_msg', 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.');
      res.redirect('/contact');
  }
});




module.exports = router;
