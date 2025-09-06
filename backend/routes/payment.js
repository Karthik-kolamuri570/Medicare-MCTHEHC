// routes/payment.js
const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Appointment = require("../models/appointments"); // ⬅️ Ensure this is imported

// ✅ Step 1: Create Stripe Checkout Session
router.post("/check-out", async (req, res) => {
  const { appointmentId, patientEmail, doctorName, price } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: patientEmail,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Consultation with Dr. ${doctorName}`,
            },
            unit_amount: price * 100, // INR (paise)
          },
          quantity: 1,
        },
      ],
      success_url: `${req.protocol}://${req.get("host")}/api/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get("host")}/api/payment/cancel`,
      metadata: {
        appointmentId,
      },
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Checkout Session Error:", err.message);
    res.status(500).json({ success: false, message: "Payment initiation failed. Please try again." });
  }
});

// ✅ Step 2: Handle Payment Success
router.get("/success", async (req, res) => {
  const { session_id } = req.query;

  try {
    if (!session_id) {
      return res.status(400).json({ success: false, message: "Missing session ID." });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const appointmentId = session.metadata.appointmentId;

      await Appointment.findByIdAndUpdate(appointmentId, {
        status: "Pending",
        paymentId: session.payment_intent,
        paymentStatus: "Paid",
      });

      // Optional: Trigger email/SMS notifications here

      // ✅ Redirect to frontend success page
      return res.redirect(`http://localhost:5173/api/payment/success?session_id=${session_id}`);
    } else {
      return res.redirect(`http://localhost:5173/api/payment/cancel`);
    }
  } catch (err) {
    console.error("Stripe success error:", err.message);
    return res.redirect(`http://localhost:5173/payment-cancel`);
  }
});

// ✅ Step 3: Handle Payment Cancel
router.get("/cancel", (req, res) => {
  console.log("User canceled the payment.");
  return res.redirect("http://localhost:5173/payment-cancel");
});

module.exports = router;
