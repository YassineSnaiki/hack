const { body, validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs").promises;
const Event = require("../models/Event");
const Speaker = require("../models/Speaker");
const Program = require("../models/Program");
const Candidature = require("../models/Candidature");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});

const upload = multer({ storage: storage });

// Show all events page
module.exports.showEventsPage = async (req, res) => {
  try {
    const events = await Event.getAllEvents();
    res.render("events", { events });
  } catch (err) {
    console.error("Error fetching events:", err);
    req.flash("error_msg", "Error fetching events.");
    res.redirect("/");
  }
};

module.exports.showModifyPage = async (req, res) => {
  try {
    const id = req.params.id;
    const event = await Event.getEventById(id);
    res.render("modifyevent", { event });
  } catch (err) {
    console.error("Error fetching events:", err);
    req.flash("error_msg", "Error fetching events.");
    res.redirect("/");
  }
};

// Show home page
module.exports.showHomePage = async (req, res) => {
  try {
    // Fetch events data
    const events = await Event.getAllEvents();

    // Fetch news data from the JSON file
    const newsFilePath = path.join(__dirname, "../data/news.json"); // Adjust the path if needed
    const newsData = await fs.readFile(newsFilePath, "utf8");
    const newsArray = JSON.parse(newsData);

    // Render the home page with both events and news data
    res.render("home", { events, news: newsArray });
  } catch (err) {
    console.error("Error fetching events or news:", err);
    req.flash("error_msg", "Error fetching events or news.");
    res.redirect("/");
  }
};

// Show specific event page
module.exports.showEventPage = async (req, res) => {
  const { id } = req.params; // Use req.params for route parameters
  try {
    const event = await Event.getEventById(id);
    const speakers = await Speaker.getByEventId(id);
    const programmes = await Program.getByEventId(id);

    // Extract unique days
    const uniqueDays = [...new Set(programmes.map((program) => program.jour))];

    const dayWiseProgrammes = {};
    for (let programme of programmes) {
      const day = programme.jour;
      if (!dayWiseProgrammes[day]) {
        dayWiseProgrammes[day] = [];
      }

      // Parse the plan JSON
      const activities = programme.plan;

      for (let activity of activities) {
        const speaker = await Speaker.getById(activity.speaker_id);
        dayWiseProgrammes[day].push({
          activity: activity.activity,
          time: activity.time,
          speakerName: `${speaker.nom} ${speaker.prenom}`,
          speakerImage: speaker.image_url,
        });
        dayWiseProgrammes[day].sort((a, b) => {
          // You may need to implement a more specific time parsing/comparison if needed
          return (
            new Date("1970/01/01 " + a.time) - new Date("1970/01/01 " + b.time)
          );
        });
      }
    }

    let candidatureExists = false;
    if (req.user) {
      const user_id = req.user.id;
      const existingCandidature = await Candidature.getByUserIdAndEventId(
        user_id,
        id
      );
      candidatureExists = existingCandidature.length > 0;
    }

    if (event) {
      res.render("event", {
        event,
        user: req.user,
        speakers,
        uniqueDays,
        dayWiseProgrammes,
        candidatureExists, // Pass the candidature status to the view
      });
    } else {
      req.flash("error_msg", "Event not found.");
      res.redirect("/events");
    }
  } catch (err) {
    console.error("Error fetching event:", err);
    req.flash("error_msg", "Error fetching event.");
    res.redirect("/events");
  }
};
module.exports.showProgramPage = async (req, res) => {
  const { id } = req.params;
  try {
    const speakers = await Speaker.getByEventId(id);
    const programmes = await Program.getByEventId(id);

    const uniqueDays = [...new Set(programmes.map((program) => program.jour))];

    const dayWiseProgrammes = {};
    for (let programme of programmes) {
      const day = programme.jour;
      if (!dayWiseProgrammes[day]) {
        dayWiseProgrammes[day] = [];
      }

      const activities = programme.plan;
      for (let activity of activities) {
        const speaker = await Speaker.getById(activity.speaker_id);
        dayWiseProgrammes[day].push({
          activity: activity.activity,
          time: activity.time,
          speakerName: `${speaker.nom} ${speaker.prenom}`,
          speakerImage: speaker.image_url,
        });
        dayWiseProgrammes[day].sort((a, b) => {
          return (
            new Date("1970/01/01 " + a.time) - new Date("1970/01/01 " + b.time)
          );
        });
      }
    }

    res.render("program", {
      speakers,
      uniqueDays,
      dayWiseProgrammes,
    });
  } catch (err) {
    console.error("Error fetching program data:", err);
    req.flash("error_msg", "Error fetching program data.");
    res.redirect("/events");
  }
};

const validateTime = (value) => {
  return !value || /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
};

module.exports.addEvent = [
  upload.single("image_url"), // Handle single file upload

  body("titre")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long")
    .trim()
    .escape(),
  body("apercu")
    .isLength({ min: 3 })
    .withMessage("Apercu must be at least 3 characters long")
    .trim()
    .escape(),
  body("description").optional().trim().escape(),
  body("date_debut")
    .isISO8601()
    .withMessage("Date Debut must be a valid ISO date"),
  body("date_fin")
    .optional()
    .custom((value) => {
      if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error("Date Fin must be a valid ISO date");
      }
      return true;
    }),
  body("time")
    .optional()
    .custom((value) => {
      if (value && !validateTime(value)) {
        throw new Error("Time must be a valid time in HH:MM format");
      }
      return true;
    }),
  body("lieu")
    .isLength({ min: 3 })
    .withMessage("Lieu must be at least 3 characters long")
    .trim()
    .escape(),
  body("observations").optional().trim().escape(),
  body("participation").optional().trim().escape(),
  body("info_add").optional().trim().escape(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array()); // Log the validation errors
      req.flash(
        "error_msg",
        errors.array().map((err) => err.msg)
      );
      return res.redirect("/events");
    }

    const {
      titre,
      apercu,
      description,
      date_debut,
      date_fin,
      time,
      lieu,
      observations,
      participation,
      info_add,
    } = req.body;

    // Handle image URL
    const imageUrl = req.file ? `/img/${req.file.filename}` : null;

    // Set date_fin and time to null if not defined
    const finalDateFin = date_fin ? date_fin : null;
    const finalTime = time ? time : null;

    try {
      await Event.addEvent(
        titre,
        apercu,
        description,
        imageUrl,
        date_debut,
        finalDateFin,
        finalTime,
        lieu,
        observations,
        participation,
        info_add
      );
      req.flash("success_msg", "Event added successfully.");
      res.redirect("/events");
    } catch (err) {
      console.error("Error adding event:", err);
      req.flash("error_msg", "Error adding event.");
      res.redirect("/events");
    }
  },
];

module.exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    await Event.deleteEvent(id);
    req.flash("success_msg", "Event deleted successfully.");
    res.redirect("/events");
  } catch (err) {
    console.error("Error deleting event:", err);
    req.flash("error_msg", "Error deleting event.");
    res.redirect("/events");
  }
};

module.exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const {
    titre,
    apercu,
    description,
    date_debut,
    date_fin,
    time,
    lieu,
    observations,
    participation,
    info_add,
  } = req.body;

  // Handle image URL
  const imageUrl = req.file
    ? `/img/${req.file.filename}`
    : req.body.existing_image;

  try {
    await Event.updateEvent(
      id,
      titre,
      apercu,
      description,
      imageUrl,
      date_debut,
      date_fin,
      time,
      lieu,
      observations,
      participation,
      info_add
    );
    req.flash("success_msg", "Event updated successfully.");
    res.redirect("/events");
  } catch (err) {
    console.error("Error updating event:", err);
    req.flash("error_msg", "Error updating event.");
    res.redirect(`/modifyevent/${id}`);
  }
};
