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
const Doctor = require("../models/doctor");
const { createNotification, emitNotification } = require("../utils/notification");
const { sendPaymentReceipt } = require('../utils/emailService');

// Step 1: Create Stripe Checkout Session
router.post("/check-out", async (req, res) => {
  const { appointmentId } = req.body;
  let { patientEmail } = req.body;

  try {
    if (!appointmentId) {
      return res.status(400).json({ success: false, message: "appointmentId is required" });
    }

    // Determine if this is an Appointment or a SecondOpinion by ID
    let record = await Appointment.findById(appointmentId).populate('doctorId', 'name feePerConsultation').populate('patientId', 'email');
    let isSecondOpinion = false;
    if (!record) {
      record = await GetSecondOpinion.findById(appointmentId).populate('doctorId', 'name feePerConsultation').populate('patientId', 'email');
      isSecondOpinion = !!record;
    }

    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found for payment" });
    }

    if (!patientEmail && record.patientId && record.patientId.email) {
      patientEmail = record.patientId.email;
    }

    if (!patientEmail) {
      return res.status(400).json({ success: false, message: "patientEmail is required" });
    }

    // Compute price server-side. Prefer explicit price/fee field if present; else take doctor's fee
    const doctorName = record.doctorId?.name || 'Doctor';
    const derivedPrice = (record.price || record.fee || record.doctorId?.feePerConsultation);
    if (!derivedPrice || Number.isNaN(Number(derivedPrice))) {
      return res.status(400).json({ success: false, message: "Unable to determine price for this payment" });
    }

    // Use the backend's own address for Stripe's success/cancel callbacks.
    // This lets the backend verify payment + update DB before redirecting to frontend.
    // We use the request host so it works for both localhost (web) and LAN IP (mobile).
    const backendBase = `${req.protocol}://${req.get('host')}`;
    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: patientEmail,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: isSecondOpinion ? `Second opinion with Dr. ${doctorName}` : `Consultation with Dr. ${doctorName}`,
            },
            unit_amount: Math.round(Number(derivedPrice) * 100),
          },
          quantity: 1,
        },
      ],
      // Backend handles success first (verifies + updates DB), then redirects to frontend
      success_url: `${backendBase}/api/payment/success?session_id={CHECKOUT_SESSION_ID}&frontend=${encodeURIComponent(frontendBase)}`,
      cancel_url: `${frontendBase}/payment/cancel`,
      metadata: {
        appointmentId,
        type: isSecondOpinion ? 'second-opinion' : 'appointment'
      },
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("Checkout Session Error:", err.message);
    res.status(500).json({ success: false, message: "Payment initiation failed. Please try again." });
  }
});

// Step 2: Handle Payment Success
router.get("/success", async (req, res) => {
  const { session_id, frontend } = req.query;
  if (!session_id) {
    return res.status(400).json({ success: false, message: "Missing session ID." });
  }

  // Determine where to redirect after verifying
  const frontendBase = frontend
    ? decodeURIComponent(frontend)
    : (process.env.FRONTEND_URL || 'http://localhost:5173');

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const appointmentId = session.metadata.appointmentId;
      const paidAmount = session.amount_total ? (session.amount_total / 100) : null;
      const type = session.metadata.type; // type from metadata

      let Model = type === 'second-opinion' ? GetSecondOpinion : Appointment;
      let record = await Model.findById(appointmentId);

      if (record && record.paymentStatus !== "Paid") {
        const updateData = {
          status: "Pending",
          paymentId: session.payment_intent,
          paymentStatus: "Paid",
          ...(paidAmount != null ? { price: paidAmount, fee: paidAmount } : {})
        };

        const updatedRecord = await Model.findByIdAndUpdate(appointmentId, updateData, { new: true });
        
        const patient = await Patient.findById(record.patientId);
        const doctor = await Doctor.findById(record.doctorId);

        if (patient && doctor) {
            const io = req.app.get('socketio');
            if (type === 'second-opinion') {
                // Notify doctor
                const docNotif = createNotification('new-second-opinion', `New second opinion request from ${patient.name}`, {
                    secondOpinionId: record._id,
                    patientId: patient._id,
                    patientName: patient.name,
                    problem: record.problem || "",
                    date: record.date,
                    time: record.time
                });
                await Doctor.findByIdAndUpdate(record.doctorId, { $push: { unseenNotifications: docNotif } });
                emitNotification(io, record.doctorId, 'doctor', docNotif);

                // Notify patient
                const patNotif = createNotification('second-opinion-requested', `Second opinion request submitted successfully`, {
                    secondOpinionId: record._id,
                    doctorId: doctor._id,
                    doctorName: doctor.name
                });
                await Patient.findByIdAndUpdate(record.patientId, { $push: { unseenNotifications: patNotif } });
                emitNotification(io, record.patientId, 'patient', patNotif);
            } else {
                // Notify doctor
                const docNotif = createNotification('new-appointment', `New appointment request from ${patient.name}`, {
                    appointmentId: record._id,
                    patientId: patient._id,
                    patientName: patient.name,
                    problem: record.problem || "",
                    date: record.date,
                    time: record.time
                });
                await Doctor.findByIdAndUpdate(record.doctorId, { $push: { unseenNotifications: docNotif } });
                emitNotification(io, record.doctorId, 'doctor', docNotif);

                // Notify patient
                const patNotif = createNotification('appointment-booked', `Appointment booked successfully with Dr. ${doctor.name}`, {
                    appointmentId: record._id,
                    doctorId: doctor._id,
                    doctorName: doctor.name,
                    date: record.date,
                    time: record.time
                });
                await Patient.findByIdAndUpdate(record.patientId, { $push: { unseenNotifications: patNotif } });
                emitNotification(io, record.patientId, 'patient', patNotif);
            }
        }
        console.log(`✅ Payment success route: verified and notified for ${type} ${appointmentId}`);
      }

      return res.redirect(`${frontendBase}/payment/success?session_id=${session_id}`);
    } else {
      return res.redirect(`${frontendBase}/payment/cancel`);
    }
  } catch (err) {
    console.error("Stripe success error:", err.message);
    return res.redirect(`${frontendBase}/payment/cancel`);
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
    const type = session.metadata.type; // type from metadata

    try {
      let Model = type === 'second-opinion' ? GetSecondOpinion : Appointment;
      let record = await Model.findById(appointmentId);

      if (record && record.paymentStatus !== "Paid") {
        const updateData = {
          status: "Pending",
          paymentId: session.payment_intent,
          paymentStatus: "Paid",
          ...(paidAmount != null ? { price: paidAmount, fee: paidAmount } : {})
        };

        const updatedRecord = await Model.findByIdAndUpdate(appointmentId, updateData, { new: true });
        
        const patient = await Patient.findById(record.patientId);
        const doctor = await Doctor.findById(record.doctorId);

        if (patient && doctor) {
            const io = req.app.get('socketio');
            if (type === 'second-opinion') {
                // Notify doctor
                const docNotif = createNotification('new-second-opinion', `New second opinion request from ${patient.name}`, {
                    secondOpinionId: record._id,
                    patientId: patient._id,
                    patientName: patient.name,
                    problem: record.problem || "",
                    date: record.date,
                    time: record.time
                });
                await Doctor.findByIdAndUpdate(record.doctorId, { $push: { unseenNotifications: docNotif } });
                emitNotification(io, record.doctorId, 'doctor', docNotif);

                // Notify patient
                const patNotif = createNotification('second-opinion-requested', `Second opinion request submitted successfully`, {
                    secondOpinionId: record._id,
                    doctorId: doctor._id,
                    doctorName: doctor.name
                });
                await Patient.findByIdAndUpdate(record.patientId, { $push: { unseenNotifications: patNotif } });
                emitNotification(io, record.patientId, 'patient', patNotif);
            } else {
                // Notify doctor
                const docNotif = createNotification('new-appointment', `New appointment request from ${patient.name}`, {
                    appointmentId: record._id,
                    patientId: patient._id,
                    patientName: patient.name,
                    problem: record.problem || "",
                    date: record.date,
                    time: record.time
                });
                await Doctor.findByIdAndUpdate(record.doctorId, { $push: { unseenNotifications: docNotif } });
                emitNotification(io, record.doctorId, 'doctor', docNotif);

                // Notify patient
                const patNotif = createNotification('appointment-booked', `Appointment booked successfully with Dr. ${doctor.name}`, {
                    appointmentId: record._id,
                    doctorId: doctor._id,
                    doctorName: doctor.name,
                    date: record.date,
                    time: record.time
                });
                await Patient.findByIdAndUpdate(record.patientId, { $push: { unseenNotifications: patNotif } });
                emitNotification(io, record.patientId, 'patient', patNotif);
            }
        }

        // Send payment receipt
        if (patient) {
            await sendPaymentReceipt(patient.email, {
                patientName: patient.name,
                amount: paidAmount,
                transactionId: session.payment_intent,
                appointmentId: record._id
            });
        }
        console.log(`✅ Webhook: Payment verified and notified for ${type} ${appointmentId}`);
      }
    } catch (dbErr) {
      console.error(`❌ Webhook DB Update Error: ${dbErr.message}`);
    }
  }

  res.json({ received: true });
});

module.exports = router;
