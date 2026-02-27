import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./style.css";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { role } = useParams(); // 'patient' or 'doctor'
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const endpoint =
                role === "doctor"
                    ? "/api/doctor/forgot-password"
                    : "/api/patient/forgot-password";

            const response = await axios.post(endpoint, { email });

            if (response.data.success) {
                setMessage(response.data.message);
                setSent(true);
            } else {
                setError(response.data.message || "Something went wrong.");
            }
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to send reset email. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const loginPath = `/login?role=${role}`;

    return (
        <div className="form-container">
            <h1>Forgot Password</h1>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
                Enter your email address and we'll send you a link to reset your
                password.
            </p>

            {!sent ? (
                <form className="form" onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <br />

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="register-btn" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
            ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div
                        style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #0072ff, #00c6ff)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 15px",
                            fontSize: "28px",
                            color: "#fff",
                        }}
                    >
                        ✓
                    </div>
                    <p
                        style={{
                            color: "#28a745",
                            fontWeight: "600",
                            fontSize: "15px",
                            marginBottom: "5px",
                        }}
                    >
                        Email Sent!
                    </p>
                    <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6" }}>
                        {message}
                    </p>
                    <p
                        style={{
                            color: "#999",
                            fontSize: "12px",
                            marginTop: "15px",
                        }}
                    >
                        Didn't receive the email? Check your spam folder or{" "}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setSent(false);
                                setMessage(null);
                            }}
                            style={{ color: "#0072ff" }}
                        >
                            try again
                        </a>
                        .
                    </p>
                </div>
            )}

            <p className="login-link">
                Remember your password?{" "}
                <a href="#" onClick={() => navigate(loginPath)}>
                    Back to Login
                </a>
            </p>
        </div>
    );
};

export default ForgotPassword;
