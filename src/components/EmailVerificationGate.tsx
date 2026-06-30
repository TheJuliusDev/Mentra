import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { authClient, AuthUser } from "../lib/supabase";
import { Mail, ShieldAlert, CheckCircle, RefreshCw, LogOut, Send, AlertTriangle, Sparkles } from "lucide-react";

interface EmailVerificationGateProps {
  user: AuthUser;
  onVerified: () => void;
  onSignOut: () => void;
  theme: "light" | "dark";
}

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function EmailVerificationGate({ user, onVerified, onSignOut, theme }: EmailVerificationGateProps) {
  const isDark = theme === "dark";
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Show a toast message helper
  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  // Resend Countdown logic
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Automatic verification status check every 4 seconds
  useEffect(() => {
    if (verifiedSuccess) return;

    const checkStatus = async () => {
      try {
        const reloadedUser = await authClient.reload();
        if (reloadedUser && reloadedUser.emailVerified) {
          triggerSuccessFlow();
        }
      } catch (err) {
        console.warn("Auto check error:", err);
      }
    };

    const interval = setInterval(checkStatus, 4000);
    return () => clearInterval(interval);
  }, [verifiedSuccess]);

  const triggerSuccessFlow = () => {
    setVerifiedSuccess(true);
    showToast("Email address verified successfully! Welcome to Mentra 🎉", "success");
    setTimeout(() => {
      onVerified();
    }, 1800);
  };

  // Resend action
  const handleResend = async () => {
    if (resendCountdown > 0 || isResending) return;
    setIsResending(true);
    try {
      const { success, error } = await authClient.resendVerificationEmail(user.email);
      if (error) {
        showToast(error.message || "Failed to resend verification email.", "error");
      } else {
        setResendCountdown(60);
        showToast("We've sent another verification email. Please check your inbox!", "success");
      }
    } catch (err: any) {
      showToast("Too many attempts. Please try again later.", "error");
    } finally {
      setIsResending(false);
    }
  };

  // Manual Check action
  const handleManualCheck = async () => {
    if (isChecking || verifiedSuccess) return;
    setIsChecking(true);
    try {
      // For local simulations/mock users, let clicking this button immediately verify them
      if (user.id.startsWith("mock-")) {
        await authClient.setMockVerified(user.id);
        triggerSuccessFlow();
        return;
      }

      // Real Supabase User reload
      const reloadedUser = await authClient.reload();
      if (reloadedUser && reloadedUser.emailVerified) {
        triggerSuccessFlow();
      } else {
        showToast("Email not verified yet. Please click the link in your verification email and try again.", "error");
      }
    } catch (err: any) {
      showToast("Network error during verification check. Please retry.", "error");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div
      id="verification-gate-root"
      className={`min-h-screen flex flex-col justify-center items-center px-6 py-12 relative z-10 transition-colors duration-500 overflow-hidden ${
        isDark ? "bg-[#121211] text-[#FAF9F6]" : "bg-[#FAF9F6] text-[#1A1A1A]"
      }`}
    >
      {/* Background visual graphics */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[linear-gradient(to_right,rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.05)_1px,transparent_1px)] [background-size:60px_60px]" />
        <div className="absolute -top-[20%] w-[50%] h-[50%] rounded-full bg-[#F27D26]/5 blur-[120px]" />
      </div>

      {/* Verification Card */}
      <motion.div
        id="verification-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`max-w-md w-full rounded-3xl p-8 border backdrop-blur-md shadow-2xl relative z-10 text-center transition-all ${
          isDark
            ? "bg-[#111110]/90 border-white/10 shadow-black/40"
            : "bg-white/95 border-black/10 shadow-neutral-200/50"
        }`}
      >
        <AnimatePresence mode="wait">
          {!verifiedSuccess ? (
            <motion.div
              key="verification-pending-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* success-style illustration */}
              <div className="relative flex justify-center mb-2">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                  }}
                  className={`w-20 h-20 rounded-full flex items-center justify-center relative ${
                    isDark ? "bg-[#F27D26]/10 text-[#F27D26]" : "bg-[#F27D26]/5 text-[#F27D26]"
                  }`}
                >
                  <Mail className="w-10 h-10 animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500"></span>
                  </span>
                </motion.div>
                <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                  <div className={`px-2.5 py-0.5 rounded-full text-[8px] font-mono tracking-wider uppercase font-semibold border ${
                    isDark ? "bg-[#1A1A1A] border-white/10 text-white/60" : "bg-neutral-100 border-neutral-200 text-neutral-600"
                  }`}>
                    Awaiting Verification
                  </div>
                </div>
              </div>

              {/* Headings */}
              <div className="space-y-2 pt-2">
                <h1 className="text-2xl font-bold font-sans tracking-tight text-[#1A1A1A] dark:text-white">
                  Verify Your Email
                </h1>
                <p className="text-xs opacity-75 leading-relaxed max-w-sm mx-auto">
                  Your account is almost ready. Please verify your email address to unlock all interactive modules and AI workspaces.
                </p>
              </div>

              {/* Email Address Display Box */}
              <div className={`p-3 rounded-2xl border flex items-center justify-center gap-2.5 font-mono text-xs ${
                isDark ? "bg-white/5 border-white/10 text-orange-400" : "bg-neutral-50 border-black/5 text-orange-600 font-semibold"
              }`}>
                <span className="opacity-50 text-[10px] uppercase tracking-wider font-sans">Email:</span>
                <span className="truncate max-w-[220px]">{user.email}</span>
              </div>

              {/* Status checking indicator */}
              <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-wider opacity-60">
                <RefreshCw className="w-3 h-3 animate-spin text-orange-500" />
                <span>Checking status automatically...</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                <button
                  onClick={handleManualCheck}
                  disabled={isChecking}
                  className={`w-full py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 disabled:opacity-50 ${
                    isDark
                      ? "bg-white text-[#121211] hover:bg-neutral-200 shadow-white/5"
                      : "bg-black text-white hover:bg-neutral-900 shadow-neutral-900/10"
                  }`}
                >
                  {isChecking ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <>
                      <span>I've Verified My Email</span>
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    </>
                  )}
                </button>

                <button
                  onClick={handleResend}
                  disabled={resendCountdown > 0 || isResending}
                  className={`w-full py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider border transition duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60 ${
                    isDark
                      ? "border-white/10 hover:bg-white/5 text-white"
                      : "border-black/10 hover:bg-black/5 text-[#1A1A1A]"
                  }`}
                >
                  {isResending ? (
                    <span>Sending code...</span>
                  ) : resendCountdown > 0 ? (
                    <span className="opacity-70 font-mono">Resend available in {resendCountdown}s</span>
                  ) : (
                    <>
                      <span>Resend Verification Email</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Bottom logout navigation */}
              <div className="pt-2 border-t border-neutral-500/10 flex justify-between items-center text-xs">
                <span className="opacity-50">Logged in as {user.name || "Developer"}</span>
                <button
                  onClick={onSignOut}
                  className="text-red-500 font-semibold hover:underline flex items-center gap-1 cursor-pointer focus:outline-none"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="verification-success-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 py-6"
            >
              {/* Success animation circle */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                >
                  <CheckCircle className="w-12 h-12" />
                </motion.div>
              </div>

              {/* Success text */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-emerald-500">
                  Verification Successful!
                </h2>
                <p className="text-xs opacity-75 max-w-xs mx-auto">
                  Your workspace has been successfully authenticated. Directing you to your main algorithmic console...
                </p>
              </div>

              {/* Loading progress meter */}
              <div className="pt-4 flex flex-col items-center space-y-2">
                <div className="h-1 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ left: "-100%" }}
                    animate={{ left: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    className="h-full w-1/2 bg-emerald-500 absolute"
                  />
                </div>
                <span className="text-[9px] font-mono tracking-widest uppercase opacity-40">
                  Initializing Sandbox Environment
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Toast notifications portal */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={`p-4 rounded-2xl border shadow-xl flex items-start gap-3 pointer-events-auto ${
                t.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/15 text-emerald-500"
                  : t.type === "error"
                  ? "bg-red-500/10 border-red-500/15 text-red-500"
                  : "bg-blue-500/10 border-blue-500/15 text-blue-500"
              }`}
            >
              {t.type === "success" && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
              {t.type === "error" && <ShieldAlert className="w-5 h-5 flex-shrink-0" />}
              {t.type === "info" && <Sparkles className="w-5 h-5 flex-shrink-0" />}
              <div className="text-xs leading-relaxed font-sans">{t.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
