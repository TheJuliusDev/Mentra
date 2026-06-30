import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, X, Sparkles, Trophy, Code, MessageSquare, LayoutDashboard, Settings } from "lucide-react";

interface ProductTourProps {
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onFinish: () => void;
}

export const TOUR_STEPS = [
  {
    tab: "dashboard",
    title: "Your Developer Command Center 👋",
    description: "Welcome to Mentra! This is your personalized dashboard where you can check your live statistics, track your coding streak 🔥, and review recent achievements.",
    icon: LayoutDashboard,
  },
  {
    tab: "chat",
    title: "AI Workspace Channel 💬",
    description: "Ask questions, whiteboard algorithms in Learn Mode, refactor complexity in Tech Mode, or counseling in Companion Mode. Your conversation is fully saved.",
    icon: MessageSquare,
  },
  {
    tab: "challenges",
    title: "Curated Practice Challenges 🏆",
    description: "Tackle standard data structures and algorithmic challenges. Earn experience points (XP) to level up your developer profile.",
    icon: Trophy,
  },
  {
    tab: "workspace",
    title: "Browser-Sandboxed IDE 💻",
    description: "Write code, run actual test suites, view terminal compilation logs, and download your finalized code solutions with one click.",
    icon: Code,
  },
  {
    tab: "learn",
    title: "Syllabus Roadmap 🎯",
    description: "Explore computer science topics, complete core roadmap milestones, and systematically build deep engineering intuitions.",
    icon: Sparkles,
  },
  {
    tab: "analytics",
    title: "D3.js Activity Analytics 📊",
    description: "Visualize your code execution habits, rolling 30-day solved metrics, weekly velocity averages, and practice consistency curves.",
    icon: Trophy,
  },
  {
    tab: "achievements",
    title: "Unlocked Milestones 🏅",
    description: "Review your completed challenges, earned certificates, and unlockable game badges. Share your progression with peers.",
    icon: Trophy,
  },
  {
    tab: "profile",
    title: "Developer Identity 👤",
    description: "Customize your developer bio, set a pixel-art avatar, and link your social handles to display on the global boards.",
    icon: Trophy,
  },
  {
    tab: "settings",
    title: "SaaS Controls & Tour ⚙️",
    description: "Manage dark mode, sign out safely, or replay this workspace onboarding tutorial at any time in the future.",
    icon: Settings,
  }
];

export default function ProductTour({ currentStep, onNext, onPrev, onSkip, onFinish }: ProductTourProps) {
  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;
  const progressPercent = ((currentStep + 1) / TOUR_STEPS.length) * 100;

  const Icon = step.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Semi-transparent dark background backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.65 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
          onClick={onSkip}
        />

        {/* Floating Interactive Tooltip Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#121211] border border-white/10 rounded-3xl p-6 text-white shadow-2xl z-10"
        >
          {/* Close / Skip button */}
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 transition text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon Badge */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#F27D26]/15 flex items-center justify-center text-[#F27D26]">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#F27D26] uppercase font-bold">
                Workspace Tour
              </span>
              <h4 className="text-sm font-sans font-semibold text-neutral-300">
                Exploring the Console
              </h4>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2 mb-6">
            <h3 className="text-lg font-sans font-bold tracking-tight text-white leading-snug">
              {step.title}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5 mb-6">
            <div className="flex justify-between text-[10px] font-mono text-neutral-400">
              <span>Step {currentStep + 1} of {TOUR_STEPS.length}</span>
              <span>{Math.round(progressPercent)}% Completed</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F27D26] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Tour Controls */}
          <div className="flex justify-between items-center">
            <button
              onClick={onSkip}
              className="text-xs font-mono text-neutral-500 hover:text-neutral-300 transition focus:outline-none"
            >
              Skip Tour
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={onPrev}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-300 text-xs font-semibold flex items-center gap-1 transition focus:outline-none"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}

              <button
                onClick={isLast ? onFinish : onNext}
                className="px-4 py-2 rounded-xl bg-[#F27D26] hover:bg-[#F27D26]/90 text-white text-xs font-semibold flex items-center gap-1 transition focus:outline-none shadow-lg shadow-[#F27D26]/10"
              >
                <span>{isLast ? "Get Started" : "Next"}</span>
                {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
