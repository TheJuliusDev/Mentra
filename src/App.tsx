/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ThreeDNeuralGalaxy from "./components/ThreeDNeuralGalaxy";
import {
  PageHome,
  PageFeatures,
  PagePractice,
  PageCompanion,
  PageAbout,
  PageBlog,
  PageFAQ,
  PageContact,
  Page404,
} from "./components/Pages";
import { Challenge } from "./types";
import { authClient, AuthUser } from "./lib/supabase";
import Auth from "./components/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import MobileApp from "./components/MobileApp";

export default function App() {
  // Authentication State
  const [user, setUser] = useState<AuthUser | null>(null);

  // Theme state: Persist light/dark theme preference
  const [theme, setTheme] = useState<"light" | "dark">((() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mentra-theme");
      if (stored === "light" || stored === "dark") return stored;
      // Default to eye-safe dark mode for developer vibe
      return "dark";
    }
    return "dark";
  })());

  // Navigation State
  const [activePage, setActivePage] = useState<string>("home");

  // Portal view control: whether logged-in user is explicitly viewing landing portal
  const [showLandingPortal, setShowLandingPortal] = useState<boolean>(false);

  // Global selected challenge (passed from practice list to sandbox editor)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | undefined>(undefined);

  // Listen to active auth session changes
  useEffect(() => {
    const unsubscribe = authClient.onAuthStateChange((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setShowLandingPortal(false);
      } else {
        setShowLandingPortal(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync theme with HTML document element for global Tailwind dark mode capability
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("mentra-theme", theme);
  }, [theme]);

  // Read and write URL Hash for seamless SPA router simulation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && ["home", "features", "practice", "companion", "about", "blog", "faq", "contact", "auth", "mobile"].includes(hash)) {
        setActivePage(hash);
      } else if (hash) {
        setActivePage("404");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // Trigger on initial load
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (page: string) => {
    window.location.hash = page === "home" ? "" : `#${page}`;
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleSelectChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  const isDark = theme === "dark";

  if (user && !showLandingPortal) {
    return (
      <ErrorBoundary theme={theme}>
        <Dashboard
          theme={theme}
          toggleTheme={toggleTheme}
          user={user}
          onSignOut={async () => {
            await authClient.signOut();
            navigateTo("home");
          }}
          onNavigateToPublic={() => {
            setShowLandingPortal(true);
            navigateTo("home");
          }}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary theme={theme}>
      <div
        className={`min-h-screen flex flex-col transition-colors duration-500 relative ${
          isDark ? "bg-[#121211] text-[#FAF9F6]" : "bg-[#FAF9F6] text-[#1A1A1A]"
        }`}
      >
      {/* Ambient Grain Overlay (Subtle tactile paper texture) */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.025] dark:opacity-[0.035]"
        style={{
          backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E')`,
        }}
      />

      {/* Premium subtle background grid lines (Asymmetrical subtle grid) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-15 dark:opacity-25 bg-[linear-gradient(to_right,rgba(128,128,128,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.06)_1px,transparent_1px)] [background-size:80px_80px]" />
        {/* Slow moving soft background gradient light beam */}
        <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#F27D26]/4 blur-[120px] animate-pulse [animation-duration:12s]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#F27D26]/3 blur-[100px] animate-pulse [animation-duration:15s]" />
      </div>

      {/* Floating ThreeDNeuralGalaxy canvas behind standard Hero layout or on absolute left-right margins */}
      {activePage === "home" && (
        <div className="absolute top-18 right-0 w-full lg:w-[50%] h-[500px] lg:h-[700px] pointer-events-auto z-10 opacity-75 dark:opacity-90">
          <ThreeDNeuralGalaxy theme={theme} />
        </div>
      )}

      {/* Sticky Blurred Glass Navigation Header */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        activePage={activePage}
        onNavigate={navigateTo}
        user={user}
        onSignOut={async () => {
          await authClient.signOut();
          navigateTo("home");
        }}
        showLandingPortal={showLandingPortal}
        onEnterDashboard={() => setShowLandingPortal(false)}
      />

      {/* Main Page Content Body */}
      <main className="flex-1 z-20 pt-18">
        {activePage === "home" && (
          <PageHome theme={theme} onNavigate={navigateTo} onSelectChallenge={handleSelectChallenge} />
        )}
        {activePage === "features" && <PageFeatures theme={theme} onNavigate={navigateTo} />}
        {activePage === "practice" && (
          <ProtectedRoute user={user} onNavigate={navigateTo}>
            <PagePractice theme={theme} onNavigate={navigateTo} onSelectChallenge={handleSelectChallenge} />
          </ProtectedRoute>
        )}
        {activePage === "companion" && (
          <ProtectedRoute user={user} onNavigate={navigateTo}>
            <PageCompanion theme={theme} onNavigate={navigateTo} />
          </ProtectedRoute>
        )}
        {activePage === "about" && <PageAbout theme={theme} onNavigate={navigateTo} />}
        {activePage === "blog" && <PageBlog theme={theme} onNavigate={navigateTo} />}
        {activePage === "faq" && <PageFAQ theme={theme} onNavigate={navigateTo} />}
        {activePage === "contact" && <PageContact theme={theme} onNavigate={navigateTo} />}
        {activePage === "mobile" && <MobileApp theme={theme} user={user} />}
        {activePage === "auth" && (
          <Auth
            theme={theme}
            onSuccess={(currentUser) => {
              setUser(currentUser);
              setShowLandingPortal(false);
              navigateTo("home");
            }}
            onNavigate={navigateTo}
          />
        )}
        {activePage === "404" && <Page404 theme={theme} onNavigate={navigateTo} />}
      </main>

      {/* Structured Footer */}
      <Footer theme={theme} onNavigate={navigateTo} />
    </div>
    </ErrorBoundary>
  );
}
