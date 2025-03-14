const express = require("express");
const router = express.Router();
const Patient = require("../models/Patients"); // Patient model
const bcrypt = require("bcrypt");
const passport = require("passport");

// Render registration form
router.get("/register", (req, res) => {
  res.render("patient_register");
});

// Handle registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, contact, age, gender, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const patient = new Patient({ name, email, password: hashedPassword, contact, age, gender, address });
    await patient.save();
    res.redirect("/patients/login");
  } catch (err) {
    res.status(500).send("Error registering patient");
  }
});

// Render login form
router.get("/login", (req, res) => {
  res.render("patient_login");
});

// Handle login (using Passport.js for authentication)
router.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/patients/login",
  failureFlash: true
}));

module.exports = router;
