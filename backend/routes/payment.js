// // routes/payment.js
// const express = require("express");
// const router = express.Router();
// const Stripe = require("stripe");
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// const Appointment = require("../models/appointments"); // ⬅️ Ensure this is imported

// // ✅ Step 1: Create Stripe Checkout Session
// router.post("/check-out", async (req, res) => {
//   const { appointmentId, patientEmail, doctorName, price } = req.body;

//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       customer_email: patientEmail,
//       line_items: [
//         {
//           price_data: {
//             currency: "inr",
//             product_data: {
//               name: `Consultation with Dr. ${doctorName}`,
//             },
//             unit_amount: price * 100, // INR (paise)
//           },
//           quantity: 1,
//         },
//       ],
//       success_url: `${req.protocol}://${req.get("host")}/api/payment/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${req.protocol}://${req.get("host")}/api/payment/cancel`,
//       metadata: {
//         appointmentId,
//       },
//     });

//     res.status(200).json({ id: session.id });
//   } catch (err) {
//     console.error("Checkout Session Error:", err.message);
//     res.status(500).json({ success: false, message: "Payment initiation failed. Please try again." });
//   }
// });

// // ✅ Step 2: Handle Payment Success
// router.get("/success", async (req, res) => {
//   const { session_id } = req.query;

//   try {
//     if (!session_id) {
//       return res.status(400).json({ success: false, message: "Missing session ID." });
//     }

//     const session = await stripe.checkout.sessions.retrieve(session_id);

//     if (session.payment_status === "paid") {
//       const appointmentId = session.metadata.appointmentId;

//       await Appointment.findByIdAndUpdate(appointmentId, {
//         status: "Pending",
//         paymentId: session.payment_intent,
//         paymentStatus: "Paid",
//       });

//       // Optional: Trigger email/SMS notifications here

//       // ✅ Redirect to frontend success page
//       return res.redirect(`http://localhost:5173/api/payment/success?session_id=${session_id}`);
//     } else {
//       return res.redirect(`http://localhost:5173/api/payment/cancel`);
//     }
//   } catch (err) {
//     console.error("Stripe success error:", err.message);
//     return res.redirect(`http://localhost:5173/payment-cancel`);
//   }
// });

// // ✅ Step 3: Handle Payment Cancel
// router.get("/cancel", (req, res) => {
//   console.log("User canceled the payment.");
//   return res.redirect("http://localhost:5173/payment-cancel");
// });

// module.exports = router;





































const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Appointment = require("./../models/appointments");
const GetSecondOpinion = require("../models/GetSecondOpinion"); // IMPORT ADDED - adjust path/file name as per your project
const Patient = require("../models/patient");
const { sendPaymentReceipt } = require('../utils/emailService');

// Step 1: Create Stripe Checkout Session
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
            unit_amount: price * 100, // price in paise
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

// Step 2: Handle Payment Success
router.get("/success", async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) {
    return res.status(400).json({ success: false, message: "Missing session ID." });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const appointmentId = session.metadata.appointmentId;

      // Persist paid amount (Stripe reports in smallest currency unit, paise for INR)
      const paidAmount = session.amount_total ? (session.amount_total / 100) : null;

      // Update appointment if found
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
          status: "Pending",
          paymentId: session.payment_intent,
          paymentStatus: "Paid",
          ...(paidAmount != null ? { price: paidAmount, fee: paidAmount } : {})
        },
        { new: true }
      );

      // Update second opinion if found
      const updatedSecondOpinion = await GetSecondOpinion.findByIdAndUpdate(
        appointmentId,
        {
          status: "Pending",
          paymentId: session.payment_intent,
          paymentStatus: "Paid",
          ...(paidAmount != null ? { price: paidAmount, fee: paidAmount } : {})
        },
        { new: true }
      );

      if (updatedAppointment) {
        console.log(`Appointment payment status updated for ID ${appointmentId}`);
      }
      if (updatedSecondOpinion) {
        console.log(`SecondOpinion payment status updated for ID ${appointmentId}`);
      }

      // Redirect to frontend success page
      let frontendUrl = process.env.FRONTEND_URL;
      if (!frontendUrl) {
        const host = req.get("host");
        if (host.includes("localhost") || host.includes("127.0.0.1")) {
          frontendUrl = "http://localhost:5173";
        } else {
          frontendUrl = `${req.protocol}://${host}`;
        }
      }
      return res.redirect(`${frontendUrl}/payment/success?session_id=${session_id}`);
    } else {
      let frontendUrl = process.env.FRONTEND_URL;
      if (!frontendUrl) {
        const host = req.get("host");
        if (host.includes("localhost") || host.includes("127.0.0.1")) {
          frontendUrl = "http://localhost:5173";
        } else {
          frontendUrl = `${req.protocol}://${host}`;
        }
      }
      return res.redirect(`${frontendUrl}/payment/cancel`);
    }
  } catch (err) {
    console.error("Stripe success error:", err.message);
    let frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      const host = req.get("host");
      if (host.includes("localhost") || host.includes("127.0.0.1")) {
        frontendUrl = "http://localhost:5173";
      } else {
        frontendUrl = `${req.protocol}://${host}`;
      }
    }
    return res.redirect(`${frontendUrl}/payment/cancel`);
  }
});

// Step 3: Handle Payment Cancel
router.get("/cancel", (req, res) => {
  console.log("User canceled the payment.");
  let frontendUrl = process.env.FRONTEND_URL;
  if (!frontendUrl) {
    const host = req.get("host");
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      frontendUrl = "http://localhost:5173";
    } else {
      frontendUrl = `${req.protocol}://${host}`;
    }
  }
  return res.redirect(`${frontendUrl}/payment/cancel`);
});

// Step 4: Stripe Webhook — Secure server-side payment verification
// This ensures payment is recorded even if the user closes the browser during redirect
router.post("/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // If webhook secret is not configured, skip verification (development mode)
  if (!webhookSecret) {
    console.warn("⚠️ STRIPE_WEBHOOK_SECRET not set. Webhook verification skipped.");
    return res.status(200).json({ received: true, warning: "No webhook secret configured" });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const appointmentId = session.metadata.appointmentId;
    const paidAmount = session.amount_total ? (session.amount_total / 100) : null;

    const updateData = {
      status: "Pending",
      paymentId: session.payment_intent,
      paymentStatus: "Paid",
      ...(paidAmount != null ? { price: paidAmount, fee: paidAmount } : {})
    };

    try {
      const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, updateData, { new: true });
      const updatedSecondOpinion = await GetSecondOpinion.findByIdAndUpdate(appointmentId, updateData, { new: true });

      if (updatedAppointment) {
        console.log(`✅ Webhook: Appointment payment verified for ID ${appointmentId}`);
        // Fetch patient to send email 
        if (updatedAppointment.patientId) {
            const patient = await Patient.findById(updatedAppointment.patientId);
            if (patient) {
                await sendPaymentReceipt(patient.email, {
                    patientName: patient.name,
                    amount: paidAmount,
                    transactionId: session.payment_intent,
                    appointmentId: updatedAppointment._id
                });
            }
        }
      }
      if (updatedSecondOpinion) {
        console.log(`✅ Webhook: SecondOpinion payment verified for ID ${appointmentId}`);
        if (updatedSecondOpinion.patientId) {
            const patient = await Patient.findById(updatedSecondOpinion.patientId);
            if (patient) {
                await sendPaymentReceipt(patient.email, {
                    patientName: patient.name,
                    amount: paidAmount,
                    transactionId: session.payment_intent,
                    appointmentId: updatedSecondOpinion._id
                });
            }
        }
      }
    } catch (dbErr) {
      console.error(`❌ Webhook DB Update Error: ${dbErr.message}`);
    }
  }

  res.json({ received: true });
});

module.exports = router;
