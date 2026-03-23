import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "../styles/auth.css";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match");

    if (form.password.length < 6)
      return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      };
      const res = await registerUser(payload);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setSuccess("Account created! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div
          className="brand"
          style={{ justifyContent: "center", marginBottom: "3px" }}
        >
          <span
            className="brand-name"
            style={{
              fontSize: "1.7rem",
              letterSpacing: "0.08em",
              color: "#1a1a2e",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          ></span>
        </div>

        <h2
          style={{ fontSize: "1.6rem", marginBottom: "4px", marginTop: "0px" }}
        >
          Create your account
        </h2>
        <p className="sub" style={{ marginBottom: "20px" }}>
          Join us today. It only takes a minute.
        </p>

        {error && <div className="msg error">{error}</div>}
        {success && <div className="msg success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="rynixsoft@gmail.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                style={{ paddingRight: "44px" }}
                autoComplete="new-password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#9ca3af",
                  fontSize: "1rem",
                  userSelect: "none",
                }}
              >
                {showPassword ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                style={{ paddingRight: "44px" }}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showConfirmPassword ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              margin: "16px 0",
            }}
          >
            <input
              type="checkbox"
              id="terms"
              checked={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.checked })}
              style={{
                width: "16px",
                height: "16px",
                marginTop: "2px",
                accentColor: "#1a1a2e",
                cursor: "pointer",
                flexShrink: 0,
              }}
            />
            <label
              htmlFor="terms"
              style={{
                fontSize: ".82rem",
                color: "#555",
                lineHeight: "1.5",
                cursor: "pointer",
              }}
            >
              I agree to the{" "}
              <a
                href="/terms"
                style={{
                  color: "#1a1a2e",
                  fontWeight: "600",
                  textDecoration: "none",
                  borderBottom: "1px solid #1a1a2e",
                }}
              >
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                style={{
                  color: "#1a1a2e",
                  fontWeight: "600",
                  textDecoration: "none",
                  borderBottom: "1px solid #1a1a2e",
                }}
              >
                Privacy Policy
              </a>
            </label>
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "20px 0",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "#e0e0d8" }}></div>
          <span style={{ color: "#8C8A82", fontSize: ".8rem" }}>
            or continue with
          </span>
          <div style={{ flex: 1, height: "1px", background: "#e0e0d8" }}></div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={(res) => {
              console.log("Google Success:", res);
              alert("Google login successful!");
            }}
            onError={() => setError("Google login failed")}
            width="360"
            text="continue_with"
            shape="rectangular"
            theme="outline"
          />
        </div>

        <div className="switch-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
