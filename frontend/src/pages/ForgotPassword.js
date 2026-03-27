import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, verifyOTP, resetPassword } from "../services/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/Card";
import { Briefcase, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirmPass, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ email });
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOTP({ email, otp });
      toast.success("OTP verified!");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPass) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ email, otp, newPassword });
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
            <Briefcase size={28} />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Reset Password
          </h1>
        </div>

        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              {step === 1 ? "Forgot Password?" : step === 2 ? "Verify OTP" : "New Password"}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? "Enter your email to receive an OTP" 
                : step === 2 
                ? "Enter the 6-digit code sent to your email" 
                : "Create a new secure password"}
            </CardDescription>
          </CardHeader>

          {step === 1 && (
            <form onSubmit={handleSendOTP}>
              <CardContent className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" isLoading={loading}>
                  Send OTP
                </Button>
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back to login
                </Link>
              </CardFooter>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP}>
              <CardContent className="space-y-4">
                <Input
                  label="OTP Code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" isLoading={loading}>
                  Verify OTP
                </Button>
                <Button variant="ghost" type="button" onClick={() => setStep(1)} className="text-sm">
                  Try another email
                </Button>
              </CardFooter>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleReset}>
              <CardContent className="space-y-4">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNew(e.target.value)}
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPass}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" isLoading={loading}>
                  Reset Password
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
