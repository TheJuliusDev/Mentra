/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, Sparkles, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
  user: any;
  onSignOut: () => void;
  showLandingPortal?: boolean;
  onEnterDashboard?: () => void;
}

export default function Header({
  theme,
  toggleTheme,
  activePage,
  onNavigate,
  user,
  onSignOut,
  showLandingPortal,
  onEnterDashboard,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor page scrolling for blurred header transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "features", label: "Features" },
    { id: "practice", label: "Practice" },
    { id: "companion", label: "Companion" },
    { id: "mobile", label: "Mobile App 📱" },
    { id: "about", label: "About" },
    { id: "blog", label: "Journal" },
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Contact" },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const isDark = theme === "dark";

  return (
    <>
      <header
        id="app-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? isDark
              ? "bg-[#121211]/90 border-b border-white/5 backdrop-blur-md shadow-2xl shadow-black/40"
              : "bg-[#FAF9F6]/90 border-b border-black/5 backdrop-blur-md shadow-sm"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo - Geometric & Editorial */}
          <button
            id="brand-logo-trigger"
            onClick={() => onNavigate("home")}
            className="flex items-center space-x-3 hover:opacity-80 transition group text-left"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:rotate-90 duration-500 ${isDark ? "bg-white" : "bg-black"}`}>
              <div className={`w-2.5 h-2.5 rotate-45 ${isDark ? "bg-[#121211]" : "bg-[#FAF9F6]"}`} />
            </div>
            <div>
              <span className="font-sans text-lg font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white leading-none block">
                Mentra
              </span>
              <span className="block text-[8px] font-mono tracking-[0.25em] text-[#F27D26] font-semibold uppercase mt-0.5">
                Intelligence
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link, idx) => {
              const isActive = activePage === link.id;
              return (
                <div key={link.id} className="flex items-center">
                  <button
                    id={`nav-link-${link.id}`}
                    onClick={() => handleLinkClick(link.id)}
                    className={`relative px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                      isActive
                        ? isDark
                          ? "text-[#F27D26] bg-white/5 font-semibold"
                          : "text-[#FAF9F6] bg-black font-semibold"
                        : isDark
                        ? "text-white/60 hover:text-white"
                        : "text-[#1A1A1A]/70 hover:text-black"
                    }`}
                  >
                    {link.label}
                  </button>
                  {/* Subtle dividers between specific groups or just spacing */}
                  {idx === 3 && (
                    <div className="h-3 w-[1px] bg-black/10 dark:bg-white/10 mx-2" />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Action Tools */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition ${
                isDark
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-amber-400"
                  : "bg-black/5 border-black/10 hover:bg-black/10 text-neutral-700"
              }`}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Auth / Account Controls and Get Started button */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className={`px-3.5 py-1.5 rounded-full text-xs font-mono border flex items-center gap-2 ${
                  isDark ? "bg-white/5 border-white/10 text-white" : "bg-black/5 border-black/10 text-black"
                }`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="max-w-[120px] truncate">{user.name || user.email}</span>
                </div>
                <button
                  id="sign-out-topbar"
                  onClick={onSignOut}
                  className={`px-4 py-2 rounded-full font-semibold text-xs transition duration-300 transform active:scale-95 ${
                    isDark
                      ? "border border-white/10 hover:bg-white/5 text-white/80 hover:text-white"
                      : "border border-black/10 hover:bg-black/5 text-black/80 hover:text-black"
                  }`}
                >
                  Sign Out
                </button>
                {showLandingPortal && onEnterDashboard ? (
                  <button
                    id="enter-workspace-topbar"
                    onClick={onEnterDashboard}
                    className="px-5 py-2.5 rounded-full font-semibold text-xs transition duration-300 transform active:scale-95 flex items-center gap-1.5 bg-[#F27D26] hover:bg-[#F27D26]/90 text-white shadow-lg shadow-[#F27D26]/10"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    Enter Workspace
                  </button>
                ) : (
                  <button
                    id="get-started-topbar"
                    onClick={() => {
                      onNavigate("practice");
                      setTimeout(() => {
                        const el = document.getElementById("interactive-showcase");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    className={`px-6 py-2.5 rounded-full font-semibold text-xs transition duration-300 transform active:scale-95 ${
                      isDark
                        ? "bg-white text-black hover:bg-[#FAF9F6]/90 shadow-lg shadow-white/5"
                        : "bg-black text-white hover:bg-[#1A1A1A]/90 shadow-lg shadow-black/10"
                    }`}
                  >
                    Get Started
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  id="login-link-topbar"
                  onClick={() => onNavigate("auth")}
                  className={`px-4 py-2 text-xs font-semibold transition opacity-85 hover:opacity-100 ${
                    isDark ? "text-white" : "text-[#1A1A1A]"
                  }`}
                >
                  Log In
                </button>
                <button
                  id="get-started-topbar"
                  onClick={() => onNavigate("auth")}
                  className={`px-6 py-2.5 rounded-full font-semibold text-xs transition duration-300 transform active:scale-95 ${
                    isDark
                      ? "bg-white text-black hover:bg-[#FAF9F6]/90 shadow-lg shadow-white/5"
                      : "bg-black text-white hover:bg-[#1A1A1A]/90 shadow-lg shadow-black/10"
                  }`}
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Actions Selector */}
          <div className="flex lg:hidden items-center space-x-3">
            {/* Theme Toggle */}
            <button
              id="mobile-theme-toggle"
              onClick={toggleTheme}
              className={`p-2 rounded-full border ${
                isDark ? "bg-white/5 border-white/10 text-amber-400" : "bg-black/5 border-black/10 text-neutral-700"
              }`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Hamburger Trigger */}
            <button
              id="hamburger-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-full border ${
                isDark ? "bg-white/5 border-white/10 text-white" : "bg-black/5 border-black/10 text-black"
              }`}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-x-0 top-20 z-40 p-6 border-b lg:hidden shadow-2xl ${
              isDark ? "bg-[#121211] border-white/10 text-[#FAF9F6]" : "bg-[#FAF9F6] border-black/10 text-[#1A1A1A]"
            }`}
          >
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => {
                  const isActive = activePage === link.id;
                  return (
                    <button
                      key={link.id}
                      id={`mobile-nav-link-${link.id}`}
                      onClick={() => handleLinkClick(link.id)}
                      className={`px-4 py-3 rounded-full text-xs font-medium text-left transition ${
                        isActive
                          ? isDark
                            ? "bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/25"
                            : "bg-black text-white"
                          : isDark
                          ? "text-white/60 hover:bg-white/5"
                          : "text-[#1A1A1A]/70 hover:bg-black/5"
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-3">
                {user ? (
                  <>
                    <div className={`px-4 py-3 rounded-full text-xs font-mono border flex items-center justify-between ${
                      isDark ? "bg-white/5 border-white/10 text-white" : "bg-black/5 border-black/10 text-black"
                    }`}>
                      <span className="truncate">{user.name || user.email}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <button
                      id="mobile-sign-out"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onSignOut();
                      }}
                      className={`w-full py-3.5 rounded-full font-semibold text-xs text-center border block ${
                        isDark
                          ? "border-white/15 text-white hover:bg-white/5"
                          : "border-black/15 text-black hover:bg-black/5"
                      }`}
                    >
                      Sign Out
                    </button>
                    <button
                      id="mobile-get-started"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onNavigate("practice");
                        setTimeout(() => {
                          const el = document.getElementById("interactive-showcase");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      }}
                      className={`w-full py-3.5 rounded-full font-semibold text-xs text-center block shadow-lg ${
                        isDark ? "bg-white text-black" : "bg-black text-white"
                      }`}
                    >
                      Get Started
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      id="mobile-login"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onNavigate("auth");
                      }}
                      className={`w-full py-3.5 rounded-full font-semibold text-xs text-center border block ${
                        isDark
                          ? "border-white/15 text-white hover:bg-white/5"
                          : "border-black/15 text-black hover:bg-black/5"
                      }`}
                    >
                      Log In
                    </button>
                    <button
                      id="mobile-get-started"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onNavigate("auth");
                      }}
                      className={`w-full py-3.5 rounded-full font-semibold text-xs text-center block shadow-lg ${
                        isDark ? "bg-white text-black" : "bg-black text-white"
                      }`}
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
