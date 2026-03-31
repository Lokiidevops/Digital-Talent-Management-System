import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/Card";
import { Briefcase, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = (password) => {
    if (!password) return null;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2)
      return {
        label: "Weak",
        color: "bg-red-500",
        textClass: "text-red-500",
        width: "w-1/3",
      };
    if (score <= 4)
      return {
        label: "Medium",
        color: "bg-yellow-500",
        textClass: "text-yellow-500",
        width: "w-2/3",
      };
    return {
      label: "Strong",
      color: "bg-green-500",
      textClass: "text-green-500",
      width: "w-full",
    };
  };

  const strength = getPasswordStrength(form.password);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!form.firstName || !form.lastName) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (res) => {
    localStorage.setItem("googleUser", JSON.stringify(res));
    toast.success("Google registration successful!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
            <Briefcase size={28} />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Join DTMS
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Digital Talent Management System
          </p>
        </div>

        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              Create an account
            </CardTitle>
            <CardDescription>
              Enter your information below to get started
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* First Name */}
              <Input
                label="First Name"
                type="text"
                name="firstName"
                placeholder="Lokeshwaran"
                value={form.firstName}
                onChange={handleChange}
                required
              />

              {/* Last Name */}
              <Input
                label="Last Name"
                type="text"
                name="lastName"
                placeholder="Sakthivel"
                value={form.lastName}
                onChange={handleChange}
                required
              />

              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="rynixsoft@gmail.com"
                value={form.email}
                onChange={handleChange}
                required
              />

              {/* Password with show/hide */}
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {form.password && strength && (
                  <div className="mt-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Password strength
                      </span>
                      <span
                        className={`text-xs font-medium ${strength.textClass}`}
                      >
                        {strength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                      <div
                        className={`${strength.color} h-1.5 rounded-full ${strength.width} transition-all duration-300`}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password with show/hide */}
              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                By clicking sign up, you agree to our{" "}
                <Link to="#" className="text-primary-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="#" className="text-primary-600 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" isLoading={loading}>
                Create Account
              </Button>

              {/* Divider */}
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google registration failed")}
                  useOneTap
                  theme="outline"
                  shape="pill"
                />
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Sign in link */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
