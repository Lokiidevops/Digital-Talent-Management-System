import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, verifyOTP, resetPassword } from "../services/api";
import "../styles/auth.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirmPass, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await forgotPassword({ email });
      setSuccess("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await verifyOTP({ email, otp });
      setSuccess("OTP verified!");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPass) return setError("Passwords do not match");
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await resetPassword({ email, otp, newPassword });
      setSuccess("Password reset! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div
          className="brand"
          style={{ justifyContent: "center", marginBottom: "5px" }}
        >
          <span
            className="brand-name"
            style={{
              fontSize: "1.6rem",
              letterSpacing: "0.08em",
              color: "#1a1a2e",
            }}
          ></span>
        </div>

        {step === 1 && (
          <>
            <h2>Forgot Password</h2>
            <p className="sub">Enter your email to receive an OTP</p>
            {error && <div className="msg error">{error}</div>}
            {success && <div className="msg success">{success}</div>}
            <form onSubmit={handleSendOTP}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button className="btn" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Enter OTP</h2>
            <p className="sub">
              We sent a 6-digit code to <strong>{email}</strong>
            </p>
            {error && <div className="msg error">{error}</div>}
            {success && <div className="msg success">{success}</div>}
            <form onSubmit={handleVerifyOTP}>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  margin: "24px 0",
                }}
              >
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i] || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      const otpArr = otp.split("");
                      otpArr[i] = val;
                      setOtp(otpArr.join(""));
                      if (val && i < 5) {
                        document.getElementById(`otp-${i + 1}`).focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[i] && i > 0) {
                        document.getElementById(`otp-${i - 1}`).focus();
                      }
                    }}
                    style={{
                      width: "48px",
                      height: "56px",
                      textAlign: "center",
                      fontSize: "1.4rem",
                      fontWeight: "700",
                      border: "2px solid",
                      borderColor: otp[i] ? "#0d1117" : "#cbd5e1",
                      borderRadius: "10px",
                      outline: "none",
                      background: "#ffffff",
                      color: "#0d1117",
                      transition: "all .2s",
                    }}
                  />
                ))}
              </div>

              <button className="btn" disabled={loading || otp.length < 6}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <div
              style={{
                textAlign: "center",
                marginTop: "16px",
                fontSize: ".82rem",
                color: "#8C8A82",
              }}
            >
              Didn't receive the code?{" "}
              <span
                style={{
                  color: "#1a1a2e",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setStep(1);
                  setError("");
                  setSuccess("");
                  setOtp("");
                }}
              >
                Resend OTP
              </span>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2>Reset Password</h2>
            <p className="sub">Enter your new password</p>
            {error && <div className="msg error">{error}</div>}
            {success && <div className="msg success">{success}</div>}
            <form onSubmit={handleReset}>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNew(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPass}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
              <button className="btn" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        <div className="switch-link" style={{ marginTop: "20px" }}>
          <Link to="/login">← Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
