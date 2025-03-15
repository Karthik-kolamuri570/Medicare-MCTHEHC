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
router.post("/register", doctorController.register)

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
