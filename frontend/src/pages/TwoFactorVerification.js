import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { ShieldCheck, Mail, Smartphone, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const TwoFactorVerification = () => {
  const [method, setMethod] = useState("email"); // email or mobile
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    if (code.length < 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    // Simulate verification API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Verification successful!");
      navigate("/dashboard");
    }, 1500);
  };

  const handleResend = () => {
    toast.success(
      `A new code has been sent to your ${
        method === "email" ? "email address" : "mobile number"
      }`,
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-xl shadow-primary-500/10 mb-6">
            <ShieldCheck size={36} className="animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Security Verification
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Protecting your Digital Talent Management System account
          </p>
        </div>

        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 overflow-hidden">
          <CardHeader className="space-y-1 text-center bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 pb-6">
            <CardTitle className="text-xl font-semibold">
              Choose Verification Method
            </CardTitle>
            <CardDescription>
              How would you like to receive your secure code?
            </CardDescription>

            <div className="flex p-1 mt-6 bg-gray-200/50 dark:bg-gray-800 rounded-lg max-w-[300px] mx-auto">
              <button
                type="button"
                onClick={() => setMethod("email")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                  method === "email"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Mail size={16} /> Email
              </button>
              <button
                type="button"
                onClick={() => setMethod("mobile")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                  method === "mobile"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Smartphone size={16} /> Mobile
              </button>
            </div>
          </CardHeader>

          <form onSubmit={handleVerify}>
            <CardContent className="pt-8 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={method}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-center space-y-2"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    We've sent a 6-digit verification code to your
                    {method === "email"
                      ? " registered email address"
                      : " linked mobile number"}
                    .
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {method === "email" ? "lo***@email.com" : "+91 98*** ***89"}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="space-y-4">
                <Input
                  label="Authentication Code"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="text-center text-2xl tracking-[0.5em] font-mono h-14"
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pb-8">
              <Button
                type="submit"
                className="w-full gap-2"
                isLoading={loading}
              >
                Verify Identity <ArrowRight size={18} />
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
                  >
                    Resend Code
                  </button>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          <Link
            to="/login"
            className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default TwoFactorVerification;
