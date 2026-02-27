import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./style.css";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { role } = useParams(); // 'patient' or 'doctor'
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token || !email) {
            setError("Invalid reset link. Please request a new password reset.");
        }
    }, [token, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }

        try {
            const endpoint =
                role === "doctor"
                    ? "/api/doctor/reset-password"
                    : "/api/patient/reset-password";

            const response = await axios.post(endpoint, {
                token,
                email,
                newPassword,
                confirmPassword,
            });

            if (response.data.success) {
                setMessage(response.data.message);
                setSuccess(true);
            } else {
                setError(response.data.message || "Something went wrong.");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to reset password. The link may have expired."
            );
        } finally {
            setLoading(false);
        }
    };

    const loginPath = `/login?role=${role}`;

    return (
        <div className="form-container">
            <h1>Reset Password</h1>

            {!success ? (
                <>
                    <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
                        Enter your new password below.
                    </p>

                    <form className="form" onSubmit={handleSubmit}>
                        <label>New Password:</label>
                        <input
                            type="password"
                            placeholder="Enter new password (min 6 chars)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                            disabled={!token || !email}
                        />
                        <br />

                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                            disabled={!token || !email}
                        />
                        <br />

                        {error && <p className="error-message">{error}</p>}

                        <button
                            type="submit"
                            className="register-btn"
                            disabled={loading || !token || !email}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </>
            ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div
                        style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #28a745, #20c997)",
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
                        Password Reset Successful!
                    </p>
                    <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6" }}>
                        {message}
                    </p>
                    <button
                        className="register-btn"
                        style={{ marginTop: "20px" }}
                        onClick={() => navigate(loginPath)}
                    >
                        Go to Login
                    </button>
                </div>
            )}

            <p className="login-link" style={{ marginTop: "15px" }}>
                <a href="#" onClick={() => navigate(loginPath)}>
                    Back to Login
                </a>
            </p>
        </div>
    );
};

export default ResetPassword;
