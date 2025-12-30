
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import "../styles/Payment.css"; // Clean CSS import
import { ShieldCheck, CreditCard, User } from "lucide-react";

// Load your Stripe public key
const stripePromise = loadStripe("pk_test_51Rs6m3KeDTOPdy8SRB04YzOvSB4bvxRzzsYczXEkiqEaQudbkvOgEsuKSz3kZw9fdW4RIZqJL9yrlh38fEfWsewO002ISFw1tt");

const Payment = ({ appointment }) => {
  const handlePayment = async () => {
    try {
      console.log("Processing Payment...", appointment);
      const res = await axios.post(
        "/api/payment/check-out",
        {
          appointmentId: appointment._id,
          patientEmail: appointment.email,
          doctorName: appointment.doctorName,
          price: appointment.price,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const stripe = await stripePromise;
      if (!stripe) {
        alert("Payment gateway failed to load.");
        return;
      }

      await stripe.redirectToCheckout({ sessionId: res.data.id });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Could not initiate payment. Please try again.");
    }
  };

  return (
    <div className="payment-page-container">
      <div className="checkout-card">

        {/* Header */}
        <div className="checkout-header">
          <h2>Complete Payment</h2>
          <p>Secure Checkout</p>
        </div>

        <div className="checkout-body">

          {/* Doctor Summary */}
          <div className="doctor-summary">
            <div className="doc-avatar-circle">
              <User size={24} />
            </div>
            <div className="doc-info">
              <h4>Dr. {appointment.doctorName}</h4>
              <span>Consultation Fee</span>
            </div>
          </div>

          {/* Bill Breakdown */}
          <div className="bill-details">
            <div className="bill-row">
              <span>Date</span>
              <span>{appointment.date}</span>
            </div>
            <div className="bill-row">
              <span>Consultation Fee</span>
              <span>₹{appointment.price}</span>
            </div>
            <div className="bill-row">
              <span>Platform Fee</span>
              <span>₹0.00</span>
            </div>

            <div className="bill-total">
              <span>Total Pay</span>
              <span>₹{appointment.price}</span>
            </div>
          </div>

          {/* Action */}
          <button onClick={handlePayment} className="pay-btn">
            <CreditCard size={18} />
            Pay Remotely
          </button>

          {/* Security */}
          <div className="secure-badge">
            <ShieldCheck size={14} className="secure-icon" />
            <span>256-bit SSL Secure Payment by Stripe</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Payment;
