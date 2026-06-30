import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { authClient } from "../lib/supabase";
import ForgotPassword from "./ForgotPassword";
import { Mail, Lock, User as UserIcon, ArrowRight, CheckCircle, AlertCircle, Sparkles, Eye, EyeOff } from "lucide-react";

interface AuthProps {
  theme: "light" | "dark";
  onSuccess: (user: any) => void;
  onNavigate: (page: string) => void;
}

export default function Auth({ theme, onSuccess, onNavigate }: AuthProps) {
  const isDark = theme === "dark";
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<any[]>([]);

  // Field-specific validation states
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});

  // Auto-fill remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem("mentra_remembered_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateEmail = (val: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-neutral-500/20" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score, label: "Weak", color: "bg-rose-500" };
    if (score <= 3) return { score, label: "Fair", color: "bg-amber-500" };
    return { score, label: "Strong", color: "bg-emerald-500" };
  };

  const translateError = (errorMsg: string): string => {
    const msg = errorMsg.toLowerCase();
    if (
      msg.includes("invalid login credentials") ||
      msg.includes("invalid email") ||
      msg.includes("invalid password") ||
      msg.includes("invalid password or email") ||
      msg.includes("password is incorrect") ||
      msg.includes("credentials")
    ) {
      return "The email or password you entered is incorrect.";
    }
    if (msg.includes("email not confirmed") || msg.includes("email not verified")) {
      return "Please verify your email before signing in.";
    }
    if (msg.includes("user not found") || msg.includes("no user found") || msg.includes("does not exist")) {
      return "We couldn't find an account with that email.";
    }
    if (
      msg.includes("weak password") ||
      msg.includes("at least 6 characters") ||
      msg.includes("at least 8 characters") ||
      msg.includes("should be at least")
    ) {
      return "Choose a stronger password with at least 8 characters.";
    }
    if (
      msg.includes("network") ||
      msg.includes("fetch") ||
      msg.includes("failed to fetch") ||
      msg.includes("connection")
    ) {
      return "We couldn't connect to our servers. Please check your internet connection and try again.";
    }
    if (msg.includes("user already exists") || msg.includes("already registered")) {
      return "An account with this email address already exists.";
    }
    return "Something went wrong. Please try again.";
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setGeneralError(null);
    setSuccessMsg(null);

    // Clear validation errors
    const errors: typeof fieldErrors = {};

    // Validate email
    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else if (!validateEmail(email)) {
      errors.email = "Please input a valid email format (e.g. name@domain.com).";
    }

    // Validate password
    if (!password) {
      errors.password = "Password is required.";
    } else if (isSignUp && password.length < 8) {
      errors.password = "Choose a stronger password with at least 8 characters.";
    }

    // Validate name (if signing up)
    if (isSignUp && !name.trim()) {
      errors.name = "Full name is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    setFieldErrors({});

    // Handle Remember Me
    if (rememberMe) {
      localStorage.setItem("mentra_remembered_email", email);
    } else {
      localStorage.removeItem("mentra_remembered_email");
    }

    const triggerConfettiEffect = () => {
      const colors = ["#F27D26", "#3B82F6", "#10B981", "#FBBF24", "#EC4899", "#8B5CF6", "#A855F7"];
      const shapes = ["circle", "square", "triangle"];
      const pieces = Array.from({ length: 45 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 150;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 20,
          size: 5 + Math.random() * 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          delay: Math.random() * 0.1,
          rotation: Math.random() * 360,
        };
      });
      setConfettiPieces(pieces);
      setShowConfetti(true);
    };

    try {
      if (isSignUp) {
        const { user, error: signUpErr } = await authClient.signUp(email, password, name);
        if (signUpErr) {
          setGeneralError(translateError(signUpErr.message));
        } else if (user) {
          setSuccessMsg("Account created successfully! Preparing your workspace...");
          triggerConfettiEffect();
          setTimeout(() => {
            onSuccess(user);
          }, 1500);
        }
      } else {
        const { user, error: signInErr } = await authClient.signIn(email, password);
        if (signInErr) {
          setGeneralError(translateError(signInErr.message));
        } else if (user) {
          setSuccessMsg("Welcome back! Initiating secure session...");
          triggerConfettiEffect();
          setTimeout(() => {
            onSuccess(user);
          }, 1500);
        }
      }
    } catch (err: any) {
      setGeneralError(translateError(err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(password);

  return (
    <div id="auth-container" className="max-w-md w-full mx-auto px-6 py-12 relative z-10">
      {/* Confetti Animation Overlay */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
          {confettiPieces.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.3, 1, 0],
                x: p.x,
                y: p.y + 120,
                rotate: p.rotation + 720,
              }}
              transition={{
                duration: 1.4,
                ease: "easeOut",
                delay: p.delay,
              }}
              className={`absolute left-1/2 top-1/2 ${
                p.shape === "circle" ? "rounded-full" : p.shape === "triangle" ? "rotate-45" : "rounded-sm"
              }`}
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
              }}
            />
          ))}
        </div>
      )}

      {/* Ambient Visual Beam */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#F27D26]/5 rounded-full blur-[90px] pointer-events-none z-0" />

      <motion.div
        id="auth-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`relative z-10 rounded-3xl p-8 border backdrop-blur-md shadow-2xl transition-all ${
          isDark
            ? "bg-[#121211]/85 border-white/10 shadow-black/40 text-white"
            : "bg-[#FAF9F6]/95 border-black/10 shadow-neutral-200/50 text-[#1A1A1A]"
        }`}
      >
        <AnimatePresence mode="wait">
          {isForgotPassword ? (
            <ForgotPassword
              theme={theme}
              onBackToLogin={() => {
                setIsForgotPassword(false);
                setGeneralError(null);
                setSuccessMsg(null);
                setFieldErrors({});
              }}
            />
          ) : (
            <motion.div
              key="auth-login-signup-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header Logo Visual */}
              <div className="flex flex-col items-center mb-8 text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-lg ${
                  isDark ? "bg-white text-black" : "bg-black text-white"
                }`}>
                  <div className={`w-3.5 h-3.5 rotate-45 ${isDark ? "bg-[#121211]" : "bg-[#FAF9F6]"}`} />
                </div>
                <h2 className="text-2xl font-sans font-bold uppercase tracking-widest leading-none">
                  Mentra
                </h2>
                <span className="block text-[8px] font-mono tracking-[0.3em] text-[#F27D26] font-semibold uppercase mt-1">
                  Intelligence Workspace
                </span>
                <p className="mt-3.5 text-xs opacity-75 max-w-[280px] mx-auto">
                  {isSignUp ? "Create your workspace profile to start tracking challenges." : "Access your secure workspace and resume practicing."}
                </p>
              </div>

              {/* Success / Error Messages */}
              <AnimatePresence mode="wait">
                {generalError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/15 text-rose-500 text-xs flex items-start gap-2.5 shadow-sm"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                    <span className="leading-relaxed">{generalError}</span>
                  </motion.div>
                )}

                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 text-xs flex items-start gap-2.5 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" />
                    <span className="leading-relaxed font-medium">{successMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleAuth} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider uppercase opacity-60 flex justify-between">
                      <span>Full Name</span>
                      {fieldErrors.name && <span className="text-rose-500 normal-case font-sans">{fieldErrors.name}</span>}
                    </label>
                    <div className="relative">
                      <UserIcon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                        fieldErrors.name ? "text-rose-500" : "opacity-45"
                      }`} />
                      <input
                        type="text"
                        disabled={loading}
                        placeholder="Ada Lovelace"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
                        }}
                        className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-xs transition outline-none ${
                          fieldErrors.name
                            ? "border-rose-500 bg-rose-500/5 focus:border-rose-500 text-rose-500 placeholder-rose-400/40"
                            : isDark
                            ? "bg-white/5 border-white/10 focus:border-white focus:bg-white/10 text-white"
                            : "bg-black/5 border-black/10 focus:border-black focus:bg-white text-[#1A1A1A]"
                        }`}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase opacity-60 flex justify-between">
                    <span>Email Address</span>
                    {fieldErrors.email && <span className="text-rose-500 normal-case font-sans">{fieldErrors.email}</span>}
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      fieldErrors.email ? "text-rose-500" : "opacity-45"
                    }`} />
                    <input
                      type="email"
                      disabled={loading}
                      placeholder="developer@mentra.ai"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                      }}
                      className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-xs transition outline-none ${
                        fieldErrors.email
                          ? "border-rose-500 bg-rose-500/5 focus:border-rose-500 text-rose-500 placeholder-rose-400/40"
                          : isDark
                          ? "bg-white/5 border-white/10 focus:border-white focus:bg-white/10 text-white"
                          : "bg-black/5 border-black/10 focus:border-black focus:bg-white text-[#1A1A1A]"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono tracking-wider uppercase opacity-60">
                      <span>Password</span>
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setGeneralError(null);
                          setSuccessMsg(null);
                          setFieldErrors({});
                        }}
                        className="text-[10px] font-sans text-[#F27D26] hover:underline transition cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      fieldErrors.password ? "text-rose-500" : "opacity-45"
                    }`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      disabled={loading}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                      }}
                      className={`w-full pl-11 pr-11 py-2.5 rounded-xl border text-xs transition outline-none ${
                        fieldErrors.password
                          ? "border-rose-500 bg-rose-500/5 focus:border-rose-500 text-rose-500 placeholder-rose-400/40"
                          : isDark
                          ? "bg-white/5 border-white/10 focus:border-white focus:bg-white/10 text-white"
                          : "bg-black/5 border-black/10 focus:border-black focus:bg-white text-[#1A1A1A]"
                      }`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-[10px] text-rose-500 font-sans mt-0.5">{fieldErrors.password}</p>
                  )}

                  {/* Password strength indicator for signup */}
                  {isSignUp && password && (
                    <div className="pt-2 space-y-1">
                      <div className="flex justify-between text-[9px] font-mono opacity-60">
                        <span>Strength: <strong className="text-neutral-300">{strength.label}</strong></span>
                        <span>min 8 chars</span>
                      </div>
                      <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${strength.color}`}
                          style={{ width: `${(strength.score / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Remember Me Toggle */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-neutral-300 dark:border-neutral-700 text-[#F27D26] focus:ring-[#F27D26] w-3.5 h-3.5 bg-transparent"
                  />
                  <label htmlFor="remember-me" className="text-[10px] font-sans opacity-70 cursor-pointer select-none">
                    Remember me on this browser
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 mt-4 cursor-pointer active:scale-95 disabled:opacity-50 ${
                    isDark
                      ? "bg-[#F27D26] text-white hover:bg-[#F27D26]/90 shadow-lg shadow-[#F27D26]/10"
                      : "bg-black text-white hover:bg-[#1A1A1A]/90 shadow-lg shadow-black/10"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Initializing Sandbox...</span>
                    </div>
                  ) : (
                    <>
                      <span>{isSignUp ? "Create Account" : "Access Workspace"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom login switcher */}
              <div className="mt-6 text-center text-xs opacity-75 border-t border-neutral-500/10 pt-4">
                {isSignUp ? (
                  <p>
                    Already have configured credentials?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(false);
                        setGeneralError(null);
                        setSuccessMsg(null);
                        setFieldErrors({});
                      }}
                      className="font-bold text-[#F27D26] hover:underline cursor-pointer focus:outline-none"
                    >
                      Log In & Access
                    </button>
                  </p>
                ) : (
                  <p>
                    New to Mentra?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(true);
                        setGeneralError(null);
                        setSuccessMsg(null);
                        setFieldErrors({});
                      }}
                      className="font-bold text-[#F27D26] hover:underline cursor-pointer focus:outline-none"
                    >
                      Sign Up Now
                    </button>
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
