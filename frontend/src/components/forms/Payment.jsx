import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

// Load your Stripe public key
const stripePromise = loadStripe("pk_test_51R8gyJFRIPI2bBzupfsKEo8tXxb4xntVxqRPhZ9MIjuDGPiP6gjG8zSZkblRvRYiq2HWkRLPMcLz8dN6sZHcJoE100TpuGtw6Q"); 

const Payment = ({ appointment }) => {
  const handlePayment = async () => {
    try {
      const res = await axios.post(
        "http://localhost:1600/api/payment/check-out",
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
    //   console.log({ appointmentId, patientEmail, doctorName, price });

      const stripe = await stripePromise;
      if (!stripe) {
      console.error("Stripe failed to load");
      alert("Stripe failed to load. Please try again later.");
      return;
    }

      await stripe.redirectToCheckout({ sessionId: res.data.id });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment initiation failed. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 shadow-md rounded-lg border">
      <h2 className="text-2xl font-semibold mb-4">
        Payment for Consultation
      </h2>
      <p className="text-gray-600 mb-2">
        Doctor: Dr. {appointment.doctorName}
      </p>
      <p className="text-gray-600 mb-2">Date: {appointment.date}</p>
      <p className="text-gray-600 mb-4">Fee: ₹{appointment.price}</p>

      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Payment;
