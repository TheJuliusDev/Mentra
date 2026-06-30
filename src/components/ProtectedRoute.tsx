import React, { useEffect } from "react";
import { motion } from "motion/react";
import { ShieldAlert } from "lucide-react";

interface ProtectedRouteProps {
  user: any;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

export default function ProtectedRoute({ user, onNavigate, children }: ProtectedRouteProps) {
  useEffect(() => {
    if (!user) {
      // Small timeout for nice visual redirect effect
      const timer = setTimeout(() => {
        onNavigate("auth");
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [user, onNavigate]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-6 text-center max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-3xl flex flex-col items-center shadow-xl backdrop-blur-sm"
        >
          <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 mb-4 animate-bounce">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold font-sans tracking-wide uppercase">
            Restricted Sandbox Workspace
          </h3>
          <p className="text-xs opacity-70 mt-2 leading-relaxed">
            This module contains premium algorithmic tests and AI companion channels. You are being redirected to the authentication portal to configure your workspace profile.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F27D26] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F27D26]"></span>
            </span>
            <span className="text-[10px] font-mono tracking-wider opacity-60 uppercase">
              Redirecting to authentication console...
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (user && user.emailVerified === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-6 text-center max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl flex flex-col items-center shadow-xl backdrop-blur-sm"
        >
          <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mb-4 animate-bounce">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold font-sans tracking-wide uppercase text-red-500">
            Email Verification Required
          </h3>
          <p className="text-xs opacity-70 mt-2 leading-relaxed">
            Please verify your email address to access Mentra's premium features. You can verify it directly from your dashboard hub.
          </p>
          <button
            onClick={() => onNavigate("home")}
            className="mt-6 px-4 py-2 rounded-xl text-xs font-semibold bg-[#F27D26] text-white hover:bg-[#F27D26]/90 transition"
          >
            Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
