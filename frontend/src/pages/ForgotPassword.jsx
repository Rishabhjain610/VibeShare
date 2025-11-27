import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, KeyRound, Lock, PartyPopper } from "lucide-react";
import { AuthDataContext } from "../context/AuthContext";
import { toast } from "react-toastify";

import axios from "axios";
const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const { serverUrl } = useContext(AuthDataContext);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${serverUrl}/api/auth/send-otp`, {
        email,
      });
      console.log(response.data.message);
      toast.success("OTP sent to your email!");
      setStep(2);
      setLoading(false);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${serverUrl}/api/auth/verify-otp`, {
        otp,
        email,
      });
      console.log(response.data.message);
      toast.success("OTP verified successfully!");
      setLoading(false);
      setStep(3);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP. Please try again.");
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      if (newPassword !== confirmNewPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const response = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        {
          newPassword,
          email,
        }
      );
      console.log(response.data.message);
      toast.success("Password reset successful! You can now log in.");
      navigate("/");
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600 mb-3">
            <PartyPopper className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-xs text-gray-500 mt-1">
            {step === 1 && "Enter your email to receive a verification code."}
            {step === 2 && `We've sent a code to ${email}`}
            {step === 3 && "Create your new password."}
          </p>
        </div>

        {step === 1 && (
          <form className="space-y-4" onSubmit={handleEmailSubmit}>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors text-sm"
            >
              Send Code
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4" onSubmit={handleOtpSubmit}>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Verification Code"
                className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors text-sm"
            >
              Verify
            </button>
          </form>
        )}

        {step === 3 && (
          <form className="space-y-4" onSubmit={handlePasswordReset}>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                placeholder="New Password"
                className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors text-sm"
            >
              Reset Password
            </button>
          </form>
        )}

        <div className="mt-5 text-center text-xs text-gray-500">
          <Link to="/login" className="hover:text-gray-700 font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
