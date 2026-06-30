import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { authClient } from "../lib/supabase";

interface ForgotPasswordProps {
  theme: "light" | "dark";
  onBackToLogin: () => void;
}

export default function ForgotPassword({ theme, onBackToLogin }: ForgotPasswordProps) {
  const isDark = theme === "dark";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Email validation helper
  const validateEmail = (val: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const translateError = (errorMsg: string): string => {
    const msg = errorMsg.toLowerCase();
    if (msg.includes("user not found") || msg.includes("does not exist")) {
      return "We couldn't find an account with that email.";
    }
    if (msg.includes("network") || msg.includes("fetch") || msg.includes("connection")) {
      return "Please check your internet connection and try again.";
    }
    return "Something went wrong. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address (e.g., user@domain.com).");
      return;
    }

    setLoading(true);

    try {
      const { success: resetSuccess, error: resetErr } = await authClient.resetPassword(email);
      if (resetErr) {
        setError(translateError(resetErr.message));
      } else if (resetSuccess) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(translateError(err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="forgot-password-view" className="w-full">
      <div className="flex flex-col items-center mb-6 text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-lg ${
          isDark ? "bg-[#F27D26]/20 text-[#F27D26]" : "bg-[#F27D26]/10 text-[#F27D26]"
        }`}>
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <h3 className="text-xl font-sans font-bold uppercase tracking-wider text-center leading-tight">
          Recover Account
        </h3>
        <p className="mt-2 text-xs opacity-70 max-w-xs leading-relaxed">
          Provide your workspace email below to send a security link to reset your password.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-6 rounded-2xl border text-center space-y-4 ${
              isDark 
                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
          >
            <div className="flex justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 animate-bounce" />
            </div>
            <h4 className="font-bold text-sm">Passphrase Recovery Sent!</h4>
            <p className="text-xs opacity-90 leading-relaxed">
              We have sent a secure password recovery message to <strong className="font-mono">{email}</strong>. Please check your inbox and follow instructions.
            </p>
            <button
              onClick={onBackToLogin}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all mt-2 border cursor-pointer ${
                isDark
                  ? "border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              Back to login portal
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider uppercase opacity-60">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    error ? "text-red-500" : "opacity-45"
                  }`} />
                  <input
                    type="email"
                    required
                    disabled={loading}
                    placeholder="developer@mentra.ai"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm transition outline-none ${
                      error
                        ? "border-red-500 bg-red-500/5 focus:border-red-500 text-red-500"
                        : isDark
                        ? "bg-white/5 border-white/10 focus:border-white focus:bg-white/10 text-white"
                        : "bg-black/5 border-black/10 focus:border-black focus:bg-white text-[#1A1A1A]"
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 ${
                  isDark
                    ? "bg-[#F27D26] text-white hover:bg-[#F27D26]/90 shadow-lg shadow-[#F27D26]/10"
                    : "bg-black text-white hover:bg-[#1A1A1A]/90 shadow-lg shadow-black/10"
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Sending link...</span>
                  </div>
                ) : (
                  <>
                    <span>Send Reset Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <button
              onClick={onBackToLogin}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 opacity-70 hover:opacity-100 ${
                isDark ? "text-white" : "text-[#1A1A1A]"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
