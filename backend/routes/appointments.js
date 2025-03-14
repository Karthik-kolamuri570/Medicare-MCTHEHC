const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment"); // Appointment model

// Render booking form
router.get("/book", (req, res) => {
  res.render("book_appointment");
});

// Handle booking
router.post("/book", async (req, res) => {
  try {
    const { doctorId, date, time, problem } = req.body;
    const appointment = new Appointment({ doctorId, date, time, problem });
    await appointment.save();
    res.redirect("/notifications");
  } catch (err) {
    res.status(500).send("Error booking appointment");
  }
});

module.exports = router;
