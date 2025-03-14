const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification"); // Notification model

// Render notifications page
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.render("notifications", { notifications });
  } catch (err) {
    res.status(500).send("Error fetching notifications");
  }
});

// Handle notification deletion
router.post("/delete/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.redirect("/notifications");
  } catch (err) {
    res.status(500).send("Error deleting notification");
  }
});

module.exports = router;
