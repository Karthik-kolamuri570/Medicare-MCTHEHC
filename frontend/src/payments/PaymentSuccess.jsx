
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Payment.css"; // Shared styles
import { CheckCircle, Home, Calendar } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      toast.error("Session ID missing.");
      return navigate("/");
    }
  }, [navigate, searchParams]);

  return (
    <div className="payment-page-container">
      <div className="checkout-card">

        {/* Success Header */}
        <div className="checkout-header success">
          <h2>Payment Successful</h2>
          <p>Your appointment is confirmed!</p>
        </div>

        <div className="checkout-body">

          {/* Large Check Mark */}
          <div className="status-icon-large success">
            <CheckCircle size={48} />
          </div>

          <p className="status-message">
            Thank you for your payment. We have sent a receipt to your email address.
            Dr. Appointment is scheduled.
          </p>

          {/* Actions */}
          <button onClick={() => navigate("/patient/online-consultation")} className="pay-btn">
            <Calendar size={18} />
            View My Appointments
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

export default PaymentSuccess;
