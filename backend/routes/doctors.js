const express = require("express");
const router = express.Router();
const Doctor = require("./models/doctor"); // Doctor model
const bcrypt = require("bcrypt");
const passport = require("passport");

// Render registration form
router.get("/register", (req, res) => {
  res.render("doctor_register");
});

// Handle registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, specialization, experience, hospital } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = new Doctor({ name, email, password: hashedPassword, specialization, experience, hospital });
    await doctor.save();
    res.redirect("/doctors/login");
  } catch (err) {
    res.status(500).send("Error registering doctor");
  }
});

// Render login form
router.get("/login", (req, res) => {
  res.render("doctor_login");
});

// Handle login (using Passport.js for authentication)
router.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/doctors/login",
  failureFlash: true
}));

module.exports = router;
