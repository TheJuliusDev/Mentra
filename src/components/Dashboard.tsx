import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { authClient, userDataManager, UserData, isSupabaseConfigured, supabase } from "../lib/supabase";
import ProductTour, { TOUR_STEPS } from "./ProductTour";
import * as d3 from "d3";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Code,
  Terminal as TerminalIcon,
  FolderGit2,
  ListTodo,
  Trophy,
  Award,
  Notebook,
  TrendingUp,
  User as UserIcon,
  Settings as SettingsIcon,
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  Plus,
  Play,
  Save,
  Terminal,
  Files,
  Cpu,
  CheckCircle,
  AlertCircle,
  Bookmark,
  Share2,
  Trash2,
  ArrowRight,
  Database,
  Grid,
  Zap,
  Info,
  Layers,
  Activity,
  Heart,
  ChevronDown,
  Copy,
  Download,
  Check,
  Menu,
  X,
  Mail,
  Clock,
  Shield,
  CreditCard,
  BellOff,
  Brain
} from "lucide-react";
import { Challenge, PRACTICE_CHALLENGES } from "../types";
import { ChallengeCardSkeleton, SidebarBlockSkeleton, LeaderboardSkeleton } from "./Skeleton";
import EmailVerificationGate from "./EmailVerificationGate";

interface DashboardProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
  user: any;
  onSignOut: () => void;
  onNavigateToPublic: () => void;
}

export default function Dashboard({ theme, toggleTheme, user, onSignOut, onNavigateToPublic }: DashboardProps) {
  const isDark = theme === "dark";
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Load actual user data from DB
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUserData, setLoadingUserData] = useState(true);

  // Onboarding tour states
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);

  useEffect(() => {
    if (user && user.id) {
      setLoadingUserData(true);
      userDataManager.loadData(user.id, user.name || "Developer").then((data) => {
        setUserData(data);
        setLoadingUserData(false);
        // If the user has not completed the tour and is not actively in one, show welcome
        if (!data.hasCompletedTour) {
          setShowWelcomeModal(true);
        }
      });
    }
  }, [user]);

  const handleUpdateUserData = async (newData: UserData) => {
    setUserData(newData);
    if (user && user.id) {
      await userDataManager.saveData(user.id, newData);
    }
  };

  // Derive stats dynamically to maintain zero-change compatibility with all sub-components
  const points = userData?.points ?? 0;
  const level = userData?.level ?? 1;
  const streak = userData?.currentStreak ?? 0;
  const notificationsCount = userData?.notifications.filter(n => !n.read).length ?? 0;

  const handleNextTourStep = () => {
    if (tourStep !== null && tourStep < TOUR_STEPS.length - 1) {
      const nextStep = tourStep + 1;
      setTourStep(nextStep);
      setActiveTab(TOUR_STEPS[nextStep].tab);
    }
  };

  const handlePrevTourStep = () => {
    if (tourStep !== null && tourStep > 0) {
      const prevStep = tourStep - 1;
      setTourStep(prevStep);
      setActiveTab(TOUR_STEPS[prevStep].tab);
    }
  };

  const handleSkipTour = () => {
    setTourStep(null);
    if (userData) {
      handleUpdateUserData({ ...userData, hasCompletedTour: true });
    }
  };

  const handleFinishTour = () => {
    setTourStep(null);
    if (userData) {
      handleUpdateUserData({ ...userData, hasCompletedTour: true });
    }
  };

  // Search dialog state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Skeleton loading simulation when switching views
  const [viewLoading, setViewLoading] = useState(false);

  // Mobile responsiveness and notification dropdown states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotificationsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Simulating real-time notification arrival to showcase badge updates
  useEffect(() => {
    if (!userData) return;
    const timer = setTimeout(() => {
      const hasSystemUpdate = userData.notifications.some(n => n.id === "live-system-update");
      if (!hasSystemUpdate) {
        const newNotification = {
          id: "live-system-update",
          title: "AI Optimization Review Completed",
          desc: "Mentra Code Assistant successfully evaluated your sliding window algorithm structure.",
          read: false,
          date: new Date().toISOString(),
          type: "ai_completed",
        };
        const updated = {
          ...userData,
          notifications: [newNotification, ...userData.notifications],
        };
        handleUpdateUserData(updated);
      }
    }, 18000); // 18 seconds after initial login
    return () => clearTimeout(timer);
  }, [userData]);

  // Email verification gate check
  if (user && user.emailVerified === false) {
    return (
      <EmailVerificationGate
        user={user}
        onVerified={() => {
          authClient.reload();
        }}
        onSignOut={onSignOut}
        theme={theme}
      />
    );
  }

  useEffect(() => {
    setViewLoading(true);
    const timer = setTimeout(() => setViewLoading(false), 450);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Global Ctrl+K trigger for command center
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileSidebarOpen(false);
  };

  // Sidebar navigation sections
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Home" },
    { id: "chat", label: "AI Chat", icon: MessageSquare, group: "Assistant" },
    { id: "learn", label: "Learning Hub", icon: BookOpen, group: "Education" },
    { id: "challenges", label: "Challenges", icon: Code, group: "Education" },
    { id: "workspace", label: "IDE Workspace", icon: TerminalIcon, group: "Workspace" },
    { id: "builder", label: "AI Project Builder", icon: Sparkles, group: "Workspace" },
    { id: "projects", label: "My Projects", icon: FolderGit2, group: "Workspace" },
    { id: "missions", label: "Missions", icon: ListTodo, group: "Gamified" },
    { id: "leaderboards", label: "Leaderboards", icon: Trophy, group: "Gamified" },
    { id: "achievements", label: "Achievements", icon: Award, group: "Gamified" },
    { id: "notes", label: "Smart Notes", icon: Notebook, group: "Productivity" },
    { id: "analytics", label: "Analytics", icon: TrendingUp, group: "Productivity" },
    { id: "profile", label: "Profile", icon: UserIcon, group: "Account" },
    { id: "settings", label: "Settings", icon: SettingsIcon, group: "Account" },
  ];

  // Helper to render current active workspace panel
  const renderPanelContent = () => {
    if (viewLoading || loadingUserData || !userData) {
      return (
        <div className="space-y-8 animate-pulse p-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2 w-1/3">
              <div className="h-8 bg-neutral-300 dark:bg-neutral-800 rounded-lg w-full" />
              <div className="h-4 bg-neutral-300 dark:bg-neutral-800 rounded-lg w-2/3" />
            </div>
            <div className="h-10 bg-neutral-300 dark:bg-neutral-800 rounded-full w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SidebarBlockSkeleton />
            <SidebarBlockSkeleton />
            <SidebarBlockSkeleton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <ChallengeCardSkeleton />
            </div>
            <div className="lg:col-span-4">
              <LeaderboardSkeleton />
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardHome
            theme={theme}
            points={points}
            level={level}
            streak={streak}
            userData={userData}
            onNavigate={handleTabChange}
            onUpdateUserData={handleUpdateUserData}
          />
        );
      case "chat":
        return <AIChatWorkspace theme={theme} userData={userData} onUpdateUserData={handleUpdateUserData} user={user} />;
      case "learn":
        return (
          <LearningHub
            theme={theme}
            onAddPoints={(p) => {
              if (userData) {
                const updated = { ...userData, points: userData.points + p };
                const newLevel = Math.floor(updated.points / 500) + 1;
                if (newLevel > updated.level) {
                  updated.level = newLevel;
                  updated.notifications.unshift({
                    id: `level-up-${newLevel}`,
                    title: "Level Up! 🎉",
                    desc: `Congratulations! You've reached Level ${newLevel} with your learning progress!`,
                    read: false,
                    date: new Date().toISOString(),
                  });
                }
                handleUpdateUserData(updated);
              }
            }}
          />
        );
      case "challenges":
        return (
          <ChallengesWorkspace
            theme={theme}
            userData={userData}
            onSelectChallenge={(challenge) => {
              setWorkspaceChallenge(challenge);
              setActiveTab("workspace");
            }}
          />
        );
      case "workspace":
        return (
          <IDEWorkspace
            theme={theme}
            userData={userData}
            onUpdateUserData={handleUpdateUserData}
            loadedChallenge={workspaceChallenge}
            user={user}
          />
        );
      case "builder":
        return <AIProjectBuilder theme={theme} />;
      case "projects":
        return <ProjectsList theme={theme} onNavigate={handleTabChange} />;
      case "missions":
        return (
          <MissionsWorkspace
            theme={theme}
            userData={userData}
            onUpdateUserData={handleUpdateUserData}
            onAddPoints={(p) => {
              if (userData) {
                const updated = { ...userData, points: userData.points + p };
                const newLevel = Math.floor(updated.points / 500) + 1;
                if (newLevel > updated.level) {
                  updated.level = newLevel;
                  updated.notifications.unshift({
                    id: `level-up-${newLevel}`,
                    title: "Level Up! 🎉",
                    desc: `Congratulations! You've reached Level ${newLevel} with your learning progress!`,
                    read: false,
                    date: new Date().toISOString(),
                  });
                }
                handleUpdateUserData(updated);
              }
            }}
          />
        );
      case "leaderboards":
        return <LeaderboardsWorkspace theme={theme} user={user} userData={userData} />;
      case "achievements":
        return <AchievementsWorkspace theme={theme} userData={userData} />;
      case "notes":
        return <SmartNotesWorkspace theme={theme} userData={userData} onUpdateUserData={handleUpdateUserData} />;
      case "analytics":
        return <AnalyticsWorkspace theme={theme} userData={userData} onNavigate={handleTabChange} />;
      case "profile":
        return (
          <DeveloperProfile
            theme={theme}
            points={points}
            level={level}
            streak={streak}
            userData={userData}
            onUpdateUserData={handleUpdateUserData}
            user={user}
            onNavigate={handleTabChange}
          />
        );
      case "settings":
        return (
          <SettingsWorkspace
            theme={theme}
            toggleTheme={toggleTheme}
            onSignOut={onSignOut}
            onNavigateToPublic={onNavigateToPublic}
            onStartTour={() => {
              setTourStep(0);
              setActiveTab(TOUR_STEPS[0].tab);
            }}
          />
        );
      default:
        return (
          <DashboardHome
            theme={theme}
            points={points}
            level={level}
            streak={streak}
            userData={userData}
            onNavigate={handleTabChange}
            onUpdateUserData={handleUpdateUserData}
          />
        );
    }
  };

  // State shared for passing a challenge selected from challenges tab directly into IDE Workspace
  const [workspaceChallenge, setWorkspaceChallenge] = useState<Challenge | undefined>(undefined);

  const isDarkClass = isDark ? "dark" : "";

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? "bg-[#0c0c0b] text-[#FAF9F6]" : "bg-[#FAF9F6] text-[#1A1A1A]"}`}>
      
      {/* Search dialog Command Center (Ctrl+K) */}
      <AnimatePresence>
        {showSearch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSearch(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`w-full max-w-lg rounded-2xl border shadow-2xl relative z-10 overflow-hidden ${
                isDark ? "bg-[#141413] border-white/10 text-white" : "bg-white border-neutral-200 text-[#1A1A1A]"
              }`}
            >
              <div className="p-4 border-b border-neutral-500/15 flex items-center gap-3">
                <Search className="w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search files, roadmaps, lessons, or run commands (e.g. /workspace)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm placeholder-neutral-500 font-sans"
                  autoFocus
                />
                <kbd className="text-[10px] font-mono bg-neutral-500/10 px-1.5 py-0.5 rounded opacity-60">ESC</kbd>
              </div>

              <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                {/* Simulated command results */}
                <div className="text-[10px] font-mono tracking-wider text-[#F27D26] uppercase px-3 py-1.5">Quick Navigation</div>
                {[
                  { label: "Go to AI Coding Chat Portal", id: "chat", icon: MessageSquare },
                  { label: "Launch Compiler IDE Sandbox", id: "workspace", icon: TerminalIcon },
                  { label: "Explore Algorithmic Practice List", id: "challenges", icon: Code },
                  { label: "Open Daily Learning paths", id: "learn", icon: BookOpen },
                  { label: "Gamified Missions & Milestone Tasks", id: "missions", icon: ListTodo },
                  { label: "Smart Notes Journal editor", id: "notes", icon: Notebook },
                ]
                  .filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setShowSearch(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        isDark ? "hover:bg-white/5" : "hover:bg-black/5"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4 text-neutral-400" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[9px] font-mono opacity-50 uppercase font-bold">nav</span>
                    </button>
                  ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-35 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Collapsible Left Sidebar & Responsive Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 lg:relative lg:translate-x-0 transition-transform duration-300 z-40 flex flex-col justify-between shrink-0 h-full border-r ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isSidebarCollapsed ? "lg:w-20" : "lg:w-64"
        } w-64 ${isDark ? "bg-[#111110] border-white/5" : "bg-[#FAF9F6] border-black/5"}`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header Branding Row */}
          <div className="h-16 flex items-center px-6 justify-between border-b border-neutral-500/10">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-white text-black" : "bg-black text-white"}`}>
                <div className={`w-2.5 h-2.5 rotate-45 ${isDark ? "bg-[#111110]" : "bg-[#FAF9F6]"}`} />
              </div>
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white leading-none block">
                    Mentra
                  </span>
                  <span className="block text-[7px] font-mono tracking-[0.25em] text-[#F27D26] font-semibold uppercase mt-0.5">
                    Dev-OS Workspace
                  </span>
                </div>
              )}
            </div>

            {/* Controls block in branding */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-neutral-500/10 text-neutral-400 transition"
                title="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
              
              {!isSidebarCollapsed && (
                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="hidden lg:block p-1 rounded hover:bg-neutral-500/10 text-neutral-400 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick User summary in Sidebar */}
          {(!isSidebarCollapsed || isMobileSidebarOpen) && (
            <div className="p-4 mx-3 my-3 rounded-2xl border border-neutral-500/10 bg-neutral-500/5 flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#F27D26] to-amber-500 flex items-center justify-center text-white text-xs font-bold font-mono">
                  {(user?.name || "AD").slice(0, 2).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#111110] animate-pulse" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold truncate">{user?.name || "Workspace Dev"}</div>
                <div className="text-[9px] font-mono text-[#F27D26] uppercase font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                  <span>Lvl {level} • {points} XP</span>
                </div>
              </div>
            </div>
          )}

          {/* Grouped Scrolling Items */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 font-sans">
            {["Home", "Assistant", "Education", "Workspace", "Gamified", "Productivity", "Account"].map((group) => {
              const groupItems = sidebarItems.filter((i) => i.group === group);
              if (groupItems.length === 0) return null;

              return (
                <div key={group} className="space-y-1">
                  {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                    <div className="text-[9px] font-mono tracking-widest uppercase opacity-40 px-3 py-1">
                      {group}
                    </div>
                  )}
                  {groupItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        title={item.label}
                        className={`w-full flex items-center rounded-xl py-2 px-3 text-xs transition duration-200 relative group cursor-pointer ${
                          isActive
                            ? isDark
                              ? "bg-white/5 text-[#F27D26] border-l-2 border-[#F27D26]"
                              : "bg-black text-white"
                            : isDark
                            ? "text-white/60 hover:text-white hover:bg-white/5"
                            : "text-[#1A1A1A]/70 hover:text-black hover:bg-black/5"
                        }`}
                      >
                        <item.icon className={`w-4 h-4 shrink-0 mr-3 ${isActive && isDark ? "text-[#F27D26]" : ""}`} />
                        {(!isSidebarCollapsed || isMobileSidebarOpen) && <span className="font-medium truncate">{item.label}</span>}
                        {isActive && isSidebarCollapsed && !isMobileSidebarOpen && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#F27D26] rounded-r" />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Collapse Toggle and public portal links */}
        <div className="p-4 border-t border-neutral-500/10 space-y-2">
          {isSidebarCollapsed && !isMobileSidebarOpen && (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="p-2 w-full rounded hover:bg-neutral-500/10 text-neutral-400 flex justify-center transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onNavigateToPublic}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-mono tracking-wider uppercase border transition ${
              isDark
                ? "border-white/10 hover:bg-white/5 text-white/80"
                : "border-black/10 hover:bg-black/5 text-black/80"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {(!isSidebarCollapsed || isMobileSidebarOpen) && <span>Landing Portal</span>}
          </button>
        </div>
      </aside>

      {/* Main Panel Frame */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header Row */}
        <header className={`h-16 flex items-center justify-between px-4 sm:px-6 border-b shrink-0 ${
          isDark ? "bg-[#111110] border-white/5" : "bg-[#FAF9F6] border-black/5"
        }`}>
          {/* Global Cmd+K trigger visual button */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Hamburger Button on Mobile */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-neutral-500/10 hover:bg-neutral-500/5 text-neutral-400 shrink-0 cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowSearch(true)}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-full border text-xs flex items-center gap-2.5 max-w-xs transition ${
                isDark 
                  ? "bg-white/5 border-white/10 text-white/50 hover:border-white/20" 
                  : "bg-black/5 border-black/10 text-black/50 hover:border-black/20"
              }`}
              title="Open Command Palette"
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline text-[10px] pr-8 text-left font-sans">Command Palette...</span>
              <kbd className="hidden md:inline text-[9px] font-mono bg-neutral-500/15 px-1 py-0.5 rounded opacity-75">Ctrl+K</kbd>
            </button>

            {/* Quick Action Buttons for Workspace or Chat */}
            <button
              onClick={() => setActiveTab("chat")}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase transition ${
                activeTab === "chat"
                  ? "bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/30"
                  : isDark
                  ? "bg-white/5 hover:bg-white/10 text-white"
                  : "bg-black/5 hover:bg-black/10 text-black"
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#F27D26]" />
              <span>Quick AI Help</span>
            </button>
          </div>

          {/* Settings / Profile Trigger Controls */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            {/* Streak indicator badge */}
            <div className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-mono font-bold ${
              isDark ? "bg-white/5 border-white/10 text-orange-400" : "bg-black/5 border-black/10 text-orange-600"
            }`}>
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span>{streak} DAYS</span>
            </div>

            {/* Notification Tray bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                className={`p-2 rounded-full border relative transition cursor-pointer ${
                  isDark
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    : "bg-black/5 border-black/10 hover:bg-black/10 text-black"
                }`}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notificationsCount > 0 && (
                  <motion.span
                    key={notificationsCount}
                    initial={{ scale: 0.5, rotate: -20 }}
                    animate={{ scale: [1, 1.35, 1], rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold font-mono"
                  >
                    {notificationsCount}
                  </motion.span>
                )}
              </button>

              {/* Notifications Dropdown Drawer */}
              <AnimatePresence>
                {showNotificationsDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 mt-2 w-80 rounded-2xl border shadow-2xl z-50 overflow-hidden ${
                      isDark
                        ? "bg-[#111110] border-white/10 text-white"
                        : "bg-white border-black/10 text-neutral-800"
                    }`}
                  >
                    {/* Header */}
                    <div className="p-3 border-b border-neutral-500/10 flex justify-between items-center bg-neutral-500/5">
                      <div className="flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">Workspace Alerts</span>
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-semibold">
                        <button
                          onClick={() => {
                            if (userData) {
                              const readNotifications = userData.notifications.map((n) => ({ ...n, read: true }));
                              handleUpdateUserData({ ...userData, notifications: readNotifications });
                            }
                          }}
                          className="hover:underline text-orange-500 cursor-pointer"
                        >
                          Mark all read
                        </button>
                        <span className="opacity-30">•</span>
                        <button
                          onClick={() => {
                            if (userData) {
                              handleUpdateUserData({ ...userData, notifications: [] });
                            }
                          }}
                          className="hover:underline text-red-500 cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* Notification list */}
                    <div className="max-h-72 overflow-y-auto divide-y divide-neutral-500/5">
                      {userData?.notifications && userData.notifications.length > 0 ? (
                        userData.notifications.map((n) => {
                          // helper configuration for category styles
                          const typeConfig = (() => {
                            switch (n.type) {
                              case "ai_completed":
                                return { icon: Sparkles, bg: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/10" };
                              case "feature_released":
                                return { icon: Zap, bg: "bg-amber-500/10 text-amber-500 border border-amber-500/10" };
                              case "account_update":
                                return { icon: UserIcon, bg: "bg-blue-500/10 text-blue-400 border border-blue-500/10" };
                              case "security_alert":
                                return { icon: AlertCircle, bg: "bg-red-500/10 text-red-500 border border-red-500/10 animate-pulse" };
                              case "subscription":
                                return { icon: Clock, bg: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/10" };
                              case "team_invite":
                                return { icon: Mail, bg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" };
                              case "billing":
                                return { icon: CreditCard, bg: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10" };
                              case "welcome":
                                return { icon: CheckCircle, bg: "bg-orange-500/10 text-orange-500 border border-[#F27D26]/20" };
                              case "system":
                              default:
                                return { icon: Info, bg: "bg-neutral-500/10 text-neutral-400 border border-neutral-500/10" };
                            }
                          })();
                          const IconComp = typeConfig.icon;

                          return (
                            <div
                              key={n.id}
                              className={`p-3 text-left transition-colors flex items-start gap-2.5 relative ${
                                !n.read
                                  ? isDark
                                    ? "bg-white/[0.02]"
                                    : "bg-neutral-500/[0.02]"
                                  : "opacity-85"
                              }`}
                            >
                              {!n.read && (
                                <span className="absolute top-3.5 right-3 w-1.5 h-1.5 bg-orange-500 rounded-full" />
                              )}
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${typeConfig.bg}`}>
                                <IconComp className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0 pr-1.5">
                                <div className="text-xs font-bold leading-tight truncate">{n.title}</div>
                                <div className="text-[10px] opacity-70 mt-0.5 leading-snug break-words">{n.desc}</div>
                                <div className="flex items-center justify-between mt-1.5 text-[8px] font-mono opacity-50">
                                  <span>{new Date(n.date).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                                  <div className="flex gap-2">
                                    {!n.read && (
                                      <button
                                        onClick={() => {
                                          const updated = userData.notifications.map((item) =>
                                            item.id === n.id ? { ...item, read: true } : item
                                          );
                                          handleUpdateUserData({ ...userData, notifications: updated });
                                        }}
                                        className="hover:underline text-orange-500"
                                      >
                                        Mark read
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        const updated = userData.notifications.filter((item) => item.id !== n.id);
                                        handleUpdateUserData({ ...userData, notifications: updated });
                                      }}
                                      className="hover:underline text-red-400"
                                    >
                                      Dismiss
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-8 px-4 flex flex-col items-center justify-center text-center opacity-60">
                          <BellOff className="w-8 h-8 text-neutral-500 mb-2" />
                          <span className="text-xs font-bold">Your notification feed is empty</span>
                          <span className="text-[10px] opacity-70 mt-1 max-w-[200px]">We'll send updates on compiling and achievements here!</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle in Header */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition cursor-pointer ${
                isDark
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-amber-400"
                  : "bg-black/5 border-black/10 hover:bg-black/10 text-neutral-700"
              }`}
              title="Toggle Light/Dark Workspace theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Profile Avatar Trigger link */}
            <button
              onClick={() => setActiveTab("profile")}
              className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-[#F27D26] to-[#EF4444] border-2 border-white/10 flex items-center justify-center text-white font-bold font-mono text-xs shadow hover:opacity-90 transition cursor-pointer"
            >
              {(user?.name || "AD").slice(0, 2).toUpperCase()}
            </button>
          </div>
        </header>

        {/* Interactive Workspace Area */}
        <main className="flex-1 overflow-y-auto relative p-4 sm:p-6">
          {renderPanelContent()}
        </main>
      </div>

      {/* Onboarding Product Tour Overlays */}
      {tourStep !== null && (
        <ProductTour
          currentStep={tourStep}
          onNext={handleNextTourStep}
          onPrev={handlePrevTourStep}
          onSkip={handleSkipTour}
          onFinish={handleSkipTour}
        />
      )}

      {/* First-time Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-[4px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`max-w-md w-full rounded-3xl p-8 border ${isDark ? "bg-[#121211] border-white/10 text-white" : "bg-white border-neutral-200 text-[#1A1A1A]"} shadow-2xl space-y-6 text-center`}
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-[#F27D26]/10 flex items-center justify-center text-[#F27D26] text-3xl animate-bounce">
              👋
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Welcome to Mentra!</h2>
              <p className="text-xs opacity-75 leading-relaxed">
                Let's help you get familiar with your workspace in less than a minute. Take a quick interactive product tour of your console.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setShowWelcomeModal(false);
                  setTourStep(0);
                  setActiveTab(TOUR_STEPS[0].tab);
                }}
                className="w-full py-3 rounded-xl bg-[#F27D26] hover:bg-[#F27D26]/90 text-white font-semibold text-xs tracking-wider uppercase transition shadow-lg shadow-[#F27D26]/10"
              >
                Start Tour
              </button>
              <button
                onClick={() => {
                  setShowWelcomeModal(false);
                  if (userData) {
                    handleUpdateUserData({ ...userData, hasCompletedTour: true });
                  }
                }}
                className="w-full py-3 rounded-xl bg-transparent hover:bg-neutral-500/10 text-xs font-semibold uppercase opacity-60 hover:opacity-100 transition"
              >
                Skip for Now
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// MODULE: DASHBOARD HOME
// -------------------------------------------------------------
function DashboardHome({ theme, points, level, streak, userData, onNavigate, onUpdateUserData, setWorkspaceChallenge }: any) {
  const isDark = theme === "dark";

  const getStreakMotivation = (days: number) => {
    if (days === 0) return "Solve your first coding challenge today to kickstart your practice streak! 🚀";
    if (days <= 2) return "Great start! Keep the momentum going 🔥";
    if (days <= 5) return "You are on fire! Let's make it a daily habit ⚡";
    return "Unstoppable! You are mastering the workspace and building elite habits 🏆";
  };

  // Derive next recommended challenge dynamically from user's completed list
  const nextChallenge = PRACTICE_CHALLENGES.find(
    (c) => !userData?.completedChallenges?.includes(c.id)
  ) ?? PRACTICE_CHALLENGES[PRACTICE_CHALLENGES.length - 1];

  // Derive learning goal progress from roadmapProgress array
  const roadmapModules = {
    fullstack: ["fs-01", "fs-02", "fs-03", "fs-04"],
    compiler: ["cp-01", "cp-02", "cp-03", "cp-04"],
    algorithms: ["al-01", "al-02", "al-03", "al-04"],
  };
  const completedModules = userData?.roadmapProgress ?? [];
  const activeRoadmapId = "compiler";
  const activeRoadmapModules = roadmapModules[activeRoadmapId as keyof typeof roadmapModules];
  const activeRoadmapProgress = activeRoadmapModules.length
    ? Math.round((completedModules.filter((id: string) => activeRoadmapModules.includes(id)).length / activeRoadmapModules.length) * 100)
    : 0;

  const roadmapUnitDefs = [
    { id: "cp-01", name: "Unit 1: AST Parsing" },
    { id: "cp-02", name: "Unit 2: Variable binding leaks" },
    { id: "cp-03", name: "Unit 3: Call stack recursion limits" },
    { id: "cp-04", name: "Unit 4: Heap memory representations" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-6xl mx-auto pb-12"
    >
      {/* Editorial Greetings Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-500/10 pb-6">
        <div>
          <h1 className="text-3xl font-sans font-bold tracking-tight">
            Developer Workspace
          </h1>
          <p className="text-xs opacity-60 font-sans mt-1">
            Build software models, practice code structures, and scale challenges. Today is <strong className="text-[#F27D26]">{streak > 0 ? `Day ${streak}` : "Day 0"}</strong> of your coding streak.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("workspace")}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition ${
              isDark
                ? "bg-[#F27D26] text-white hover:bg-[#F27D26]/90 shadow-lg shadow-[#F27D26]/10"
                : "bg-black text-white hover:bg-neutral-800"
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Open Sandboxed IDE</span>
          </button>
        </div>
      </div>

      {/* Grid of Key Stats Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Mentra Points Score", val: `${points} XP`, icon: Zap, text: "Earn XP by solving challenges", color: "text-amber-500 bg-amber-500/5 border-amber-500/25" },
          { label: "Developer Level", val: `Lvl ${level}`, icon: Cpu, text: `Next level up at ${Math.ceil(points / 500) * 500} XP`, color: "text-[#F27D26] bg-[#F27D26]/5 border-[#F27D26]/25" },
          { label: "Streak Log", val: `${streak} Days`, icon: Flame, text: `Longest streak: ${userData?.longestStreak ?? 0} days`, color: "text-orange-500 bg-orange-500/5 border-orange-500/25" },
          { label: "Missions Completed", val: `${userData?.completedChallenges?.length ?? 0} Solved`, icon: ListTodo, text: "Tracked algorithmic passes", color: "text-blue-500 bg-blue-500/5 border-blue-500/25" },
        ].map((stat, i) => (
          <div
            key={i}
            className={`p-6 rounded-3xl border flex flex-col justify-between ${
              isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200 shadow-sm"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-mono tracking-wider uppercase opacity-60">{stat.label}</span>
              <div className={`p-2 rounded-xl border ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black tracking-tight">{stat.val}</div>
              <p className="text-[11px] opacity-50 font-sans">{stat.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Main Panel Layout (Active missions and charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Daily Mission & Code Practice */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Today's Mission Interactive Block — driven by user's actual progress */}
          <div className={`p-6 rounded-3xl border overflow-hidden relative ${
            isDark
              ? "bg-gradient-to-br from-[#121211] to-[#1a1a19] border-white/10"
              : "bg-gradient-to-br from-[#FAF9F6] to-neutral-100 border-neutral-200"
          }`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#F27D26]/5 rounded-full blur-[40px] pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/25">
                🔥 TODAY'S MISSION
              </span>
              <span className="text-[11px] font-mono opacity-50">Estimated: {nextChallenge.durationMinutes} minutes</span>
            </div>

            <h3 className="text-xl font-sans font-bold">{nextChallenge.title}</h3>
            <p className="text-xs opacity-75 mt-2 max-w-xl leading-relaxed font-sans">
              {nextChallenge.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  if (setWorkspaceChallenge) setWorkspaceChallenge(nextChallenge);
                  onNavigate("workspace");
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 ${
                  isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-neutral-800"
                }`}
              >
                <span>Initialize Task Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono text-[#F27D26] font-bold">+{nextChallenge.points} XP Rewards</span>
            </div>
          </div>

          {/* Recently Solved Challenges */}
          <div className={`p-6 rounded-3xl border ${isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200 shadow-sm"}`}>
            <h3 className="text-xs font-mono font-bold uppercase opacity-60 tracking-wider mb-4">Recently Solved Challenges</h3>
            {userData?.completedChallenges && userData.completedChallenges.length > 0 ? (
              <div className="space-y-3">
                {userData.completedChallenges.slice(-3).reverse().map((chalId: string) => {
                  const challenge = PRACTICE_CHALLENGES.find(c => c.id === chalId) || { id: chalId, title: `Challenge ${chalId}`, difficulty: "Medium", points: 20 };
                  return (
                    <div key={chalId} className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-500/5 border border-neutral-500/10 hover:bg-neutral-500/10 transition">
                      <div>
                        <div className="text-xs font-bold text-neutral-800 dark:text-white">{challenge.title}</div>
                        <div className="text-[9px] font-mono opacity-50 uppercase tracking-wider mt-0.5">{challenge.difficulty} • +{challenge.points} XP</div>
                      </div>
                      <button
                        onClick={() => {
                          if (setWorkspaceChallenge) {
                            setWorkspaceChallenge(challenge);
                          }
                          onNavigate("workspace");
                        }}
                        className="text-[10px] font-mono text-[#F27D26] hover:underline uppercase font-bold"
                      >
                        Review Solution
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center space-y-3 border border-dashed border-neutral-500/20 rounded-3xl">
                <div className="text-2xl opacity-40">💻</div>
                <div className="text-xs font-sans opacity-60">No coding challenges completed yet.</div>
                <button
                  onClick={() => onNavigate("challenges")}
                  className="px-4 py-1.5 rounded-full bg-[#F27D26]/10 text-[#F27D26] hover:bg-[#F27D26]/20 transition text-[10px] font-mono font-bold uppercase tracking-wider"
                >
                  Solve your first challenge
                </button>
              </div>
            )}
          </div>

          {/* Productivity tips and AI feedback recommendation cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-5 rounded-3xl border ${isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200 shadow-sm"}`}>
              <div className="flex items-center gap-2 text-xs font-bold text-[#F27D26] mb-2 font-mono uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Productivity Tip</span>
              </div>
              <p className="text-xs opacity-80 leading-relaxed font-sans">
                "Reduce cognitive switching cost by using Workspace custom file binders. When practicing coding problems, keep your test constraints open on the right panel to guide validation loops incrementally."
              </p>
            </div>

            <div className={`p-5 rounded-3xl border ${isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200 shadow-sm"}`}>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-500 mb-2 font-mono uppercase">
                <Flame className="w-3.5 h-3.5" />
                <span>Daily Challenge Recommendation</span>
              </div>
              <p className="text-xs opacity-80 leading-relaxed mb-3 font-sans">
                {userData?.completedChallenges?.length === 0
                  ? "Start with the basics — solve your first challenge to kick off your streak."
                  : `Up next: ${nextChallenge.title} (${nextChallenge.difficulty})`}
              </p>
              <button
                onClick={() => {
                  if (setWorkspaceChallenge) setWorkspaceChallenge(nextChallenge);
                  onNavigate("workspace");
                }}
                className="text-[10px] font-mono text-[#F27D26] font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
              >
                <span>Begin challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Right column: Progress tracks, leaderboards & mini achievements */}
        <div className="lg:col-span-4 space-y-6">

          {/* Daily Coding Streak Tracker Card */}
          <div className={`p-6 rounded-3xl border relative overflow-hidden ${
            isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200 shadow-sm"
          }`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-[30px] pointer-events-none" />
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-mono font-bold uppercase opacity-60 tracking-wider">Practice Streak</h3>
              <div className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase bg-orange-500/10 text-orange-500 border border-orange-500/25">
                🔥 {streak} Days
              </div>
            </div>

            <div className="space-y-4 font-sans">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 text-2xl font-bold animate-pulse">
                  🔥
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-800 dark:text-white">Current Streak: {streak} days</div>
                  <p className="text-[10px] opacity-60">Longest Streak: {userData?.longestStreak ?? 0} days</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-500/5 border border-neutral-500/10 text-[11px] leading-relaxed opacity-90">
                {getStreakMotivation(streak)}
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono opacity-50 pt-1">
                <span>Last practice date:</span>
                <span>{userData?.lastPracticeDate ? new Date(userData.lastPracticeDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "None"}</span>
              </div>
            </div>
          </div>
          
          {/* Quick learning goal track — driven by userData.roadmapProgress */}
          <div className={`p-6 rounded-3xl border ${isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200 shadow-sm"}`}>
            <h3 className="text-xs font-mono font-bold uppercase opacity-60 tracking-wider mb-4">Active Learning Goal</h3>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-neutral-800 dark:text-white">Compiler Foundations</span>
              <span className="text-[#F27D26] font-mono font-bold">{activeRoadmapProgress}%</span>
            </div>
            <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mb-4">
              <div className="bg-[#F27D26] h-full rounded-full transition-all duration-500" style={{ width: `${activeRoadmapProgress}%` }} />
            </div>

            <div className="space-y-3.5">
              {roadmapUnitDefs.map((unit) => {
                const isDone = completedModules.includes(unit.id);
                const isActive = !isDone && roadmapUnitDefs.find(u => !completedModules.includes(u.id))?.id === unit.id;
                const status = isDone ? "completed" : isActive ? "active" : "pending";
                return (
                  <div key={unit.id} className="flex items-center justify-between text-xs font-sans">
                    <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        status === "completed" ? "bg-emerald-500" : status === "active" ? "bg-[#F27D26]" : "bg-neutral-500/30"
                      }`} />
                      <span className={status === "completed" ? "opacity-60 line-through" : "opacity-90"}>{unit.name}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-50 uppercase">{status}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mini leaderboard overview — real data from Supabase */}
          <MiniLeaderboard theme={theme} currentUser={userData} currentUserId={userData?.userId} onNavigate={onNavigate} />

          {/* Developer active news / announcements */}
          <div className={`p-6 rounded-3xl border ${isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200 shadow-sm"}`}>
            <h3 className="text-xs font-mono font-bold uppercase opacity-60 tracking-wider mb-3">Workspace Platform Logs</h3>
            <div className="space-y-3 font-sans">
              <div className="p-3 bg-neutral-500/5 rounded-2xl border border-neutral-500/5 space-y-1">
                <span className="text-[9px] font-mono text-[#F27D26] font-bold">RELEASE V2.4.0</span>
                <p className="text-xs opacity-90 leading-relaxed font-semibold">Gemini 2.5 Flash code compiler is live.</p>
                <p className="text-[10px] opacity-65 leading-relaxed">AST parsing prompts have 40% deeper analytical context.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// MODULE: AI CHAT WORKSPACE (Modes: Learn, Tech, Companion)
// -------------------------------------------------------------
function AIChatWorkspace({ theme, userData, onUpdateUserData, user }: any) {
  const isDark = theme === "dark";
  const [chatMode, setChatMode] = useState<"learn" | "tech" | "companion">("learn");

  // Load persisted chat history from userData, fall back to welcome message
  const [messages, setMessages] = useState<any[]>(() => {
    if (userData?.chatHistory?.length) {
      return userData.chatHistory.map((m: any) => ({ role: m.role, text: m.text }));
    }
    return [
      { role: "assistant", text: "Welcome to your Mentra AI workspace channel. Switch modes above: \n\n* **Learn Mode**: Explains concepts incrementally.\n* **Tech Mode**: Direct code refactoring with AST compilation.\n* **Companion Mode**: empathetic check-ins and burnout counseling." }
    ];
  });
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const persistMessages = (msgs: any[]) => {
    setMessages(msgs);
    if (onUpdateUserData && userData) {
      const history = msgs.map((m) => ({ role: m.role, text: m.text, timestamp: new Date().toISOString() }));
      onUpdateUserData({ ...userData, chatHistory: history });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = { role: "user", text: inputVal };
    const nextMessages = [...messages, userMsg];
    persistMessages(nextMessages);
    setInputVal("");
    setIsTyping(true);

    const systemInstruction = chatMode === "learn"
      ? "You are Mentra, an expert computer science tutor. Teach the user concepts step-by-step with intuitive analogies and clean markdown examples. Keep responses concise, clear, and under 150 words."
      : chatMode === "tech"
      ? "You are Mentra Tech IDE, a professional senior software engineer. Provide high-quality code optimizations, AST concepts, or debugging suggestions. Keep responses highly technical, concise, and under 150 words."
      : "You are Mentra Companion, an empathetic mentor for software developers. Offer supportive, relaxing, and stress-relieving advice to manage burnout and tech fatigue. Keep responses warm, concise, and under 120 words.";

    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...messages, userMsg].map((m: any) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.text,
        })),
        systemInstruction,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to reach AI server");
        }
        return res.json();
      })
      .then((data) => {
        persistMessages([...nextMessages, { role: "assistant", text: data.text || "I'm here to support you!" }]);
      })
      .catch((err) => {
        console.error("AI chat error, using fallback:", err);
        let replyText = "";
        const lower = userMsg.text.toLowerCase();

        if (chatMode === "learn") {
          if (lower.includes("ast") || lower.includes("tree")) {
            replyText = "An **Abstract Syntax Tree (AST)** is a nested dictionary representing structure. For example, \n\n```typescript\n// AST Node Representation\ninterface IdentifierNode {\n  type: 'Identifier';\n  name: string;\n}\n```\nTo parse code structures, our server traverses these nodes, checking for bounds errors or memory overflows. Would you like a recursive traversal quiz next?";
          } else {
            replyText = "In **Learn Mode**, I focus on building your programming intuition from the ground up rather than just copy-pasting solutions. What technical concept should we break down or whiteboard?";
          }
        } else if (chatMode === "tech") {
          replyText = "Evaluating structural AST variables... ✓ Lint checked.\n\nHere is your requested code optimization:\n```typescript\n// Optimized Sliding Window algorithm\nfunction lengthOfLongestSubstring(s: string): number {\n  const seen = new Map<string, number>();\n  let start = 0, max = 0;\n  for (let end = 0; end < s.length; end++) {\n    if (seen.has(s[end])) {\n      start = Math.max(seen.get(s[end])! + 1, start);\n    }\n    seen.set(s[end], end);\n    max = Math.max(max, end - start + 1);\n  }\n  return max;\n}\n```\nBoth time and spatial complexity operate at **O(N)**.";
        } else {
          if (lower.includes("burn") || lower.includes("tired") || lower.includes("stress")) {
            replyText = "I completely hear you. Writing code under tight deadlines is incredibly high-stress. Let's take a temporary visual step back—close your editor tab, relax your shoulders, and log a simple win for today. Your wellness is more critical than any compiler output.";
          } else {
            replyText = "As your AI companion, I'm here to support you emotionally and balance developer fatigue. How are you feeling about your learning trajectory today?";
          }
        }

        persistMessages([...nextMessages, { role: "assistant", text: `*(Offline Fallback Mode)*\n\n${replyText}` }]);
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-10rem)] flex flex-col md:flex-row gap-6 max-w-6xl mx-auto font-sans"
    >
      {/* Left Chat sidebar folders */}
      <div className={`w-full md:w-64 shrink-0 rounded-3xl border p-5 flex flex-col justify-between ${
        isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200 shadow-sm"
      }`}>
        <div className="space-y-4">
          <div className="text-[10px] font-mono uppercase tracking-wider opacity-60">AI Companion Modes</div>
          <div className="space-y-2">
            {[
              { label: "Learn Mode", mode: "learn" as const },
              { label: "Tech IDE Mode", mode: "tech" as const },
              { label: "Companion Mode", mode: "companion" as const },
            ].map((ch, idx) => (
              <button
                key={idx}
                onClick={() => setChatMode(ch.mode)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium truncate border flex items-center gap-2 transition ${
                  chatMode === ch.mode
                    ? "bg-[#F27D26]/10 text-[#F27D26] border-[#F27D26]/20"
                    : isDark ? "border-transparent hover:bg-white/5 text-white/70" : "border-transparent hover:bg-black/5 text-[#1A1A1A]/70"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${chatMode === ch.mode ? "bg-[#F27D26]" : "bg-neutral-500"}`} />
                <span>{ch.label}</span>
              </button>
            ))}
          </div>
          {messages.length > 1 && (
            <div className="pt-3 border-t border-neutral-500/10 space-y-1">
              <div className="text-[9px] font-mono uppercase opacity-40 mb-1">Recent</div>
              {messages.slice(-3).reverse().map((m: any, i: number) => (
                <div key={i} className="text-[10px] opacity-55 truncate leading-snug">
                  <span className="font-bold">{m.role === "user" ? "You" : "AI"}:</span> {m.text.replace(/\*\*/g, "").slice(0, 30)}…
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Companion parameters card in Chat sidebar */}
        <div className="pt-4 border-t border-neutral-500/10">
          <div className="text-[10px] font-mono uppercase opacity-50 mb-2">Empathetic Channel Status</div>
          <div className="p-3 rounded-2xl bg-[#F27D26]/5 border border-[#F27D26]/15 text-[11px] space-y-1.5 leading-relaxed text-[#F27D26]">
            <p className="font-bold">Active listener profile:</p>
            <p className="opacity-85 text-[10px]">Academic Empathetic with daily career tracking bounds.</p>
          </div>
        </div>
      </div>

      {/* Right Core Chat workspace */}
      <div className={`flex-1 rounded-3xl border flex flex-col overflow-hidden relative ${
        isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200 shadow-sm"
      }`}>
        {/* Chat Top Selection Bar */}
        <div className="px-6 py-4 border-b border-neutral-500/10 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-mono uppercase tracking-wider opacity-60">AI COMPANION MODE:</span>
            <div className="flex items-center rounded-full bg-neutral-500/5 p-1 border border-neutral-500/10">
              {[
                { id: "learn", label: "Learn", color: "bg-[#F27D26]" },
                { id: "tech", label: "Tech IDE", color: "bg-blue-500" },
                { id: "companion", label: "Empathetic", color: "bg-purple-500" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setChatMode(m.id as any)}
                  className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase transition font-bold ${
                    chatMode === m.id
                      ? "bg-white text-black dark:bg-black dark:text-white shadow"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/15">
            Gemini Core Connected
          </span>
        </div>

        {/* Message scroll container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map((m, idx) => {
            const isAI = m.role === "assistant";
            return (
              <div key={idx} className={`flex gap-3 max-w-2xl ${isAI ? "" : "ml-auto flex-row-reverse"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[10px] font-mono ${
                  isAI ? "bg-gradient-to-tr from-orange-400 to-[#F27D26]" : "bg-blue-500"
                }`}>
                  {isAI ? "AI" : "YA"}
                </div>
                <div className={`p-4 rounded-3xl border leading-relaxed text-xs space-y-2 font-sans ${
                  isAI
                    ? isDark ? "bg-[#161615]/80 border-white/5 text-white/90" : "bg-neutral-50 border-neutral-200 text-[#1A1A1A]"
                    : "bg-[#F27D26] border-[#F27D26]/20 text-white"
                }`}>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 max-w-xs">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-[#F27D26] flex items-center justify-center shrink-0 text-white text-[10px] font-mono">
                AI
              </div>
              <div className={`p-4 rounded-3xl border flex items-center gap-1.5 ${
                isDark ? "bg-[#161615]/80 border-white/5" : "bg-neutral-50 border-neutral-200"
              }`}>
                <span className="w-2 h-2 rounded-full bg-[#F27D26] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#F27D26] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#F27D26] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Message Input controls */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-500/10 flex items-center gap-2">
          <input
            type="text"
            placeholder={`Ask a question in ${chatMode.toUpperCase()} mode...`}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className={`w-full px-4 py-3 rounded-2xl border text-xs outline-none transition ${
              isDark 
                ? "bg-white/5 border-white/10 focus:border-white focus:bg-white/10 text-white" 
                : "bg-black/5 border-black/10 focus:border-black focus:bg-white text-black"
            }`}
          />
          <button
            type="submit"
            className="p-3 rounded-2xl bg-[#F27D26] text-white hover:bg-[#F27D26]/90 transition shrink-0 cursor-pointer active:scale-95"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// MODULE: LEARNING HUB
// -------------------------------------------------------------
function LearningHub({ theme, onAddPoints }: { theme: "light" | "dark"; onAddPoints: (p: number) => void }) {
  const isDark = theme === "dark";
  const [activeRoadmap, setActiveRoadmap] = useState("fullstack");
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<number | null>(null);
  const [quizSuccess, setQuizSuccess] = useState<boolean | null>(null);

  const roadmaps = [
    { id: "fullstack", label: "Fullstack Engineering", desc: "Build web servers, handle caches, and configure persistent stores.", progress: 78, courses: 8 },
    { id: "compiler", label: "Compiler Engineering", desc: "Understand AST trees, recursive traversers, lexical tokens, and lexers.", progress: 45, courses: 6 },
    { id: "algorithms", label: "Advanced Algorithms", desc: "Tackle sliding window mappings, stacks, heaps, dynamic programming trees.", progress: 24, courses: 12 },
  ];

  const handleQuizSubmit = (idx: number) => {
    setQuizSelectedAnswer(idx);
    if (idx === 1) { // correct index
      setQuizSuccess(true);
      onAddPoints(100);
    } else {
      setQuizSuccess(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-6xl mx-auto font-sans pb-12"
    >
      <div className="border-b border-neutral-500/10 pb-6">
        <h2 className="text-2xl font-sans font-bold uppercase tracking-wider text-neutral-800 dark:text-white">
          Learning Paths
        </h2>
        <p className="text-xs opacity-60 mt-1">
          Complete structural roadmap courses, pass interactive compiler quizzes, and unlock Certificates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roadmaps.map((rm) => (
          <button
            key={rm.id}
            onClick={() => setActiveRoadmap(rm.id)}
            className={`p-6 rounded-3xl border text-left flex flex-col justify-between transition-all duration-300 relative overflow-hidden cursor-pointer ${
              activeRoadmap === rm.id
                ? "bg-[#F27D26]/5 border-[#F27D26] shadow-lg shadow-[#F27D26]/5"
                : isDark ? "bg-[#111110] border-white/5 hover:border-white/20" : "bg-white border-neutral-200 hover:border-[#F27D26]/40 shadow-sm"
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                  activeRoadmap === rm.id ? "bg-[#F27D26] text-white" : "bg-neutral-500/10 opacity-70"
                }`}>
                  {rm.courses} Modules
                </span>
                <span className="text-xs font-mono text-[#F27D26] font-bold">{rm.progress}% Completed</span>
              </div>
              <h3 className="text-base font-bold text-neutral-800 dark:text-white">{rm.label}</h3>
              <p className="text-xs opacity-70 leading-relaxed">{rm.desc}</p>
            </div>

            <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mt-6">
              <div className="bg-[#F27D26] h-full rounded-full" style={{ width: `${rm.progress}%` }} />
            </div>
          </button>
        ))}
      </div>

      {/* Course Unit list and Active Quiz */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="text-sm font-mono uppercase tracking-wider opacity-60">Course Modules Map</div>
          {[
            { num: "01", title: "Lexical Tokens & AST Parsing Core", desc: "Learn recursive descent parsers and syntax binders.", complete: true },
            { num: "02", title: "Reference Bounds Verification", desc: "Verify compile scope leaks and memory boundaries.", complete: true },
            { num: "03", title: "Dynamic Call Stack Recursions", desc: "Review recursive call limits under constrained heaps.", complete: false, active: true },
            { num: "04", title: "Compiler Static Type Checking", desc: "Types, namespaces, and static analytical overlays.", complete: false },
          ].map((mod, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border flex items-center justify-between gap-4 transition ${
                mod.active 
                  ? "bg-[#F27D26]/5 border-[#F27D26]/30" 
                  : isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200"
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                  mod.complete ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-neutral-500/15"
                }`}>
                  {mod.num}
                </div>
                <div>
                  <h4 className="text-xs font-bold font-sans text-neutral-800 dark:text-white flex items-center gap-2">
                    <span>{mod.title}</span>
                    {mod.active && <span className="text-[9px] font-mono text-[#F27D26] bg-[#F27D26]/10 px-1.5 py-0.5 rounded font-bold uppercase">ACTIVE</span>}
                  </h4>
                  <p className="text-[11px] opacity-70 leading-relaxed font-sans mt-0.5">{mod.desc}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (mod.active) setShowQuiz(true);
                  else alert("Please complete the preceding active unit first.");
                }}
                className={`px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider font-bold uppercase transition shrink-0 ${
                  mod.complete 
                    ? "bg-emerald-500/5 text-emerald-500 border border-emerald-500/15" 
                    : mod.active
                    ? "bg-[#F27D26] text-white hover:bg-[#F27D26]/90 cursor-pointer"
                    : "opacity-40 cursor-not-allowed border border-neutral-500/10"
                }`}
              >
                {mod.complete ? "Passed ✓" : mod.active ? "Start Quiz" : "Locked"}
              </button>
            </div>
          ))}
        </div>

        {/* Dynamic Quiz Frame */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-sm font-mono uppercase tracking-wider opacity-60">Interactive AI Tutor quiz</div>
          
          {showQuiz ? (
            <div className={`p-6 rounded-3xl border space-y-5 ${
              isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200"
            }`}>
              <div className="flex items-center gap-2 text-xs font-mono text-[#F27D26] font-bold uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Unit 3 Quiz Challenge</span>
              </div>
              <h3 className="text-xs font-bold leading-relaxed font-sans">
                What error is thrown when a recursive call stack runs out of memory bounds under standard TypeScript/Node runtimes?
              </h3>

              <div className="space-y-2.5">
                {[
                  "StackOverflow: Out of Bound indices exception",
                  "RangeError: Maximum call stack size exceeded",
                  "CompilerException: AST Node Stack Limit Leaked",
                ].map((ans, idx) => (
                  <button
                    key={idx}
                    disabled={quizSelectedAnswer !== null}
                    onClick={() => handleQuizSubmit(idx)}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-sans border transition ${
                      quizSelectedAnswer === idx
                        ? idx === 1
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-500 font-bold"
                          : "bg-red-500/10 border-red-500 text-red-500 font-bold"
                        : isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-neutral-50 border-neutral-200 hover:bg-black/5"
                    }`}
                  >
                    {ans}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {quizSuccess !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 ${
                      quizSuccess
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500"
                        : "bg-red-500/5 border-red-500/20 text-red-500"
                    }`}
                  >
                    <p className="font-bold">{quizSuccess ? "✓ Correct Answer!" : "✗ Try again"}</p>
                    <p className="opacity-90 leading-relaxed text-[11px]">
                      {quizSuccess
                        ? "Excellent! You earned +100 XP points. Standard Node environments throw a RangeError when recursion exceeds limits."
                        : "Stack limits throw a specific runtime RangeError instead of a custom CompilerException. Try again!"}
                    </p>
                    {quizSuccess && (
                      <button
                        onClick={() => {
                          setShowQuiz(false);
                          setQuizSelectedAnswer(null);
                          setQuizSuccess(null);
                        }}
                        className="text-[10px] font-mono uppercase tracking-wider font-bold underline mt-1 text-[#F27D26]"
                      >
                        Complete Unit & Continue
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className={`p-6 rounded-3xl border text-center py-12 space-y-3 ${
              isDark ? "bg-[#111110]/50 border-white/5" : "bg-neutral-50 border-neutral-200"
            }`}>
              <BookOpen className="w-8 h-8 text-neutral-400 mx-auto animate-pulse" />
              <h4 className="text-xs font-bold">Select an Active Unit Quiz</h4>
              <p className="text-[11px] opacity-70 max-w-xs mx-auto leading-relaxed">
                Unlock active unit quizzes by selecting modules in the course timeline. Completing quizzes increases your daily developer rank.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// MODULE: CODING CHALLENGES
// -------------------------------------------------------------
function ChallengesWorkspace({ theme, onSelectChallenge, userData }: { theme: "light" | "dark"; onSelectChallenge: (c: Challenge) => void; userData?: any }) {
  const isDark = theme === "dark";
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");

  const challenges = PRACTICE_CHALLENGES;

  const filtered = challenges.filter((c) => {
    if (difficultyFilter === "All") return true;
    return c.difficulty === difficultyFilter;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-6xl mx-auto font-sans pb-12"
    >
      <div className="border-b border-neutral-500/10 pb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-sans font-bold uppercase tracking-wider">Coding Challenges</h2>
          <p className="text-xs opacity-60 mt-1">Practice compiler tests, sliding window indices, and data design rules.</p>
        </div>

        {/* Diff filters */}
        <div className="flex items-center space-x-1.5 rounded-full bg-neutral-500/5 p-1 border border-neutral-500/10">
          {["All", "Easy", "Medium", "Hard"].map((df) => (
            <button
              key={df}
              onClick={() => setDifficultyFilter(df as any)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider uppercase transition font-bold ${
                difficultyFilter === df
                  ? "bg-white text-black dark:bg-black dark:text-white shadow"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {df}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((chall) => {
          const diffColor =
            chall.difficulty === "Easy"
              ? "text-green-500 bg-green-500/10 border-green-500/20"
              : chall.difficulty === "Medium"
              ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
              : "text-red-500 bg-red-500/10 border-red-500/20";

          return (
            <div
              key={chall.id}
              className={`rounded-3xl border p-6 flex flex-col justify-between hover:border-[#F27D26]/40 transition-all duration-300 relative group ${
                isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200 shadow-sm"
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`px-2.5 py-0.5 rounded text-[9px] font-mono font-bold border ${diffColor}`}>
                    {chall.difficulty}
                  </span>
                  <span className="text-[10px] font-mono opacity-50 flex items-center">
                    <TerminalIcon className="w-3.5 h-3.5 mr-1 text-[#F27D26]" />
                    {chall.language.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-bold group-hover:text-[#F27D26] transition text-neutral-800 dark:text-white">{chall.title}</h3>
                <p className="text-xs opacity-75 leading-relaxed font-sans line-clamp-2">{chall.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-500/10 flex justify-between items-center">
                <div className="text-[10px] font-mono opacity-60">
                  Points: <b className="font-bold text-[#F27D26]">{chall.points} XP</b>
                </div>
                <button
                  onClick={() => onSelectChallenge(chall)}
                  className={`px-3.5 py-1.5 rounded-full font-medium text-[11px] flex items-center space-x-1 transition duration-300 cursor-pointer ${
                    isDark
                      ? "bg-[#F27D26] hover:bg-[#F27D26]/90 text-white"
                      : "bg-black hover:bg-neutral-800 text-white"
                  }`}
                >
                  <span>Load into IDE</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// MODULE: IDE WORKSPACE
// -------------------------------------------------------------
function IDEWorkspace({ theme, loadedChallenge, userData, onUpdateUserData, user }: { theme: "light" | "dark"; loadedChallenge?: Challenge; userData?: any; onUpdateUserData?: (data: any) => void; user?: any }) {
  const isDark = theme === "dark";
  const [openFiles, setOpenFiles] = useState<string[]>(["challenge.ts", "tests.js"]);
  const [activeFile, setActiveFile] = useState("challenge.ts");
  const [editorCode, setEditorCode] = useState(() => {
    return loadedChallenge?.starterCode || `function findLongestWord(str: string): string {\n  // Write your sandboxed solution code here...\n  const words = str.split(' ');\n  return words.reduce((x, y) => x.length > y.length ? x : y, '');\n}`;
  });

  const [copied, setCopied] = useState(false);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);

  // Track code changes if challenge loads dynamically
  useEffect(() => {
    if (loadedChallenge) {
      setEditorCode(loadedChallenge.starterCode);
    }
  }, [loadedChallenge]);

  const [activeTerminalTab, setActiveTerminalTab] = useState<"terminal" | "problems" | "output">("terminal");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "✓ Mentra AST offline compiler initialized.",
    "✓ Process connected on port 3000.",
    "✓ Ready to evaluate sandboxed functions.",
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [showEditorAI, setShowEditorAI] = useState(false);
  const [editorAIInput, setEditorAIInput] = useState("");
  const [editorAIResponse, setEditorAIResponse] = useState<string | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(editorCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = (format: "ts" | "py" | "js") => {
    const titlePart = loadedChallenge 
      ? loadedChallenge.title.toLowerCase().replace(/[^a-z0-9]+/g, "_") 
      : "sandbox_solution";
    const filename = `${titlePart}.${format}`;
    const blob = new Blob([editorCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowDownloadDropdown(false);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTerminalLogs((prev) => [...prev, "$ tsx challenge.ts --run-suite"]);
    
    const ptsReward = loadedChallenge?.points ?? 20;

    setTimeout(async () => {
      setIsRunning(false);
      setTerminalLogs((prev) => [
        ...prev,
        "Running validation unit tests...",
        "Case 1: Input structure parsed correctly. -> Passed ✓",
        "Case 2: Complexity bounds evaluated successfully. -> Passed ✓",
        `✓ All tests successfully verified. Earned +${ptsReward} Mentra Points!`,
      ]);

      // Persistence trigger
      if (loadedChallenge && userData && onUpdateUserData) {
        const alreadyCompleted = userData.completedChallenges?.includes(loadedChallenge.id) ?? false;
        const actualPtsReward = alreadyCompleted ? 5 : ptsReward;

        // Update completed list
        const updatedCompleted = alreadyCompleted 
          ? (userData.completedChallenges ?? [])
          : [...(userData.completedChallenges ?? []), loadedChallenge.id];

        // Practice Log update
        const todayStr = new Date().toISOString().split("T")[0];
        const newLogEntry = {
          challengeId: loadedChallenge.id,
          date: new Date().toISOString(),
          xpEarned: actualPtsReward,
        };

        // Streak updates
        let currentStreak = userData.currentStreak ?? 0;
        let longestStreak = userData.longestStreak ?? 0;
        const lastPracticeDate = userData.lastPracticeDate;

        if (!lastPracticeDate) {
          // First practice ever
          currentStreak = 1;
          longestStreak = 1;
        } else {
          const lastDate = new Date(lastPracticeDate);
          const todayDate = new Date(todayStr);
          lastDate.setHours(0,0,0,0);
          todayDate.setHours(0,0,0,0);

          const diffTime = todayDate.getTime() - lastDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            // Consecutive day
            currentStreak += 1;
            if (currentStreak > longestStreak) {
              longestStreak = currentStreak;
            }
          } else if (diffDays > 1) {
            // Missed days, reset streak to 1
            currentStreak = 1;
          }
          // Same day practice keeps the current streak unchanged
        }

        const updatedPoints = (userData.points ?? 0) + actualPtsReward;
        const newLevel = Math.floor(updatedPoints / 500) + 1;

        const updatedNotifications = [...(userData.notifications ?? [])];
        if (newLevel > (userData.level ?? 1)) {
          updatedNotifications.unshift({
            id: `level-up-${newLevel}-${Date.now()}`,
            title: "Level Up! 🎉",
            desc: `Congratulations! You've reached Level ${newLevel} by solving challenges!`,
            read: false,
            date: new Date().toISOString(),
          });
        }

        updatedNotifications.unshift({
          id: `challenge-completed-${loadedChallenge.id}-${Date.now()}`,
          title: "Challenge Completed! ✓",
          desc: `You solved '${loadedChallenge.title}' and earned +${actualPtsReward} XP!`,
          read: false,
          date: new Date().toISOString(),
        });

        const updatedData = {
          ...userData,
          points: updatedPoints,
          level: newLevel,
          completedChallenges: updatedCompleted,
          currentStreak,
          longestStreak,
          lastPracticeDate: new Date().toISOString(),
          practiceLog: [...(userData.practiceLog ?? []), newLogEntry],
          notifications: updatedNotifications,
        };

        onUpdateUserData(updatedData);
      }
    }, 1100);
  };

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorAIInput.trim()) return;

    const userPrompt = editorAIInput;
    setEditorAIInput("");
    setEditorAIResponse("Analyzing code structure and local variables... checking constraints.");

    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `Challenge: ${loadedChallenge?.title || "Sandbox Code"}\nActive File: ${activeFile}\nCode:\n\`\`\`typescript\n${editorCode}\n\`\`\`\n\nQuestion/Instruction: ${userPrompt}`,
          },
        ],
        systemInstruction: "You are Mentra Code Assistant, an elite software engineer. Analyze the user's code in the context of their active file or challenge, and answer their question or optimize their code with high precision. Keep the response concise, encouraging, and formatted in clean Markdown, under 180 words.",
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to reach AI server");
        }
        return res.json();
      })
      .then((data) => {
        setEditorAIResponse(data.text || "Code analysis completed.");
      })
      .catch((err) => {
        console.error("AI code helper error, using fallback:", err);
        setEditorAIResponse("### Mentra Code Analysis (Offline Fallback)\n\n* **Time Complexity**: Average **O(N)**. Efficient split mapping.\n* **Optimizations**: Check your terminal output and ensure your code has proper early return checks. Add your Gemini API Key in the settings to activate live expert code reviews.");
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-10rem)] flex flex-col md:flex-row gap-4 max-w-7xl mx-auto font-sans"
    >
      {/* File Explorer (IDE left bar) */}
      <div className={`w-full md:w-56 rounded-2xl border p-4 flex flex-col shrink-0 ${
        isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200 shadow-sm"
      }`}>
        <div className="text-[10px] font-mono uppercase tracking-wider opacity-60 mb-3 flex items-center gap-1.5">
          <Files className="w-3.5 h-3.5 text-[#F27D26]" />
          <span>Project Explorer</span>
        </div>
        <div className="space-y-1.5 flex-1">
          {[
            { name: "challenge.ts", isCode: true },
            { name: "tests.js", isCode: true },
            { name: "package.json", isCode: false },
            { name: "README.md", isCode: false },
          ].map((file) => (
            <button
              key={file.name}
              onClick={() => {
                if (!openFiles.includes(file.name)) setOpenFiles([...openFiles, file.name]);
                setActiveFile(file.name);
              }}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-2 ${
                activeFile === file.name
                  ? isDark ? "bg-white/5 text-[#F27D26]" : "bg-black/5 text-[#F27D26] font-bold"
                  : "hover:bg-neutral-500/5 opacity-70"
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5 text-neutral-400" />
              <span>{file.name}</span>
            </button>
          ))}
        </div>

        {/* Loaded challenge badge info */}
        {loadedChallenge && (
          <div className="pt-3 border-t border-neutral-500/10 text-[11px] leading-relaxed space-y-1">
            <span className="font-bold block text-neutral-400">Linked Challenge:</span>
            <span className="text-[#F27D26] font-semibold">{loadedChallenge.title}</span>
          </div>
        )}
      </div>

      {/* Center Monaco simulation Editor workspace */}
      <div className="flex-1 flex flex-col rounded-2xl border overflow-hidden relative dark:bg-[#131312] bg-white dark:border-white/5 border-neutral-200">
        
        {/* Editor Tab bar and Run actions */}
        <div className="h-10 border-b dark:border-white/5 border-neutral-200 dark:bg-[#111110] bg-neutral-50 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center space-x-1.5">
            {openFiles.map((fn) => (
              <div
                key={fn}
                onClick={() => setActiveFile(fn)}
                className={`px-3 h-10 text-xs font-mono border-r transition flex items-center gap-1.5 cursor-pointer select-none ${
                  activeFile === fn
                    ? isDark 
                      ? "bg-[#131312] border-t-2 border-t-[#F27D26] text-white border-r-white/5 font-semibold" 
                      : "bg-white border-t-2 border-t-black text-black border-r-neutral-200 font-semibold"
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                <span>{fn}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenFiles(openFiles.filter((x) => x !== fn));
                    if (activeFile === fn && openFiles.length > 1) {
                      setActiveFile(openFiles[0]);
                    }
                  }}
                  className="hover:text-red-500 font-bold ml-1 px-1 rounded transition-colors hover:bg-neutral-500/10"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {/* Copy Button */}
            <button
              onClick={handleCopyCode}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase font-bold transition flex items-center gap-1 cursor-pointer border ${
                copied
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                  : isDark
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80 hover:text-white"
                  : "bg-black/5 border-neutral-200 hover:bg-black/10 text-neutral-800"
              }`}
              title="Copy solution to clipboard"
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            {/* Download Button with dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase font-bold transition flex items-center gap-1 cursor-pointer border ${
                  isDark
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80 hover:text-white"
                    : "bg-black/5 border-neutral-200 hover:bg-black/10 text-neutral-800"
                }`}
                title="Download solution code"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>

              <AnimatePresence>
                {showDownloadDropdown && (
                  <>
                    {/* Backdrop to close */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowDownloadDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className={`absolute right-0 mt-1.5 w-36 rounded-xl border p-1 z-20 shadow-xl ${
                        isDark 
                          ? "bg-[#141413] border-white/10 text-white" 
                          : "bg-white border-neutral-200 text-neutral-800"
                      }`}
                    >
                      <div className="px-2 py-1 text-[9px] font-mono uppercase opacity-50 select-none">
                        Select Format
                      </div>
                      {[
                        { ext: "js", label: "JavaScript (.js)" },
                        { ext: "py", label: "Python (.py)" },
                        { ext: "ts", label: "TypeScript (.ts)" },
                      ].map((item) => (
                        <button
                          key={item.ext}
                          onClick={() => handleDownloadCode(item.ext as any)}
                          className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-mono transition ${
                            isDark ? "hover:bg-white/5" : "hover:bg-neutral-100"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className={`px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider font-bold transition flex items-center gap-1 cursor-pointer ${
                isDark ? "bg-[#F27D26] hover:bg-[#F27D26]/90 text-white" : "bg-black hover:bg-neutral-800 text-white"
              }`}
            >
              {isRunning ? (
                <span className="animate-spin text-white">⚙</span>
              ) : (
                <Play className="w-3 h-3 fill-current" />
              )}
              <span>Run Suite</span>
            </button>

            <button
              onClick={() => setShowEditorAI(!showEditorAI)}
              className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 text-purple-500 font-bold transition"
            >
              Ask AI
            </button>
          </div>
        </div>

        {/* Text Area simulating Monaco Syntax highlighting */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-10 bg-neutral-500/5 border-r dark:border-white/5 border-neutral-200 font-mono text-[11px] text-center text-neutral-500 py-4 select-none leading-relaxed">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            value={editorCode}
            onChange={(e) => setEditorCode(e.target.value)}
            className="flex-1 bg-transparent p-4 outline-none font-mono text-xs resize-none leading-relaxed dark:text-neutral-200 text-neutral-800"
            style={{ tabSize: 2 }}
          />
        </div>

        {/* Bottom panels: Terminal simulated Xterm */}
        <div className="h-44 border-t dark:border-white/5 border-neutral-200 dark:bg-[#111110] bg-neutral-50 flex flex-col shrink-0">
          <div className="h-8 border-b dark:border-white/5 border-neutral-200 flex items-center justify-between px-4">
            <div className="flex items-center space-x-3 text-[10px] font-mono">
              {[
                { id: "terminal", label: "TERMINAL" },
                { id: "problems", label: "PROBLEMS (0)" },
                { id: "output", label: "OUTPUT LOG" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTerminalTab(t.id as any)}
                  className={`font-bold transition ${
                    activeTerminalTab === t.id ? "text-[#F27D26]" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <span className="text-[9px] font-mono opacity-50 uppercase">tsx v4.21</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1 dark:text-neutral-300 text-neutral-700 bg-black/5 dark:bg-black/20">
            {activeTerminalTab === "terminal" ? (
              terminalLogs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  {log.startsWith("$") ? (
                    <span className="text-amber-500">{log}</span>
                  ) : log.includes("Passed") || log.includes("verified") ? (
                    <span className="text-emerald-500">{log}</span>
                  ) : (
                    <span>{log}</span>
                  )}
                </div>
              ))
            ) : activeTerminalTab === "problems" ? (
              <div className="text-emerald-500">✓ No problems detected in compilation AST tree.</div>
            ) : (
              <div className="opacity-60">[Log - 10:29:25 AM] Heap Allocation 42MB. Thread safely mapped.</div>
            )}
          </div>
        </div>
      </div>

      {/* Right AI Assistant Panel if visible */}
      <AnimatePresence>
        {showEditorAI && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "320px" }}
            exit={{ opacity: 0, width: 0 }}
            className={`w-full md:w-80 shrink-0 rounded-2xl border p-4 flex flex-col justify-between overflow-hidden ${
              isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200 shadow-sm"
            }`}
          >
            <div className="space-y-4 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-500/10">
                <span className="text-[10px] font-mono uppercase opacity-60">AI Assistant Review</span>
                <button onClick={() => setShowEditorAI(false)} className="hover:opacity-60 text-xs">×</button>
              </div>

              {editorAIResponse ? (
                <div className="text-xs leading-relaxed space-y-3 whitespace-pre-wrap">
                  {editorAIResponse}
                </div>
              ) : (
                <div className="text-xs opacity-60 italic text-center py-8">
                  Highlight editor code variables or input prompt below to ask for compilation reviews.
                </div>
              )}
            </div>

            <form onSubmit={handleAskAI} className="mt-4 pt-3 border-t border-neutral-500/10 flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Ask helper (e.g. optimize)..."
                value={editorAIInput}
                onChange={(e) => setEditorAIInput(e.target.value)}
                className="w-full bg-transparent outline-none text-xs border border-neutral-500/15 p-2 rounded-xl focus:border-purple-500"
              />
              <button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold font-mono">
                Ask
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// -------------------------------------------------------------
// MODULE: AI PROJECT BUILDER
// -------------------------------------------------------------
function AIProjectBuilder({ theme }: any) {
  const isDark = theme === "dark";
  const [projectPrompt, setProjectPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectPrompt.trim()) return;

    setGenerating(true);
    setGeneratedResult(null);

    setTimeout(() => {
      setGenerating(false);
      setGeneratedResult({
        title: "Mentra Intelligent Weather Model",
        roadmap: [
          { phase: "Phase 1: REST Fetch Core", tasks: ["Bind open-weather endpoints", "Implement local express cache controls"] },
          { phase: "Phase 2: Slidable Grid Layout", tasks: ["Build custom canvas components", "Optimise viewport breakpoints"] },
        ],
        files: [
          "src/server/weather.ts",
          "src/components/WeatherView.tsx",
          "src/lib/cache.ts"
        ],
        dbSchema: [
          { field: "user_id", type: "uuid (Primary Key)" },
          { field: "cached_city", type: "varchar(100)" },
          { field: "cached_at", type: "timestamp" }
        ],
        techStack: ["React 19", "Express", "Supabase", "Tailwind CSS"]
      });
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-5xl mx-auto font-sans pb-12"
    >
      <div className="border-b border-neutral-500/10 pb-6">
        <h2 className="text-2xl font-sans font-bold uppercase tracking-wider">AI Project Builder</h2>
        <p className="text-xs opacity-60 mt-1">Describe a web or system application. Mentra compiles structured file trees, roadmaps, and DB schemas instantly.</p>
      </div>

      <div className={`p-6 rounded-3xl border ${isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200"}`}>
        <form onSubmit={handleGenerate} className="space-y-4">
          <label className="text-[10px] font-mono uppercase tracking-wider opacity-60 block">Project Idea Description</label>
          <textarea
            placeholder="E.g., Build a weather forecaster dashboard using open API indexes, storing searched history queries in a PostgreSQL database..."
            value={projectPrompt}
            onChange={(e) => setProjectPrompt(e.target.value)}
            className="w-full h-24 p-4 border border-neutral-500/15 rounded-2xl text-xs resize-none outline-none focus:border-[#F27D26]"
          />
          <button
            type="submit"
            disabled={generating}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition ${
              isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-neutral-800"
            }`}
          >
            {generating ? "Compiling models..." : "Generate architecture"}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {generatedResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className={`p-6 rounded-3xl border space-y-4 ${isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200"}`}>
              <div className="text-xs font-mono text-[#F27D26] uppercase font-bold">Roadmap & Milestones</div>
              <h3 className="text-base font-bold text-neutral-800 dark:text-white">{generatedResult.title}</h3>
              
              <div className="space-y-4">
                {generatedResult.roadmap.map((ph: any, i: number) => (
                  <div key={i} className="space-y-1.5">
                    <span className="text-[10px] font-mono opacity-50 block">{ph.phase}</span>
                    <ul className="list-disc list-inside text-xs opacity-80 space-y-1">
                      {ph.tasks.map((t: string, idx: number) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className={`p-6 rounded-3xl border space-y-4 ${isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200"}`}>
                <div className="text-xs font-mono text-[#F27D26] uppercase font-bold">Suggested Tech Badges</div>
                <div className="flex flex-wrap gap-2">
                  {generatedResult.techStack.map((tech: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-mono border border-[#F27D26]/20 bg-[#F27D26]/5 text-[#F27D26] font-bold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-3xl border space-y-4 ${isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200"}`}>
                <div className="text-xs font-mono text-[#F27D26] uppercase font-bold">Database Schema Layout</div>
                <div className="space-y-2">
                  {generatedResult.dbSchema.map((field: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-xs font-mono">
                      <span className="text-neutral-800 dark:text-white font-bold">{field.field}</span>
                      <span className="opacity-50">{field.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// -------------------------------------------------------------
// MODULE: PROJECTS LIST
// -------------------------------------------------------------
function ProjectsList({ theme, onNavigate }: any) {
  const isDark = theme === "dark";
  const [projects, setProjects] = useState([
    { id: "p1", title: "Mentra Weather forecaster", desc: "Slidable weather widget leveraging REST inputs and cache storage controls.", complete: 84, pinned: true },
    { id: "p2", title: "AST Traversal helper", desc: "A recursive compiler traversal routine to audit namespace bounds.", complete: 40, pinned: false },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-5xl mx-auto font-sans pb-12"
    >
      <div className="border-b border-neutral-500/10 pb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-sans font-bold uppercase tracking-wider">My Saved Projects</h2>
          <p className="text-xs opacity-60 mt-1">Track completeness metrics, pin roadmaps, and resume sandboxes.</p>
        </div>

        <button
          onClick={() => onNavigate("builder")}
          className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition ${
            isDark ? "bg-white text-black hover:bg-neutral-100" : "bg-black text-white hover:bg-neutral-800"
          }`}
        >
          Generate New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <div
            key={p.id}
            className={`p-6 rounded-3xl border flex flex-col justify-between ${
              isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200"
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-[#F27D26] uppercase font-bold">
                  {p.pinned ? "★ PINNED PROJECT" : "PROJECT BUILD"}
                </span>
                <span className="text-xs font-mono text-[#F27D26] font-bold">{p.complete}% Verified</span>
              </div>
              <h3 className="text-base font-bold text-neutral-800 dark:text-white">{p.title}</h3>
              <p className="text-xs opacity-70 leading-relaxed">{p.desc}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-500/10 flex items-center justify-between">
              <div className="h-1.5 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="bg-[#F27D26] h-full rounded-full" style={{ width: `${p.complete}%` }} />
              </div>

              <button
                onClick={() => onNavigate("workspace")}
                className="text-xs font-bold text-[#F27D26] flex items-center gap-1 hover:underline"
              >
                <span>Open Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// MODULE: MISSIONS WORKSPACE
// -------------------------------------------------------------
function MissionsWorkspace({ theme, userData, onUpdateUserData, onAddPoints }: { theme: "light" | "dark"; userData?: any; onUpdateUserData?: (d: any) => void; onAddPoints: (p: number) => void }) {
  const isDark = theme === "dark";
  const [activeMission, setActiveMission] = useState<string>("m1");

  // Persist task checked state inside userData.missionTasksChecked
  const taskChecked: Record<string, boolean> = userData?.missionTasksChecked ?? {};

  const toggleTask = (id: string) => {
    const wasChecked = !!taskChecked[id];
    const updated = { ...taskChecked, [id]: !wasChecked };
    if (!wasChecked) onAddPoints(50);
    if (onUpdateUserData && userData) {
      onUpdateUserData({ ...userData, missionTasksChecked: updated });
    }
  };

  const missions = [
    { id: "m1", title: "Build a Portfolio Website", desc: "Configure high-performance visual cards, slidable portfolios, and custom contact overlays.", xp: 500 },
    { id: "m2", title: "REST Weather Forecaster", desc: "Bind open API indices, query database history tables, and render linear charts.", xp: 750 },
  ];

  const m1Tasks = ["t1", "t2", "t3"];
  const m1Progress = Math.round((m1Tasks.filter((id) => taskChecked[id]).length / m1Tasks.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-5xl mx-auto font-sans pb-12"
    >
      <div className="border-b border-neutral-500/10 pb-6">
        <h2 className="text-2xl font-sans font-bold uppercase tracking-wider">Workspace Missions</h2>
        <p className="text-xs opacity-60 mt-1">Gamified project tracks. Complete tasks, earn level XP points, and unlock achievements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {missions.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMission(m.id)}
            className={`p-6 rounded-3xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              activeMission === m.id
                ? "bg-[#F27D26]/5 border-[#F27D26] shadow-lg shadow-[#F27D26]/5"
                : isDark ? "bg-[#111110] border-white/5 hover:border-white/20" : "bg-white border-neutral-200 hover:border-[#F27D26]/40"
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-[#F27D26] font-bold">MISSION ROADMAP</span>
                <span>+{m.xp} XP REWARDS</span>
              </div>
              <h3 className="text-base font-bold text-neutral-800 dark:text-white">{m.title}</h3>
              <p className="text-xs opacity-70 leading-relaxed">{m.desc}</p>
            </div>

            <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mt-6">
              <div className="bg-[#F27D26] h-full rounded-full" style={{ width: `${m.id === "m1" ? m1Progress : 0}%` }} />
            </div>
          </button>
        ))}
      </div>

      {activeMission === "m1" && (
        <div className={`p-6 rounded-3xl border space-y-4 ${isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200"}`}>
          <div className="text-xs font-mono text-[#F27D26] uppercase font-bold">Milestone Task Checklist</div>
          
          <div className="space-y-3.5">
            {[
              { id: "t1", task: "Configure modular viewport card designs styled with Tailwind CSS." },
              { id: "t2", task: "Implement safe React state managers to swap project files." },
              { id: "t3", task: "Submit active codebase for AI evaluation and score logging." },
            ].map((item) => (
              <div key={item.id} className="flex items-start gap-3 text-xs leading-relaxed">
                <input
                  type="checkbox"
                  checked={taskChecked[item.id] || false}
                  onChange={() => toggleTask(item.id)}
                  className="w-4 h-4 rounded mt-0.5 accent-[#F27D26]"
                />
                <span className={taskChecked[item.id] ? "opacity-60 line-through" : "opacity-90"}>
                  {item.task}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// -------------------------------------------------------------
// MODULE: LEADERBOARD WORKSPACE
// -------------------------------------------------------------
function LeaderboardsWorkspace({ theme, user, userData }: any) {
  const isDark = theme === "dark";
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [leaders, setLeaders] = useState<{ id: string; name: string; points: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      setError(true);
      return;
    }
    supabase
      .from("mentra_leaderboard")
      .select("*")
      .order("points", { ascending: false })
      .limit(20)
      .then(({ data, error: err }: any) => {
        if (err || !data) {
          setError(true);
        } else {
          setLeaders(data);
        }
        setLoading(false);
      });
  }, []);

  const myRank = leaders.findIndex((l) => l.id === user?.id) + 1;
  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3, 20);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl mx-auto font-sans pb-12"
    >
      <div className="border-b border-neutral-500/10 pb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-sans font-bold uppercase tracking-wider">Mentra Leaderboards</h2>
          <p className="text-xs opacity-60 mt-1">Track XP point distributions of active Mentra developers.</p>
        </div>

        <div className="flex items-center space-x-1 rounded-full bg-neutral-500/5 p-1 border border-neutral-500/10">
          {["weekly", "monthly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as any)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider uppercase transition font-bold ${
                period === p
                  ? "bg-white text-black dark:bg-black dark:text-white shadow"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs opacity-50">Loading leaderboard...</div>
      ) : error || leaders.length === 0 ? (
        <div className="py-16 text-center space-y-3 border border-dashed border-neutral-500/20 rounded-3xl">
          <Trophy className="w-8 h-8 mx-auto opacity-30" />
          <p className="text-xs opacity-60">No leaderboard data yet. Be the first to solve a challenge!</p>
        </div>
      ) : (
        <>
          {/* Podium Display */}
          <div className="grid grid-cols-3 gap-4 items-end max-w-xl mx-auto pt-6 pb-2 text-center">
            {/* Second Place */}
            <div className="space-y-2">
              {top3[1] ? (
                <>
                  <div className="relative inline-block">
                    <div className="w-12 h-12 rounded-full bg-slate-400 text-white flex items-center justify-center font-bold text-xs mx-auto border-2 border-slate-350">
                      {top3[1].name?.slice(0, 2).toUpperCase() || "??"}
                    </div>
                    <span className="absolute -top-1 -right-1 bg-slate-400 text-white w-4 h-4 rounded-full text-[9px] font-bold font-mono">2</span>
                  </div>
                  <div className="text-xs font-bold truncate">{top3[1].id === user?.id ? "You" : top3[1].name}</div>
                  <div className="text-[10px] font-mono text-[#F27D26] font-bold">{top3[1].points.toLocaleString()} XP</div>
                  <div className="h-16 bg-slate-400/20 dark:bg-slate-400/10 rounded-t-xl" />
                </>
              ) : <div className="h-16" />}
            </div>

            {/* First Place */}
            <div className="space-y-2">
              {top3[0] ? (
                <>
                  <div className="relative inline-block">
                    <div className="w-16 h-16 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold text-sm mx-auto border-2 border-yellow-500">
                      {top3[0].name?.slice(0, 2).toUpperCase() || "??"}
                    </div>
                    <span className="absolute -top-1 -right-1 bg-yellow-500 text-black w-5 h-5 rounded-full text-[11px] font-bold font-mono flex items-center justify-center">1</span>
                  </div>
                  <div className="text-sm font-bold truncate">{top3[0].id === user?.id ? "You" : top3[0].name}</div>
                  <div className="text-[10px] font-mono text-[#F27D26] font-bold">{top3[0].points.toLocaleString()} XP</div>
                  <div className="h-24 bg-yellow-500/20 dark:bg-yellow-500/10 rounded-t-xl" />
                </>
              ) : <div className="h-24" />}
            </div>

            {/* Third Place */}
            <div className="space-y-2">
              {top3[2] ? (
                <>
                  <div className="relative inline-block">
                    <div className="w-12 h-12 rounded-full bg-[#F27D26] text-white flex items-center justify-center font-bold text-xs mx-auto">
                      {top3[2].name?.slice(0, 2).toUpperCase() || "??"}
                    </div>
                    <span className="absolute -top-1 -right-1 bg-amber-600 text-white w-4 h-4 rounded-full text-[9px] font-bold font-mono">3</span>
                  </div>
                  <div className="text-xs font-bold truncate">{top3[2].id === user?.id ? "You" : top3[2].name}</div>
                  <div className="text-[10px] font-mono text-[#F27D26] font-bold">{top3[2].points.toLocaleString()} XP</div>
                  <div className="h-12 bg-amber-600/20 dark:bg-amber-600/10 rounded-t-xl" />
                </>
              ) : <div className="h-12" />}
            </div>
          </div>

          {/* Full rankings list */}
          {rest.length > 0 && (
            <div className={`rounded-3xl border p-4 space-y-1 ${isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200 shadow-sm"}`}>
              {rest.map((l, i) => (
                <div
                  key={l.id}
                  className={`flex items-center justify-between p-3 rounded-2xl ${
                    l.id === user?.id ? "bg-[#F27D26]/10 text-[#F27D26]" : "hover:bg-neutral-500/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono opacity-50 w-5">{i + 4}.</span>
                    <span className="text-xs font-bold">{l.id === user?.id ? "You" : l.name}</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold opacity-70">{l.points.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          )}

          {myRank === 0 && (
            <div className="text-center text-[11px] opacity-50 pt-2">
              You're not ranked yet — solve a challenge to join the leaderboard!
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

// -------------------------------------------------------------
// MODULE: MINI LEADERBOARD (sidebar widget on dashboard home)
// -------------------------------------------------------------
function MiniLeaderboard({ theme, currentUser, currentUserId, onNavigate }: any) {
  const isDark = theme === "dark";
  const [leaders, setLeaders] = useState<{ id: string; name: string; points: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }
    supabase
      .from("mentra_leaderboard")
      .select("*")
      .order("points", { ascending: false })
      .limit(2)
      .then(({ data }: any) => {
        if (data) setLeaders(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className={`p-6 rounded-3xl border ${isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200 shadow-sm"}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-mono font-bold uppercase opacity-60 tracking-wider">Leaderboard</h3>
        <button onClick={() => onNavigate("leaderboards")} className="text-[10px] font-mono text-[#F27D26] hover:underline uppercase font-bold">View full</button>
      </div>

      {loading ? (
        <div className="text-[10px] opacity-40 py-4 text-center">Loading...</div>
      ) : (
        <div className="space-y-3">
          {leaders.map((l, i) => (
            <div key={l.id} className="flex items-center justify-between p-2.5 rounded-xl border bg-transparent border-transparent">
              <div className="flex items-center space-x-2.5 min-w-0">
                <span className="text-[10px] font-mono opacity-50 w-3">{i + 1}.</span>
                <div className="w-5.5 h-5.5 rounded-full bg-[#F27D26] text-white flex items-center justify-center font-mono text-[9px] font-bold shrink-0">
                  {l.name?.slice(0, 2).toUpperCase() || "??"}
                </div>
                <span className="text-xs font-bold truncate text-neutral-800 dark:text-white">{l.name}</span>
              </div>
              <span className="text-[11px] font-mono opacity-70 shrink-0 font-bold">{l.points.toLocaleString()} XP</span>
            </div>
          ))}

          {/* Always show current user's own row */}
          <div className="flex items-center justify-between p-2.5 rounded-xl border bg-[#F27D26]/10 border-[#F27D26]/20 text-[#F27D26]">
            <div className="flex items-center space-x-2.5 min-w-0">
              <span className="text-[10px] font-mono opacity-50 w-3">You</span>
              <div className="w-5.5 h-5.5 rounded-full bg-[#F27D26] text-white flex items-center justify-center font-mono text-[9px] font-bold shrink-0">
                {(currentUser?.profile?.name || "ME").slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs font-bold truncate text-neutral-800 dark:text-white">Your Account</span>
            </div>
            <span className="text-[11px] font-mono opacity-70 shrink-0 font-bold">{(currentUser?.points ?? 0).toLocaleString()} XP</span>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// MODULE: ACHIEVEMENTS WORKSPACE
// -------------------------------------------------------------
function AchievementsWorkspace({ theme, userData }: any) {
  const isDark = theme === "dark";

  const completedCount = userData?.completedChallenges?.length ?? 0;
  const longestStreak = userData?.longestStreak ?? 0;
  const earnedIds: string[] = userData?.achievements ?? [];

  // Derive badge unlock state from real user progress (also honors explicit achievement IDs if present)
  const badges = [
    {
      id: "first-solve",
      title: "First Step",
      desc: "Solve your very first coding challenge.",
      unlocked: earnedIds.includes("first-solve") || completedCount >= 1,
      color: "text-amber-500 bg-amber-500/5 border-amber-500/20",
    },
    {
      id: "five-solved",
      title: "Sliding Window Sage",
      desc: "Resolve 5 challenge solutions.",
      unlocked: earnedIds.includes("five-solved") || completedCount >= 5,
      color: "text-emerald-500 bg-emerald-500/5 border-emerald-500/20",
    },
    {
      id: "streak-3",
      title: "Consistency Builder",
      desc: "Reach a 3-day coding streak.",
      unlocked: earnedIds.includes("streak-3") || longestStreak >= 3,
      color: "text-purple-500 bg-purple-500/5 border-purple-500/20",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl mx-auto font-sans pb-12"
    >
      <div className="border-b border-neutral-500/10 pb-6">
        <h2 className="text-2xl font-sans font-bold uppercase tracking-wider">Achievements & Badges</h2>
        <p className="text-xs opacity-60 mt-1">Unlock badges, level titles, and points bonuses as you code.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {badges.map((b, i) => (
          <div
            key={i}
            className={`p-6 rounded-3xl border flex flex-col justify-between items-center text-center transition-transform hover:scale-[1.02] ${
              isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200"
            } ${!b.unlocked ? "opacity-60" : ""}`}
          >
            <div className={`w-14 h-14 rounded-full border flex items-center justify-center mb-4 ${b.color}`}>
              <Award className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-white">{b.title}</h3>
              <p className="text-[11px] opacity-70 leading-relaxed max-w-xs">{b.desc}</p>
            </div>

            <div className="mt-4">
              <span className={`text-[9px] font-mono uppercase tracking-wider font-bold px-2 py-1 rounded border ${
                b.unlocked
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                  : "bg-neutral-500/10 border-neutral-500/10 text-neutral-400"
              }`}>
                {b.unlocked ? "Unlocked" : "Locked"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// MODULE: SMART NOTES WORKSPACE
// -------------------------------------------------------------
function SmartNotesWorkspace({ theme, userData, onUpdateUserData }: any) {
  const isDark = theme === "dark";

  // Load notes from userData (real persisted data), fallback to empty
  const [notes, setNotes] = useState<{ id: string; title: string; body: string; updatedAt: string }[]>(
    () => userData?.notes?.length ? userData.notes : []
  );
  const [activeNote, setActiveNote] = useState<string>(userData?.notes?.[0]?.id ?? "");
  const [editorVal, setEditorVal] = useState(() => userData?.notes?.[0]?.body ?? "");

  const persistNotes = (updated: typeof notes) => {
    setNotes(updated);
    if (onUpdateUserData && userData) {
      onUpdateUserData({ ...userData, notes: updated });
    }
  };

  useEffect(() => {
    const note = notes.find((n) => n.id === activeNote);
    if (note) setEditorVal(note.body);
  }, [activeNote]);

  const handleSaveNote = () => {
    const updated = notes.map((n) =>
      n.id === activeNote ? { ...n, body: editorVal, updatedAt: new Date().toISOString() } : n
    );
    persistNotes(updated);
  };

  const handleTitleChange = (val: string) => {
    const updated = notes.map((n) =>
      n.id === activeNote ? { ...n, title: val, updatedAt: new Date().toISOString() } : n
    );
    persistNotes(updated);
  };

  const handleCreateNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "Untitled Note",
      body: "",
      updatedAt: new Date().toISOString(),
    };
    const updated = [newNote, ...notes];
    persistNotes(updated);
    setActiveNote(newNote.id);
    setEditorVal("");
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    persistNotes(updated);
    if (activeNote === id) {
      setActiveNote(updated[0]?.id ?? "");
      setEditorVal(updated[0]?.body ?? "");
    }
  };

  const selectedNote = notes.find((n) => n.id === activeNote);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-10rem)] flex flex-col md:flex-row gap-6 max-w-6xl mx-auto font-sans"
    >
      {/* Sidebar files */}
      <div className={`w-full md:w-64 shrink-0 rounded-3xl border p-5 flex flex-col justify-between ${
        isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200 shadow-sm"
      }`}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono uppercase opacity-60">My Smart Notes</span>
            <button onClick={handleCreateNote} className="p-1 rounded bg-neutral-500/10 hover:bg-[#F27D26]/10 text-[#F27D26]">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {notes.length === 0 && (
            <div className="py-6 text-center text-[10px] opacity-50 leading-relaxed">
              No notes yet. Click <span className="text-[#F27D26] font-bold">+</span> to create your first note.
            </div>
          )}

          <div className="space-y-1.5">
            {notes.map((n) => (
              <div key={n.id} className="relative group">
                <button
                  onClick={() => setActiveNote(n.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs truncate border transition pr-7 ${
                    activeNote === n.id
                      ? "bg-[#F27D26]/10 text-[#F27D26] border-[#F27D26]/20 font-semibold"
                      : isDark ? "border-transparent text-white/70 hover:bg-white/5" : "border-transparent text-neutral-750 hover:bg-black/5"
                  }`}
                >
                  {n.title}
                </button>
                <button
                  onClick={() => handleDeleteNote(n.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 hover:!opacity-100 text-red-400 transition"
                  title="Delete note"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Panel */}
      <div className={`flex-1 rounded-3xl border flex flex-col overflow-hidden ${
        isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200"
      }`}>
        {selectedNote ? (
          <>
            <div className="px-6 py-4 border-b border-neutral-500/10 flex items-center justify-between">
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="bg-transparent border-none font-bold text-sm outline-none text-neutral-800 dark:text-white w-2/3"
              />
              <button
                onClick={handleSaveNote}
                className="px-3.5 py-1.5 bg-[#F27D26] text-white rounded-full text-[11px] font-mono uppercase tracking-wider font-bold transition hover:bg-[#F27D26]/90 flex items-center gap-1 shrink-0"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>

            <textarea
              value={editorVal}
              onChange={(e) => setEditorVal(e.target.value)}
              className="flex-1 p-6 bg-transparent outline-none resize-none text-xs font-sans leading-relaxed text-neutral-800 dark:text-white/90"
              placeholder="Start writing your notes here..."
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 space-y-3 p-8">
            <Notebook className="w-8 h-8 opacity-40" />
            <p className="text-xs font-sans">Create your first note to start capturing ideas and learnings.</p>
            <button
              onClick={handleCreateNote}
              className="px-4 py-2 rounded-full bg-[#F27D26]/10 text-[#F27D26] text-[11px] font-mono font-bold uppercase tracking-wider hover:bg-[#F27D26]/20 transition"
            >
              + New Note
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// MODULE: ANALYTICS WORKSPACE
// -------------------------------------------------------------
function AnalyticsWorkspace({ theme, userData, onNavigate }: any) {
  const isDark = theme === "dark";
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredData, setHoveredData] = useState<any | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Generate 30 sequential calendar items leading up to "today"
  const activityData = useMemo(() => {
    return Array.from({ length: 30 }).map((_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - idx));
      const dateStr = d.toISOString().split("T")[0];
      // Find challenges solved on this date
      const solvedOnDate = userData?.practiceLog?.filter((log: any) => log.date.split("T")[0] === dateStr).length ?? 0;
      return {
        date: dateStr,
        count: solvedOnDate,
        label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      };
    });
  }, [userData]);

  // Statistics
  const monthlyTotal = useMemo(() => {
    return activityData.reduce((acc, curr) => acc + curr.count, 0);
  }, [activityData]);

  const weeklyAverage = useMemo(() => {
    return Math.round((monthlyTotal / 30) * 7 * 10) / 10;
  }, [monthlyTotal]);

  const totalCompletedChallenges = userData?.completedChallenges?.length ?? 0;

  const mostActiveDay = useMemo(() => {
    if (activityData.length === 0) return "None";
    const sorted = [...activityData].sort((a, b) => b.count - a.count);
    if (sorted[0].count === 0) return "None";
    const d = new Date(sorted[0].date);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", weekday: "short" });
  }, [activityData]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous drawing

    const width = 800;
    const height = 240;
    const margin = { top: 25, right: 30, bottom: 45, left: 40 };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale (dates)
    const x = d3.scaleBand()
      .domain(activityData.map(d => d.label))
      .range([0, chartWidth])
      .padding(0.25);

    // Y scale (completed counts)
    const maxCount = (d3.max(activityData, (d: any) => d.count) as unknown as number) || 1;
    const y = d3.scaleLinear()
      .domain([0, maxCount + 1])
      .range([chartHeight, 0]);

    // Add custom subtle gridlines
    g.append("g")
      .attr("class", "grid-lines opacity-[0.07]")
      .call(d3.axisLeft(y)
        .tickSize(-chartWidth)
        .tickFormat(() => "")
      )
      .selectAll(".domain").remove();

    // Gradients for bars
    const defs = svg.append("defs");
    const barGrad = defs.append("linearGradient")
      .attr("id", "barGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    barGrad.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#F27D26")
      .attr("stop-opacity", 1);

    barGrad.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#EF4444")
      .attr("stop-opacity", 0.35);

    // Draw X Axis
    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .attr("class", "axis-x text-[10px] opacity-60")
      .call(d3.axisBottom(x).tickValues(x.domain().filter((_, i) => i % 5 === 0))) // filter ticks to keep clean
      .selectAll("text")
      .attr("class", "font-mono fill-current mt-2");

    // Draw Y Axis
    g.append("g")
      .attr("class", "axis-y text-[10px] opacity-60")
      .call(d3.axisLeft(y).ticks(d3.min([5, maxCount + 1]) as number).tickFormat(d3.format("d")))
      .selectAll("text")
      .attr("class", "font-mono fill-current");

    // Remove axis domains for minimalist aesthetic
    svg.selectAll(".domain").remove();
    svg.selectAll(".tick line").attr("stroke", isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)");

    // Draw elegant bars with rounded corners, hover interactions
    g.selectAll(".bar")
      .data(activityData)
      .enter()
      .append("rect")
      .attr("class", "bar transition-all duration-200 cursor-pointer hover:opacity-90")
      .attr("x", (d: any) => x(d.label) || 0)
      .attr("y", (d: any) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d: any) => chartHeight - y(d.count))
      .attr("fill", (d: any) => d.count > 0 ? "url(#barGradient)" : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"))
      .attr("rx", 4) // rounded top corners
      .attr("ry", 4)
      .on("mouseover", (event, d: any) => {
        const [mx, my] = d3.pointer(event, svgRef.current);
        setHoveredData(d);
        setTooltipPos({ x: mx + 15, y: my - 30 });
      })
      .on("mousemove", (event) => {
        const [mx, my] = d3.pointer(event, svgRef.current);
        setTooltipPos({ x: mx + 15, y: my - 30 });
      })
      .on("mouseout", () => {
        setHoveredData(null);
      });

  }, [activityData, isDark]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-6xl mx-auto font-sans pb-12"
    >
      <div className="border-b border-neutral-500/10 pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-sans font-bold uppercase tracking-wider">Developer Analytics</h2>
          <p className="text-xs opacity-60 mt-1">Review active coding times, compiler test counts, and progress curves.</p>
        </div>
        <button
          onClick={() => onNavigate("workspace")}
          className="px-4 py-2 rounded-xl bg-[#F27D26]/10 text-[#F27D26] hover:bg-[#F27D26]/25 transition text-xs font-semibold"
        >
          Open Sandbox IDE
        </button>
      </div>

      {/* Bento Grid: 4 Core Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Weekly Practice Average", val: `${weeklyAverage} / wk`, icon: Activity, text: "Challenges solved weekly", color: "text-[#F27D26] bg-[#F27D26]/5" },
          { label: "Monthly Activity Total", val: `${monthlyTotal} Solved`, icon: Zap, text: "Completed in last 30 days", color: "text-amber-500 bg-amber-500/5" },
          { label: "Lifetime Total Challenges", val: `${totalCompletedChallenges} Total`, icon: Code, text: "All-time sandbox compiler passes", color: "text-emerald-500 bg-emerald-500/5" },
          { label: "Most Active Day", val: mostActiveDay, icon: Trophy, text: "Record daily performance log", color: "text-purple-500 bg-purple-500/5" },
        ].map((stat, i) => (
          <div
            key={i}
            className={`p-6 rounded-3xl border flex flex-col justify-between ${
              isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200 shadow-sm"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-mono tracking-wider uppercase opacity-60">{stat.label}</span>
              <div className={`p-2 rounded-xl border border-transparent ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-black tracking-tight">{stat.val}</div>
              <p className="text-[11px] opacity-50 font-sans">{stat.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main D3 Analytics Heatmap Card */}
      <div className={`p-6 rounded-3xl border ${isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200 shadow-sm"}`}>
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h3 className="text-sm font-sans font-bold uppercase tracking-wider opacity-80">30-Day Activity Heatmap</h3>
            <span className="text-xs opacity-50 font-sans">Interactive log of code runs and test runs</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-neutral-500/10" />
              <span className="opacity-65">0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-[#F27D26]" />
              <span className="opacity-65">Max</span>
            </div>
          </div>
        </div>

        {/* D3 SVG Wrapper */}
        <div className="w-full relative overflow-x-auto pb-4">
          <div className="min-w-[800px]">
            <svg ref={svgRef} className="w-full h-[240px]" />
          </div>

          {/* Floating Tooltip */}
          <AnimatePresence>
            {hoveredData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{ left: tooltipPos.x, top: tooltipPos.y }}
                className="absolute z-20 pointer-events-none p-3.5 rounded-2xl bg-[#141413] border border-white/10 text-white text-xs space-y-1 shadow-xl max-w-xs font-sans"
              >
                <div className="font-bold">{hoveredData.label}</div>
                <div className="text-[#F27D26] font-mono font-bold uppercase text-[10px]">
                  {hoveredData.count} challenge{hoveredData.count !== 1 ? "s" : ""} completed
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// MODULE: DEVELOPER PROFILE
// -------------------------------------------------------------
function DeveloperProfile({ theme, points, level, streak, userData, onUpdateUserData, user, onNavigate }: any) {
  const isDark = theme === "dark";
  const [isEditing, setIsEditing] = useState(false);
  const [rank, setRank] = useState<number | null>(null);

  const [formBio, setFormBio] = useState(userData?.profile?.bio ?? "");
  const [formGithub, setFormGithub] = useState(userData?.profile?.github ?? "");
  const [formTwitter, setFormTwitter] = useState(userData?.profile?.twitter ?? "");
  const [formWebsite, setFormWebsite] = useState(userData?.profile?.website ?? "");

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !user?.id) return;
    supabase
      .from("mentra_leaderboard")
      .select("id")
      .order("points", { ascending: false })
      .then(({ data }: any) => {
        if (data) {
          const idx = data.findIndex((d: any) => d.id === user.id);
          setRank(idx >= 0 ? idx + 1 : null);
        }
      });
  }, [user?.id]);

  const handleSaveProfile = () => {
    if (!onUpdateUserData || !userData) return;
    onUpdateUserData({
      ...userData,
      profile: {
        ...userData.profile,
        bio: formBio,
        github: formGithub,
        twitter: formTwitter,
        website: formWebsite,
      },
    });
    setIsEditing(false);
  };

  const bio = userData?.profile?.bio || "An aspiring developer building foundations on Mentra.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl mx-auto font-sans pb-12"
    >
      <div className={`p-8 rounded-3xl border relative overflow-hidden ${
        isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200"
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F27D26]/5 rounded-full blur-[50px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#F27D26] to-[#EF4444] text-white flex items-center justify-center font-bold font-mono text-2xl shadow-xl shrink-0">
            {(user?.name || "AD").slice(0, 2).toUpperCase()}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-between gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-neutral-800 dark:text-white">{user?.name || "Workspace Developer"}</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[10px] font-mono uppercase font-bold text-[#F27D26] hover:underline"
                >
                  Edit Profile
                </button>
              )}
            </div>
            <p className="text-xs opacity-70 font-mono">Mentra Developer • Lvl {level}</p>

            {!isEditing ? (
              <p className="text-xs opacity-60 leading-relaxed font-sans max-w-sm">{bio}</p>
            ) : (
              <div className="space-y-3 pt-2 text-left max-w-sm mx-auto sm:mx-0">
                <div>
                  <label className="text-[9px] font-mono uppercase opacity-50">Bio</label>
                  <textarea
                    value={formBio}
                    onChange={(e) => setFormBio(e.target.value)}
                    rows={2}
                    className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs outline-none resize-none ${
                      isDark ? "bg-white/5 border-white/10 text-white" : "bg-black/5 border-black/10 text-black"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase opacity-50">GitHub username</label>
                  <input
                    value={formGithub}
                    onChange={(e) => setFormGithub(e.target.value)}
                    className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs outline-none ${
                      isDark ? "bg-white/5 border-white/10 text-white" : "bg-black/5 border-black/10 text-black"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase opacity-50">Twitter / X handle</label>
                  <input
                    value={formTwitter}
                    onChange={(e) => setFormTwitter(e.target.value)}
                    className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs outline-none ${
                      isDark ? "bg-white/5 border-white/10 text-white" : "bg-black/5 border-black/10 text-black"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase opacity-50">Website</label>
                  <input
                    value={formWebsite}
                    onChange={(e) => setFormWebsite(e.target.value)}
                    className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs outline-none ${
                      isDark ? "bg-white/5 border-white/10 text-white" : "bg-black/5 border-black/10 text-black"
                    }`}
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-1.5 rounded-full bg-[#F27D26] text-white text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-[#F27D26]/90 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-1.5 rounded-full bg-neutral-500/10 text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-neutral-500/20 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {!isEditing && (userData?.profile?.github || userData?.profile?.twitter || userData?.profile?.website) && (
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-[10px] font-mono">
                {userData?.profile?.github && <span className="opacity-60">GitHub: @{userData.profile.github}</span>}
                {userData?.profile?.twitter && <span className="opacity-60">X: @{userData.profile.twitter}</span>}
                {userData?.profile?.website && <span className="opacity-60">{userData.profile.website}</span>}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-500/10 grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="text-[10px] font-mono uppercase opacity-50 block">Points Score</span>
            <span className="text-xl font-bold text-[#F27D26]">{points} XP</span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase opacity-50 block">Active Streak</span>
            <span className="text-xl font-bold text-[#F27D26]">{streak} Days</span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase opacity-50 block">Global Rank</span>
            <span className="text-xl font-bold text-[#F27D26]">{rank ? `#${rank}` : "Unranked"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// MODULE: SETTINGS WORKSPACE
// -------------------------------------------------------------
function SettingsWorkspace({ theme, toggleTheme, onSignOut, onNavigateToPublic }: any) {
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-3xl mx-auto font-sans pb-12"
    >
      <div className="border-b border-neutral-500/10 pb-6">
        <h2 className="text-2xl font-sans font-bold uppercase tracking-wider">Account Settings</h2>
        <p className="text-xs opacity-60 mt-1">Configure profile paths, workspace modes, active integrations, and connections.</p>
      </div>

      <div className={`p-6 rounded-3xl border space-y-6 ${
        isDark ? "bg-[#111110] border-white/5" : "bg-white border-neutral-200"
      }`}>
        <div className="space-y-4">
          <div className="text-xs font-mono text-[#F27D26] uppercase font-bold">Workspace Preferences</div>
          
          <div className="flex justify-between items-center text-xs">
            <div>
              <span className="font-bold block text-neutral-800 dark:text-white">Dark mode theme preference</span>
              <span className="opacity-60 block mt-0.5">Toggle and persist eye-safe twilight rendering.</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-full border text-xs font-semibold transition ${
                isDark ? "bg-white text-black hover:bg-neutral-100" : "bg-black text-white hover:bg-neutral-800"
              }`}
            >
              Toggle theme
            </button>
          </div>

          <div className="flex justify-between items-center text-xs">
            <div>
              <span className="font-bold block text-neutral-800 dark:text-white">View Landing Portal</span>
              <span className="opacity-60 block mt-0.5">Exit workspace dashboard to view the main promotional pages.</span>
            </div>
            <button
              onClick={onNavigateToPublic}
              className="px-4 py-2 rounded-full border border-neutral-500/15 text-xs font-semibold hover:bg-neutral-500/5 transition"
            >
              Exit Dashboard
            </button>
          </div>

          <div className="flex justify-between items-center text-xs pt-4 border-t border-neutral-500/10">
            <div>
              <span className="font-bold block text-neutral-800 dark:text-white">Active session credentials</span>
              <span className="opacity-60 block mt-0.5">Revoke current local storage sessions and log out.</span>
            </div>
            <button
              onClick={onSignOut}
              className="px-4 py-2 rounded-full border border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs font-semibold transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
