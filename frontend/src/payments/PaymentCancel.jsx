
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Payment.css"; // Shared styles
import { XCircle, RefreshCcw, Home } from "lucide-react";

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: Toast notification
    // toast.error("Payment was cancelled.");
  }, []);

  return (
    <div className="payment-page-container">
      <div className="checkout-card">

        {/* Error Header */}
        <div className="checkout-header error">
          <h2>Payment Cancelled</h2>
          <p>No charges were made</p>
        </div>

        <div className="checkout-body">

          {/* Large X Mark */}
          <div className="status-icon-large error">
            <XCircle size={48} />
          </div>

          <p className="status-message">
            The payment process was interrupted or cancelled. don't worry, your money is safe.
            Would you like to try again?
          </p>

          {/* Actions */}
          <button onClick={() => navigate(-1)} className="pay-btn">
            <RefreshCcw size={18} />
            Try Again
          </button>

          <button onClick={() => navigate("/")} className="pay-btn secondary">
            <Home size={18} />
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentCancel;
