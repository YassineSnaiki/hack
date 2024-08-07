const express = require("express");
const router = express.Router();
const EventController = require("../controllers/EventController");
const CandidatureController = require("../controllers/CandidatureController");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  }
});

const upload = multer({ storage: storage });


// Route for rendering events, requires admin access
router.get("/events", isAuthenticated, isAdmin, EventController.showEventsPage);


// Route for rendering a specific event, requires authentication
router.get("/event/:id", isAuthenticated, EventController.showEventPage);

//add event
router.post('/addevent', EventController.addEvent);


// Update an existing event
router.post('/updateevent', EventController.updateEvent);

// Route for deleting an event
router.delete('/deleteevent/:id', EventController.deleteEvent);


router.patch('/modifyevent/:id', upload.single('image_url'), EventController.updateEvent);


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

router.get('/candidatures', isAuthenticated, isAdmin, CandidatureController.getCandidatures);
router.post('/candidature/:id/accept', isAuthenticated, isAdmin, CandidatureController.acceptCandidature);
router.post('/candidature/:id/refuse', isAuthenticated, isAdmin, CandidatureController.refuseCandidature);
router.post('/candidature/:evenement_id', isAuthenticated, CandidatureController.addCandidature);


module.exports = router;


