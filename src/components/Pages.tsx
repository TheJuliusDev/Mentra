/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Play,
  ArrowRight,
  BookOpen,
  Award,
  Terminal,
  Activity,
  Heart,
  Compass,
  Smile,
  Globe,
  CheckCircle,
  Search,
  MessageSquare,
  Coffee,
  HelpCircle,
  Mail,
  Send,
  Github,
  Linkedin,
  Twitter,
  ChevronDown,
  ChevronUp,
  Flame,
  User,
  ExternalLink,
  Code,
} from "lucide-react";
import {
  PRACTICE_CHALLENGES,
  BLOG_POSTS,
  TESTIMONIALS,
  TIMELINE,
  FAQ_ITEMS,
  Challenge,
} from "../types";
import InteractiveShowcase from "./InteractiveShowcase";
import { ChallengeCardSkeleton, SidebarBlockSkeleton, LeaderboardSkeleton } from "./Skeleton";

interface PageProps {
  theme: "light" | "dark";
  onNavigate: (page: string) => void;
  onSelectChallenge?: (challenge: Challenge) => void;
}

// -------------------------------------------------------------
// 1. HOME PAGE
// -------------------------------------------------------------
export function PageHome({ theme, onNavigate, onSelectChallenge }: PageProps) {
  const isDark = theme === "dark";

  return (
    <div className="w-full space-y-32 pb-24">
      {/* Hero Section - Asymmetrical and Editorial */}
      <section className="relative min-h-[90vh] flex items-center pt-24">
        {/* Background Decorative Glow (Artistic Flair peach/orange highlight) */}
        <div className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#F27D26]/5 dark:bg-[#F27D26]/10 rounded-full blur-[100px] right-6 sm:right-24 top-12 pointer-events-none z-0"></div>

        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Editorial Headline */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                isDark ? "bg-white/10 text-[#FAF9F6]" : "bg-[#E8E6E0] text-[#1A1A1A]"
              }`}>
                Series A Funded
              </span>
              <span className="text-[10px] text-[#1A1A1A]/55 dark:text-white/50 font-bold uppercase tracking-widest">
                Version 2.0 Available
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-[90px] lg:text-[100px] leading-[0.9] font-medium tracking-tighter text-[#1A1A1A] dark:text-white font-sans">
              Learn.<br/>Practice.<br/>
              <span className="italic font-serif text-[#F27D26]">Build.</span>
            </h1>

            <p className="max-w-md text-base sm:text-lg text-[#1A1A1A]/70 dark:text-white/70 leading-relaxed font-sans">
              The intelligent interface for technical growth. Master programming with an AI companion that scales from syntax help to deep system design architecture.
            </p>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  id="launch-sandbox"
                  onClick={() => onNavigate("auth")}
                  className={`px-8 py-4 border-2 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition duration-300 transform active:scale-95 ${
                    isDark
                      ? "border-white bg-white text-black hover:bg-transparent hover:text-white"
                      : "border-black bg-black text-white hover:bg-transparent hover:text-black"
                  }`}
                >
                  <span>Start Learning Free</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </button>
                <button
                  id="home-view-product"
                  onClick={() => onNavigate("features")}
                  className={`px-8 py-4 rounded-full text-sm font-bold transition duration-300 ${
                    isDark
                      ? "bg-white/10 text-white hover:bg-white/15"
                      : "bg-[#E8E6E0] text-black hover:bg-[#DEDCD5]"
                  }`}
                >
                  View Product Features
                </button>
              </div>
              <p className="text-xs opacity-60 flex items-center gap-1.5 font-sans">
                <span>🔒 You will need to sign up to save sandboxes, keep tracking statistics, and customize companion channels. Registering is free and instant!</span>
              </p>
            </div>

            {/* Micro specs / details */}
            <div className="flex space-x-8 pt-6 border-t border-black/5 dark:border-white/5 max-w-lg">
              <div>
                <span className="block text-2xl font-serif italic text-[#F27D26]">10k+</span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-50">Active Coders</span>
              </div>
              <div>
                <span className="block text-2xl font-serif italic text-[#F27D26]">200+</span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-50">Sandbox Tiers</span>
              </div>
              <div>
                <span className="block text-2xl font-serif italic text-[#F27D26]">50ms</span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-50">Compiler Speed</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Interactive Mockup */}
          <div className="lg:col-span-5 relative flex items-center justify-center z-10">
            {/* Product UI Mockup (Floating) */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] bg-black rounded-[32px] p-1.5 shadow-2xl overflow-hidden border border-white/10">
              <div className="w-full h-full bg-[#111111] rounded-[26px] flex flex-col justify-between">
                {/* Mock App Header */}
                <div className="h-12 border-b border-white/10 flex items-center px-6 justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                  </div>
                  <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Companion Mode</div>
                  <div className="w-4"></div>
                </div>

                {/* Mock Code Area */}
                <div className="flex-1 p-6 font-mono text-[12px] sm:text-[13px] leading-relaxed text-left">
                  <div className="text-[#7AA6DA]">async function <span className="text-[#B9A1DC]">mentra</span>() {"{"}</div>
                  <div className="pl-4 text-white/80">const progress = await ai.analyze();</div>
                  <div className="pl-4 text-[#C3E88D] font-sans italic">// Optimize your workflow</div>
                  <div className="pl-4 text-white/80">if (progress.gap) {"{"}</div>
                  <div className="pl-8 text-white/50">suggestChallenge(progress.gap);</div>
                  <div className="pl-4 text-white/80">{"}"}</div>
                  <div className="text-[#7AA6DA]">{"}"}</div>

                  {/* AI Chat Overlay */}
                  <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#F27D26] flex-shrink-0 flex items-center justify-center text-[10px] text-white font-bold">M</div>
                      <div className="space-y-2">
                        <p className="text-white/90 text-xs font-sans">You're hitting a wall with <span className="text-[#F27D26] font-semibold">Recursion</span>. Should we pivot to a visual diagram of the stack frames?</p>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-white/10 rounded-full text-[9px] text-white/60 border border-white/5 cursor-default">Yes, visualize</button>
                          <button className="px-3 py-1 bg-white/10 rounded-full text-[9px] text-white/60 border border-white/5 cursor-default">Keep practicing</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mock Status Bar */}
                <div className="h-10 px-6 flex items-center justify-between border-t border-white/10 bg-white/[0.02] rounded-b-[26px]">
                  <div className="text-[9px] text-white/40 flex items-center gap-2 uppercase tracking-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    Ready to deploy
                  </div>
                  <div className="flex gap-4">
                    <div className="w-3 h-3 bg-white/20 rounded-sm"></div>
                    <div className="w-3 h-3 bg-white/20 rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Showcase Sandbox section */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F27D26]">
            PROVING GROUNDS
          </span>
          <h2 className="text-3xl md:text-5xl font-sans tracking-tight font-bold">
            Experience Mentra Live
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
            Write raw code, toggle into our wellness companion stream, or view interactive developer statistics instantly. No signup required.
          </p>
        </div>

        <InteractiveShowcase theme={theme} />
      </section>

      {/* Mentra Mobile App Promotional Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className={`p-8 md:p-12 rounded-[32px] border relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 ${
          isDark 
            ? "bg-gradient-to-br from-[#F27D26]/10 via-transparent to-transparent border-white/10" 
            : "bg-gradient-to-br from-[#F27D26]/5 via-transparent to-transparent border-black/5"
        }`}>
          {/* Decorative background lights */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F27D26]/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="space-y-6 max-w-xl text-center md:text-left relative z-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#F27D26] bg-[#F27D26]/10 px-3 py-1 rounded-full border border-[#F27D26]/20">
              NEW: MOBILE COMPANION APP
            </span>
            <h2 className="text-3xl md:text-5xl font-sans tracking-tight font-bold">
              Mentra Mobile is live.
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
              We've created a pocket-sized version of Mentra designed explicitly for developers on the move. Complete algorithm challenges, keep your streak alive, and have supportive companion check-ins right from your phone.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button
                onClick={() => onNavigate("mobile")}
                className="px-6 py-3 rounded-full text-xs font-bold bg-[#F27D26] hover:bg-[#F27D26]/90 text-white shadow-lg transition active:scale-95 cursor-pointer"
              >
                Launch Mobile Simulator 📱
              </button>
              <button
                onClick={() => alert("Mentra Mobile is currently in closed beta for TestFlight and Google Play Console.")}
                className={`px-6 py-3 rounded-full text-xs font-bold border transition ${
                  isDark
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    : "bg-black/5 border-black/10 hover:bg-black/10 text-black"
                }`}
              >
                Request Download Code
              </button>
            </div>
          </div>

          {/* Visual Smartphone simulation on desktop */}
          <div className="relative shrink-0 w-[200px] h-[340px] rounded-[32px] border-[6px] border-neutral-800 bg-black shadow-2xl overflow-hidden hidden md:block">
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-neutral-900 rounded-full z-20" />
            <div className="w-full h-full p-2.5 flex flex-col justify-between text-left">
              {/* StatusBar Mock */}
              <div className="flex items-center justify-between text-[7px] text-neutral-500 font-mono select-none">
                <span>9:41 AM</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              
              {/* Mock App Content */}
              <div className="flex-1 flex flex-col justify-center space-y-2 py-4">
                <div className="w-6 h-6 rounded-full bg-[#F27D26] flex items-center justify-center text-[8px] text-[#FAF9F6] font-bold">M</div>
                <p className="text-[10px] font-sans font-bold leading-tight text-[#FAF9F6]">"Got a tricky bug to solve today, Dev?"</p>
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full" />
                  <div className="h-1.5 w-3/4 bg-neutral-800 rounded-full" />
                </div>
              </div>

              {/* Bottom Nav bar Mock */}
              <div className="h-6 border-t border-white/5 flex items-center justify-around">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F27D26]" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Storytelling Learning Experience Scene Sections */}
      <section className="max-w-7xl mx-auto px-6 space-y-20 pt-16">
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            A DAY IN THE LIFE
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold">
            Built for how you live and learn.
          </h2>
        </div>

        {/* Story Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              time: "Morning Scene",
              title: "Learn JavaScript.",
              desc: "Wake up to modular interactive tutorials that are micro-sized for swift reading. Master advanced topics such as closure bindings, AST engines, and asynchronous queues securely.",
              icon: BookOpen,
              color: "from-blue-500/20 to-indigo-500/20",
            },
            {
              time: "Afternoon Scene",
              title: "Practice coding.",
              desc: "Write actual solution blocks inside our clean visual sandbox editor. Run automatic feedback and stream comprehensive Big O estimations instantly via Mentra's compiler.",
              icon: Code,
              color: "from-orange-500/20 to-amber-500/20",
            },
            {
              time: "Evening Scene",
              title: "Talk with Companion.",
              desc: "Decompress after a long day of intense programming. Toggle into Companion Mode to reflect on stress, receive personalized motivation logs, or brainstorm new side-projects.",
              icon: Smile,
              color: "from-green-500/20 to-teal-500/20",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`rounded-2xl border p-8 space-y-6 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between ${
                  isDark
                    ? "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700"
                    : "bg-white border-neutral-200 hover:border-neutral-300 shadow-md"
                }`}
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="block text-[10px] font-mono opacity-50 uppercase tracking-widest">{item.time}</span>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-sm opacity-70 leading-relaxed font-sans">{item.desc}</p>
                </div>
                <div className="pt-4 border-t border-neutral-500/10 flex justify-between items-center">
                  <span className="text-xs font-mono font-medium opacity-60">Phase {idx + 1}</span>
                  <button
                    onClick={() => {
                      if (idx === 0) onNavigate("features");
                      else if (idx === 1) onNavigate("practice");
                      else onNavigate("companion");
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 flex items-center hover:underline space-x-1"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust & Testimonial Carousel Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F27D26]">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl md:text-4xl font-sans tracking-tight font-bold text-[#1A1A1A] dark:text-white">
            Loved by builders worldwide.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between space-y-6 ${
                isDark ? "bg-neutral-900/40 border-neutral-850" : "bg-neutral-50 border-neutral-200"
              }`}
            >
              <p className="text-xs leading-relaxed opacity-80 italic">"{test.text}"</p>
              <div className="flex items-center space-x-3 pt-4 border-t border-neutral-500/10">
                <img
                  src={test.avatar}
                  alt={test.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full border border-[#F27D26]/20 shrink-0"
                />
                <div>
                  <h4 className="text-xs font-bold leading-none">{test.name}</h4>
                  <span className="text-[10px] opacity-50 block mt-1">
                    {test.role}{test.company ? ` @ ` : ""}{test.company ? <b className="font-semibold">{test.company}</b> : null}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="p-10 md:p-16 rounded-[32px] bg-[#121211] text-white border border-white/10 relative overflow-hidden shadow-2xl">
          {/* Glowing particle mock background inside CTA */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(242,125,38,0.15),transparent_50%)]" />

          <div className="relative z-10 space-y-6 max-w-xl">
            <h2 className="text-3xl md:text-5xl font-sans font-bold leading-tight">
              Ready to meet your new AI coding partner?
            </h2>
            <p className="text-sm md:text-base text-white/75 leading-relaxed font-sans">
              To start saving your algorithmic solutions, building persistent habit scores, and personalizing your AI Companion conversations, you will need to sign up for an account. Create your free identity in seconds.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                onClick={() => onNavigate("auth")}
                className="px-6 py-3.5 rounded-full bg-white text-black font-bold text-xs hover:bg-[#FAF9F6] transition active:scale-95"
              >
                Sign Up & Register Free
              </button>
              <button
                onClick={() => onNavigate("contact")}
                className="px-6 py-3.5 rounded-full bg-white/10 text-white font-bold text-xs hover:bg-white/20 border border-white/10 transition"
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// -------------------------------------------------------------
// 2. FEATURES PAGE
// -------------------------------------------------------------
export function PageFeatures({ theme }: PageProps) {
  const isDark = theme === "dark";

  const featureSections = [
    {
      label: "AI INTEGRATION",
      title: "The Ultimate Coding Sandbox",
      desc: "Our interactive editor does more than execute code; it provides complete AST syntactic evaluations and micro-feedback. Write logic in standard languages and receive step-by-step guidance on structural logic, standard optimizations, and edge cases instantly.",
      badge: "Real-time Compilers",
      icon: Terminal,
      visual: (
        <div className={`rounded-xl border p-5 font-mono text-xs ${isDark ? "bg-neutral-950 border-neutral-850" : "bg-neutral-50 border-neutral-200"}`}>
          <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-neutral-500/10">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="opacity-40 text-[10px] pl-2">AST Parser Output</span>
          </div>
          <div className="space-y-2.5 text-[11px] leading-relaxed">
            <div className="text-[#F27D26]">{"{"} type: "Program", body: [ ... ] {"}"}</div>
            <div className="text-green-600 dark:text-green-400">✓ Syntax Validation Successful</div>
            <div className="text-amber-500">⚠️ Recommendation: Redundant variable bindings found in line 12.</div>
            <div className="text-[#F27D26]/70 opacity-80">{"// Optimization triggered automatically."}</div>
          </div>
        </div>
      ),
    },
    {
      label: "COMPANION ENGINE",
      title: "Thoughtful Companion Conversations",
      desc: "Engineering isn't just about syntax; it's also about visual decompressing and mindfulness. Slide into Companion Mode to reflect on stress, complete morning productivity checks, and decompress after standard daily workloads. A friendly, non-judgmental partner at every step.",
      badge: "Wellness Centered",
      icon: Heart,
      visual: (
        <div className={`rounded-xl border p-5 ${isDark ? "bg-neutral-950 border-neutral-850" : "bg-neutral-50 border-neutral-200"}`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#F27D26]/10 flex items-center justify-center">
              <Smile className="w-4 h-4 text-[#F27D26]" />
            </div>
            <div>
              <h4 className="text-xs font-bold leading-none">Mentra Companion</h4>
              <span className="text-[10px] opacity-50 block mt-0.5">Active Listener</span>
            </div>
          </div>
          <p className="text-xs leading-relaxed opacity-80 italic">
            "We finished our recursive problem set today. How about we shut the computer, take a deep breath, and log our daily win?"
          </p>
        </div>
      ),
    },
    {
      label: "ANALYTICS ENGINE",
      title: "Consistent Habit Loop Tracks",
      desc: "Establish your custom developer goals and secure daily coding milestones. Check your real-time practice stats, score specialized badges, and track your algorithmic growth curve over months using highly polished interactive dashboards.",
      badge: "Gamified Roadmaps",
      icon: Activity,
      visual: (
        <div className={`rounded-xl border p-5 ${isDark ? "bg-neutral-950 border-neutral-850" : "bg-neutral-50 border-neutral-200"}`}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-mono opacity-60">PRACTICE HISTOGRAM</span>
            <span className="text-xs font-bold text-green-500 font-mono">+420 XP</span>
          </div>
          <div className="flex items-end space-x-2 h-20 pt-2">
            {[30, 60, 45, 90, 100, 50, 75].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center space-y-1">
                <div
                  className="w-full bg-[#F27D26]/80 rounded-t-sm hover:bg-[#F27D26] transition"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[9px] font-mono opacity-40">D{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 space-y-32">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F27D26]">
          CORE CAPABILITIES
        </span>
        <h1 className="text-4xl md:text-6xl font-sans tracking-tight leading-tight font-bold text-[#1A1A1A] dark:text-white">
          The all-in-one developer workspace.
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Mentra combines highly detailed programming compilers, gamified algorithms, and supportive conversational channels inside a premium developer-first visual identity.
        </p>
      </div>

      {/* Alternating layout sections */}
      <div className="space-y-24">
        {featureSections.map((sect, idx) => {
          const Icon = sect.icon;
          return (
            <div
              key={idx}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
                idx % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={`lg:col-span-6 space-y-6 ${idx % 2 === 1 ? "lg:order-last" : ""}`}>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/10">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sect.label}</span>
                </div>

                <h2 className="text-2xl md:text-4xl font-sans font-bold leading-tight text-[#1A1A1A] dark:text-white">{sect.title}</h2>
                <p className="text-sm md:text-base opacity-70 leading-relaxed font-sans">{sect.desc}</p>

                <div className="flex items-center space-x-2 text-xs font-bold text-[#F27D26]">
                  <span className="px-2.5 py-1 rounded bg-[#F27D26]/10 text-[10px] font-mono uppercase font-black">
                    {sect.badge}
                  </span>
                  <span className="text-black/50 dark:text-white/50">Configured natively on the startup cluster</span>
                </div>
              </div>

              {/* Visual Demo Box */}
              <div className="lg:col-span-6 flex items-center justify-center">
                <div className="w-full max-w-md p-2.5 rounded-2xl border bg-neutral-100/40 dark:bg-neutral-900/40 border-neutral-500/10 shadow-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#F27D26]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">{sect.visual}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. PRACTICE PAGE (LeetCode meets GitHub!)
// -------------------------------------------------------------
// 3. PRACTICE PAGE (LeetCode meets GitHub!)
// -------------------------------------------------------------
export function PagePractice({ theme, onSelectChallenge }: PageProps) {
  const isDark = theme === "dark";
  const [activeDifficulty, setActiveDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 750);
    return () => clearTimeout(timer);
  }, [activeDifficulty]);

  const filteredChallenges = PRACTICE_CHALLENGES.filter((c) => {
    if (activeDifficulty === "All") return true;
    return c.difficulty === activeDifficulty;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 space-y-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-neutral-500/10">
        <div className="space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F27D26]">
            SOLVE AND LEARN
          </span>
          <h1 className="text-4xl font-sans tracking-tight font-bold text-[#1A1A1A] dark:text-white">Programming Sandbox</h1>
          <p className="text-sm opacity-70 max-w-xl font-sans">
            Sharpen your fundamentals with curated coding challenges. Select any card to load it directly into the sandbox editor to test your implementation.
          </p>
        </div>

        {/* Filters */}
        <div className="flex space-x-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-500/10">
          {(["All", "Easy", "Medium", "Hard"] as const).map((dif) => {
            const isSel = activeDifficulty === dif;
            return (
              <button
                key={dif}
                id={`difficulty-${dif}`}
                onClick={() => setActiveDifficulty(dif)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  isSel
                    ? isDark
                      ? "bg-[#F27D26] text-white"
                      : "bg-black text-white"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
              >
                {dif}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left list of challenges */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <ChallengeCardSkeleton key={idx} />
              ))
            ) : (
              filteredChallenges.map((chall) => {
                const diffColor =
                  chall.difficulty === "Easy"
                    ? "text-green-500 bg-green-500/10 border-green-500/20"
                    : chall.difficulty === "Medium"
                    ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
                    : "text-red-500 bg-red-500/10 border-red-500/20";

                return (
                  <div
                    key={chall.id}
                    className={`rounded-2xl border p-6 flex flex-col justify-between hover:border-[#F27D26]/40 transition-all duration-300 relative group ${
                      isDark ? "bg-neutral-900/60 border-neutral-800" : "bg-white border-neutral-200 shadow-sm"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${diffColor}`}>
                          {chall.difficulty}
                        </span>
                        <span className="text-[10px] font-mono opacity-50 flex items-center">
                          <Terminal className="w-3.5 h-3.5 mr-1 text-[#F27D26]" />
                          {chall.language.toUpperCase()}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold group-hover:text-[#F27D26] transition text-[#1A1A1A] dark:text-white">{chall.title}</h3>
                      <p className="text-xs opacity-75 leading-relaxed font-sans line-clamp-2">{chall.description}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-500/10 flex justify-between items-center">
                      <div className="text-[10px] font-mono opacity-60">
                        Points: <b className="font-bold text-[#F27D26]">{chall.points}</b>
                      </div>
                      <button
                        id={`load-challenge-${chall.id}`}
                        onClick={() => {
                          if (onSelectChallenge) {
                            onSelectChallenge(chall);
                          }
                          // Scroll to visual editor
                          const el = document.getElementById("interactive-showcase");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`px-3.5 py-1.5 rounded-full font-medium text-[11px] flex items-center space-x-1 transition duration-300 ${
                          isDark
                            ? "bg-[#F27D26] hover:bg-[#F27D26]/90 text-white"
                            : "bg-black hover:bg-neutral-800 text-white"
                        }`}
                      >
                        <span>Load into Editor</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right stats sidebar */}
        <div className="lg:col-span-4 space-y-6 font-sans">
          {isLoading ? (
            <>
              <SidebarBlockSkeleton />
              <LeaderboardSkeleton />
            </>
          ) : (
            <>
              {/* Streak details */}
              <div className={`p-6 rounded-2xl border ${isDark ? "bg-neutral-900/40 border-neutral-850" : "bg-neutral-50 border-neutral-200"}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider opacity-60">Daily Streaks</h3>
                  <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                </div>

                <div className="flex items-baseline space-x-1.5 mb-2">
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">12</span>
                  <span className="text-xs opacity-60">Days in a row</span>
                </div>

                <p className="text-xs opacity-70 leading-relaxed mb-4">
                  Your weekly activity score sits in the top **4%** of active startup engineers. Complete a problem today to lock your tier!
                </p>

                <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full" style={{ width: "84%" }} />
                </div>
              </div>

              {/* Leaderboard */}
              <div className={`p-6 rounded-2xl border ${isDark ? "bg-neutral-900/40 border-neutral-850" : "bg-neutral-50 border-neutral-200"}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider opacity-60">Startup Leaderboard</h3>
                  <Award className="w-4 h-4 text-yellow-500" />
                </div>

                <div className="space-y-3.5">
                  {[
                    { rank: 1, name: "Lucas Vance", points: 8400, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
                    { rank: 2, name: "Sophia Chen", points: 7920, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
                    { rank: 3, name: "Your Account", points: 6450, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", active: true },
                    { rank: 4, name: "Mia Thorne", points: 5100, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" },
                  ].map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        user.active ? "bg-[#F27D26]/10 border border-[#F27D26]/25 text-[#F27D26]" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-[11px] font-mono opacity-50 w-4">{user.rank}.</span>
                        <img src={user.avatar} referrerPolicy="no-referrer" alt={user.name} className="w-6 h-6 rounded-full" />
                        <span className="text-xs font-bold text-[#1A1A1A] dark:text-white">{user.name}</span>
                      </div>
                      <span className="text-xs font-mono font-black opacity-70">{user.points} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 4. COMPANION PAGE
// -------------------------------------------------------------
export function PageCompanion({ theme }: PageProps) {
  const isDark = theme === "dark";

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 space-y-24">
      {/* Editorial Header */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/10">
          <Heart className="w-3.5 h-3.5 text-[#F27D26] shrink-0" />
          <span>INTRODUCING COMPANION MODE</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-sans tracking-tight leading-tight font-bold text-[#1A1A1A] dark:text-white font-sans">
          Your friendly space to unwind.
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Technology can be incredibly taxing. Mentra features a fully integrated Companion channel focused purely on supportive listening, career planning, and stress reflection.
        </p>
      </div>

      {/* Grid capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
        {[
          {
            title: "Supportive Conversations",
            desc: "Mentra listens to your thoughts, deconstructs complicated feelings, and helps you reframe daily tasks in an encouraging, friendly way.",
            icon: Smile,
            color: "from-[#F27D26]/15 to-transparent",
          },
          {
            title: "Stress Reflection",
            desc: "Log details about intense meetings or coding dead-ends. Explore balanced ways to approach developer burnout constructively.",
            icon: Compass,
            color: "from-[#F27D26]/15 to-transparent",
          },
          {
            title: "Consistent Goals",
            desc: "Discuss long-term technological pathways, brainstorm innovative open-source ideas, or keep track of personal learning targets easily.",
            icon: Activity,
            color: "from-[#F27D26]/15 to-transparent",
          },
        ].map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className={`p-8 rounded-2xl border space-y-4 flex flex-col justify-between ${
                isDark ? "bg-neutral-900/40 border-neutral-850" : "bg-neutral-50 border-neutral-200"
              }`}
            >
              <div className="space-y-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${feat.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-[#F27D26]" />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A] dark:text-white">{feat.title}</h3>
                <p className="text-xs opacity-70 leading-relaxed font-sans">{feat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded interactive chat container directly targeting companion sandbox */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-white">Open the Companion Sandbox</h3>
          <p className="text-xs opacity-60 mt-1">Scroll back up to the visual proving grounds and select **Companion Chat** to write details directly.</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => {
              const el = document.getElementById("interactive-showcase");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className={`px-6 py-3 rounded-full font-medium text-xs flex items-center space-x-1.5 shadow-lg active:scale-95 transition duration-300 ${
              isDark
                ? "bg-[#F27D26] hover:bg-[#F27D26]/90 text-white"
                : "bg-black hover:bg-neutral-800 text-white"
            }`}
          >
            <span>Launch Chat Proving Grounds</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Explicit disclaimer notice */}
      <div className={`p-6 rounded-2xl border text-center max-w-2xl mx-auto space-y-2 ${
        isDark ? "bg-neutral-950/40 border-neutral-850" : "bg-neutral-50/50 border-neutral-200"
      }`}>
        <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 flex items-center justify-center">
          <Heart className="w-4 h-4 mr-1.5" />
          Wellness Boundary Notice
        </h4>
        <p className="text-[11px] opacity-70 leading-relaxed font-sans">
          Mentra Companion Mode is a conversational companion for software engineers and technology learners to unpack technical anxiety and decompress. It is **not** a replacement for professional healthcare, medical analysis, or psychiatric intervention. If you are experiencing serious mental health concerns, please consult qualified clinical professionals immediately.
        </p>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 5. ABOUT PAGE (Story, Mission, Timeline, Roadmap)
// -------------------------------------------------------------
export function PageAbout({ theme }: PageProps) {
  const isDark = theme === "dark";

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 space-y-24">
      {/* Heading */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F27D26]">
          WHO WE ARE
        </span>
        <h1 className="text-4xl md:text-5xl font-sans tracking-tight font-bold text-[#1A1A1A] dark:text-white">The Mentra Story</h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
          We believe technology education is too transactional. We are building a space where engineering growth and supportive conversation exist in harmony.
        </p>
      </div>

      {/* Philosophy Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-b border-neutral-500/10 py-16">
        <div className="space-y-4">
          <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest text-[#F27D26] font-bold">OUR PHILOSOPHY</span>
          <h2 className="text-2xl font-bold font-sans text-[#1A1A1A] dark:text-white">Developer-First Approach</h2>
          <p className="text-sm opacity-70 leading-relaxed font-sans">
            Every screen we outline, every compiler block we compile is targeted to make developers feel respected. We avoid unnecessary, overwhelming visual clusters, high-energy marketing hype, or cookie-cutter templates. Craftsmanship and high performance guide our engineering direction.
          </p>
        </div>

        <div className="space-y-4">
          <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest text-[#F27D26] font-bold">OUR PROMISE</span>
          <h2 className="text-2xl font-bold font-sans text-[#1A1A1A] dark:text-white">Learning-First Engineering</h2>
          <p className="text-sm opacity-70 leading-relaxed font-sans">
            We do not believe in copying code solutions blindly. Mentra focuses on teaching core architectural fundamentals, dynamic algorithmic pathways, and spatial estimation parameters. We aim to help developers think rather than copy.
          </p>
        </div>
      </div>

      {/* Interactive Beautiful Timeline */}
      <div className="space-y-12">
        <div className="text-center">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F27D26]">
            CHRONOLOGY
          </span>
          <h2 className="text-2xl font-bold mt-2 text-[#1A1A1A] dark:text-white">Historical Growth Tiers</h2>
        </div>

        <div className="relative max-w-3xl mx-auto pl-8 border-l border-[#F27D26]/20 space-y-12 py-4">
          {TIMELINE.map((item, idx) => (
            <div key={idx} className="relative">
              {/* Dot indicator */}
              <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full border-2 border-[#F27D26] bg-white dark:bg-neutral-950 flex items-center justify-center z-10" />

              <div className="space-y-2 font-sans">
                <span className="inline-block text-xs font-mono font-bold text-[#F27D26]">
                  {item.year}
                </span>
                <h3 className="text-lg font-bold text-[#1A1A1A] dark:text-white">{item.title}</h3>
                <p className="text-xs opacity-70 leading-relaxed max-w-2xl">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 6. BLOG PAGE
// -------------------------------------------------------------
export function PageBlog({ theme }: PageProps) {
  const isDark = theme === "dark";
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | "Engineering" | "AI" | "Learning" | "Culture">("All");

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 space-y-16">
      {/* Blog Heading */}
      <div className="space-y-4 max-w-xl">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F27D26]">
          STARTUP MEMOS
        </span>
        <h1 className="text-4xl font-sans font-bold text-[#1A1A1A] dark:text-white">Mentra Technical Journal</h1>
        <p className="text-sm opacity-70 leading-relaxed font-sans">
          Insights from the Mentra engineering cluster on AI development, compilation stacks, visual decompressing, and habit-formation loops.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-6 border-b border-neutral-500/10">
        {/* Categories */}
        <div className="flex flex-wrap gap-1.5">
          {(["All", "Engineering", "AI", "Learning", "Culture"] as const).map((cat) => (
            <button
              key={cat}
              id={`blog-category-${cat}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeCategory === cat
                  ? isDark
                    ? "bg-[#F27D26] text-white"
                    : "bg-black text-white"
                  : isDark
                    ? "bg-white/5 hover:bg-white/10 text-neutral-300"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64 flex items-center">
          <input
            id="blog-search-field"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search journal..."
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
              isDark
                ? "bg-neutral-950 border-neutral-850 text-white focus:ring-[#F27D26]/50"
                : "bg-white border-neutral-250 text-neutral-900 focus:ring-black/50"
            }`}
          />
          <Search className="w-3.5 h-3.5 opacity-40 absolute left-3 pointer-events-none" />
        </div>
      </div>

      {/* Featured / Articles List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className={`p-6 rounded-2xl border flex flex-col justify-between hover:border-[#F27D26]/40 transition-all duration-300 relative group ${
              isDark ? "bg-neutral-900/60 border-neutral-800" : "bg-white border-neutral-200 shadow-sm"
            }`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono opacity-50">
                <span className="font-bold text-[#F27D26]">{post.category.toUpperCase()}</span>
                <span>{post.date}</span>
              </div>

              <h3 className="text-lg font-bold group-hover:text-[#F27D26] transition line-clamp-2 leading-snug text-[#1A1A1A] dark:text-white">
                {post.title}
              </h3>
              <p className="text-xs opacity-75 leading-relaxed font-sans line-clamp-3">{post.summary}</p>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-500/10 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <img
                  src={post.author.avatar}
                  referrerPolicy="no-referrer"
                  alt={post.author.name}
                  className="w-7 h-7 rounded-full border border-[#F27D26]/10"
                />
                <div>
                  <h4 className="text-[10px] font-bold leading-none text-[#1A1A1A] dark:text-white">{post.author.name}</h4>
                  <span className="text-[9px] opacity-40 block mt-0.5">{post.author.role}</span>
                </div>
              </div>

              <span className="text-[9px] font-mono opacity-50">{post.readTime}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter signup */}
      <div className={`p-8 md:p-12 rounded-3xl border flex flex-col md:flex-row justify-between items-center gap-8 ${
        isDark ? "bg-neutral-950/40 border-neutral-850" : "bg-neutral-50 border-neutral-200"
      }`}>
        <div className="space-y-2 max-w-md text-center md:text-left">
          <h3 className="text-lg md:text-xl font-bold text-[#1A1A1A] dark:text-white">Join the Technical waitlist</h3>
          <p className="text-xs opacity-70">
            Sign up to receive monthly technical logs, advanced dynamic programming tutorials, and mental health checklists directly.
          </p>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <input
            id="newsletter-email-field"
            type="email"
            placeholder="Enter your email"
            className={`px-4 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 w-full sm:w-64 ${
              isDark
                ? "bg-neutral-950 border-neutral-800 text-white focus:ring-[#F27D26]/50"
                : "bg-white border-neutral-250 text-neutral-900 focus:ring-black/50"
            }`}
          />
          <button
            id="subscribe-newsletter"
            onClick={() => alert("Thank you for subscribing to the technical waitlist!")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition duration-300 ${
              isDark
                ? "bg-[#F27D26] hover:bg-[#F27D26]/90 text-white"
                : "bg-black hover:bg-neutral-800 text-white"
            }`}
          >
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 7. FAQ PAGE
// -------------------------------------------------------------
export function PageFAQ({ theme }: PageProps) {
  const isDark = theme === "dark";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-24 space-y-16 font-sans">
      <div className="text-center space-y-4">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F27D26]">
          COMMON QUERIES
        </span>
        <h1 className="text-3xl md:text-5xl font-sans tracking-tight font-bold text-[#1A1A1A] dark:text-white">Frequently Asked Questions</h1>
        <p className="text-sm opacity-70 max-w-xl mx-auto">
          Need details about security frameworks, learning loops, or mental boundaries? Here are our standard compiled responses.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-xl border transition-colors ${
                isOpen
                  ? isDark
                    ? "bg-neutral-900/40 border-[#F27D26]/20"
                    : "bg-neutral-50 border-[#F27D26]/20"
                  : isDark
                  ? "bg-neutral-900/20 border-neutral-850 hover:border-neutral-700"
                  : "bg-white border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <button
                id={`faq-toggle-${idx}`}
                onClick={() => toggleIndex(idx)}
                className="w-full px-6 py-5 text-left flex justify-between items-center"
              >
                <span className="text-sm font-bold opacity-90 leading-snug pr-4 text-[#1A1A1A] dark:text-white">{item.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#F27D26] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-neutral-500/10"
                  >
                    <div className="px-6 py-5 text-xs leading-relaxed opacity-75 font-normal">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 8. CONTACT PAGE
// -------------------------------------------------------------
export function PageContact({ theme }: PageProps) {
  const isDark = theme === "dark";
  const [formState, setFormState] = useState({ name: "", email: "", msg: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.email || !formState.msg) return;
    alert(`Thank you ${formState.name || "there"}, our tech leads will reach out within 12 hours!`);
    setFormState({ name: "", email: "", msg: "" });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 space-y-16">
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F27D26]">
          CONNECT
        </span>
        <h1 className="text-4xl font-sans tracking-tight font-bold text-[#1A1A1A] dark:text-white">Contact Mentra HQ</h1>
        <p className="text-sm opacity-70 leading-relaxed font-sans">
          Whether you want to coordinate enterprise licenses, seek partnerships, or coordinate research collaborations, drop our core cluster a message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
        {/* Left column: Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className={`p-8 rounded-3xl border space-y-5 ${
              isDark ? "bg-neutral-900/60 border-neutral-800" : "bg-white border-neutral-200 shadow-sm"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono opacity-50 uppercase tracking-widest text-[#F27D26] font-bold">Your Name</label>
                <input
                  id="contact-name-field"
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="e.g. Marcus Chen"
                  className={`w-full px-4 py-3 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                    isDark
                      ? "bg-neutral-950 border-neutral-800 text-white focus:ring-[#F27D26]/50"
                      : "bg-white border-neutral-250 text-neutral-900 focus:ring-black/50"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono opacity-50 uppercase tracking-widest text-[#F27D26] font-bold">Email Address</label>
                <input
                  id="contact-email-field"
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="e.g. marcus@vercel.com"
                  required
                  className={`w-full px-4 py-3 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                    isDark
                      ? "bg-neutral-950 border-neutral-800 text-white focus:ring-[#F27D26]/50"
                      : "bg-white border-neutral-250 text-neutral-900 focus:ring-black/50"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono opacity-50 uppercase tracking-widest text-[#F27D26] font-bold">Your Inquiry</label>
              <textarea
                id="contact-message-field"
                value={formState.msg}
                onChange={(e) => setFormState({ ...formState, msg: e.target.value })}
                placeholder="Detail what is on your mind..."
                required
                rows={5}
                className={`w-full px-4 py-3 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                  isDark
                    ? "bg-neutral-950 border-neutral-800 text-white focus:ring-[#F27D26]/50"
                    : "bg-white border-neutral-250 text-neutral-900 focus:ring-black/50"
                }`}
              />
            </div>

            <button
              id="submit-contact"
              type="submit"
              className={`px-6 py-3 rounded-full text-white font-bold text-xs flex items-center justify-center space-x-2 w-full transition active:scale-95 duration-300 ${
                isDark
                  ? "bg-[#F27D26] hover:bg-[#F27D26]/90 shadow-lg shadow-[#F27D26]/15"
                  : "bg-black hover:bg-neutral-800 shadow-lg shadow-black/15"
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>

        {/* Right column: Social / Info */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8 font-sans">
          {/* Social connections */}
          <div className={`p-6 rounded-2xl border ${isDark ? "bg-neutral-900/40 border-neutral-850" : "bg-neutral-50 border-neutral-200"}`}>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider opacity-60 mb-4">Core Hub Channels</h3>

            <div className="grid grid-cols-2 gap-3.5">
              {[
                { name: "GitHub", link: "https://github.com", icon: Github },
                { name: "LinkedIn", link: "https://linkedin.com", icon: Linkedin },
                { name: "X / Twitter", link: "https://x.com", icon: Twitter },
                { name: "Discord", link: "https://discord.com", icon: MessageSquare },
              ].map((channel, i) => {
                const Icon = channel.icon;
                return (
                  <a
                    key={i}
                    id={`contact-social-link-${channel.name}`}
                    href={channel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-xl border flex items-center space-x-2 text-xs font-bold transition ${
                      isDark
                        ? "bg-neutral-950 border-neutral-850 hover:bg-neutral-900 text-neutral-200"
                        : "bg-white border-neutral-200 hover:bg-neutral-100 text-neutral-800 shadow-xs"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#F27D26] shrink-0" />
                    <span>{channel.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Location details */}
          <div className={`p-6 rounded-2xl border flex-1 flex flex-col justify-between ${
            isDark ? "bg-neutral-900/40 border-neutral-850" : "bg-neutral-50 border-neutral-200"
          }`}>
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider opacity-60 mb-3 text-[#F27D26]">Our Coordinates</h3>
              <p className="text-sm font-bold opacity-80 leading-snug text-[#1A1A1A] dark:text-white">
                South of Market, <br />
                San Francisco, CA 94103
              </p>
              <p className="text-xs opacity-60 mt-2 font-mono">37.7749° N, 122.4194° W</p>
            </div>

            <div className="pt-6">
              {/* Minimalist modern dot matrix grid or abstract visual representing SF map */}
              <div className="h-28 rounded-xl bg-neutral-950 dark:bg-neutral-950 border border-neutral-800 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />
                <div className="relative z-10 text-center flex flex-col items-center">
                  <div className="w-3 h-3 bg-[#F27D26] rounded-full animate-ping absolute" />
                  <div className="w-3 h-3 bg-[#F27D26] rounded-full border-2 border-white z-10" />
                  <span className="text-[9px] font-mono text-[#F27D26] mt-2.5 tracking-widest font-bold">HQ CONFIRMED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 9. 404 PAGE
// -------------------------------------------------------------
export function Page404({ theme, onNavigate }: PageProps) {
  const isDark = theme === "dark";

  return (
    <div className="w-full max-w-lg mx-auto px-6 py-32 text-center space-y-8 font-sans">
      <div className="relative flex items-center justify-center">
        <span className="text-8xl md:text-9xl font-mono font-black text-[#F27D26]/10 dark:text-[#F27D26]/5 select-none tracking-tight">
          404
        </span>
        <Terminal className="w-12 h-12 text-[#F27D26] absolute" />
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold font-sans text-[#1A1A1A] dark:text-white">Index out of Bounds</h1>
        <p className="text-sm opacity-70 leading-relaxed font-sans">
          The structural path you requested has been cleaned by our memory manager. Please slide safely back to the home directory.
        </p>
      </div>

      <button
        id="back-home-button"
        onClick={() => onNavigate("home")}
        className={`px-6 py-3 rounded-full font-bold text-xs inline-flex items-center space-x-1.5 transition duration-300 ${
          isDark
            ? "bg-[#F27D26] hover:bg-[#F27D26]/90 text-white shadow-lg shadow-[#F27D26]/15"
            : "bg-black hover:bg-neutral-800 text-white shadow-lg shadow-black/15"
        }`}
      >
        <span>Back to Home</span>
      </button>
    </div>
  );
}
