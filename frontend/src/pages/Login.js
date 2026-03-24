import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "../styles/auth.css";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setSuccess("Login successful! Redirecting...");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (res) => {
    console.log("Google Success:", res);
    localStorage.setItem("googleUser", JSON.stringify(res));
    navigate("/dashboard");
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div
          className="brand"
          style={{ justifyContent: "center", marginBottom: "28px" }}
        >
          <span
            className="brand-name"
            style={{
              fontSize: "1.8rem",
              letterSpacing: "0.08em",
              color: "#0d1117",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              textDecoration: "none",
              borderBottom: "none",
            }}
          >
            Digital Talent Management System
            <ul></ul>
          </span>
        </div>

        <h2
          style={{
            fontSize: "1.4rem",
            marginBottom: "4px",
            marginTop: "-4px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Welcome back
        </h2>
        <p className="sub" style={{ marginBottom: "20px" }}>
          Sign in to continue to your account.
        </p>

        {error && <div className="msg error">{error}</div>}
        {success && <div className="msg success">{success}</div>}

        <form onSubmit={handleSubmit}>
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
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
                style={{ paddingRight: "44px" }}
                autoComplete="current-password"
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

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <div style={{ textAlign: "right", marginTop: "8px" }}>
            <Link
              to="/forgot-password"
              style={{
                fontSize: ".82rem",
                color: "#0d1117",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Forgot Password?
            </Link>
          </div>
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
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            width="360"
            text="continue_with"
            shape="rectangular"
            theme="outline"
          />
        </div>
        <div className="switch-link" style={{ marginTop: "20px" }}>
          Don't have an account? <Link to="/register">Register one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
