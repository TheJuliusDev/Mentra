/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Smartphone, 
  Home, 
  Code2, 
  Brain, 
  Trophy, 
  User, 
  Send, 
  Mic, 
  MicOff, 
  Wifi, 
  WifiOff, 
  Battery, 
  Signal, 
  Sparkles, 
  ChevronRight, 
  Check, 
  Play, 
  Award, 
  Flame, 
  Zap, 
  RotateCcw, 
  ArrowLeft, 
  Share2, 
  Bell, 
  Plus, 
  FileCode, 
  Trash, 
  Terminal,
  Volume2
} from "lucide-react";
import { Challenge, PRACTICE_CHALLENGES } from "../types";

interface MobileAppProps {
  theme: "light" | "dark";
  user: any;
}

export default function MobileApp({ theme, user }: MobileAppProps) {
  // Device simulator states
  const [deviceType, setDeviceType] = useState<"ios" | "android">("ios");
  const [currentTime, setCurrentTime] = useState("");
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isOffline, setIsOffline] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeScreen, setActiveScreen] = useState<"home" | "code" | "companion" | "leaderboard" | "profile">("home");

  // App state persistent locally
  const [userStreak, setUserStreak] = useState(3);
  const [completedToday, setCompletedToday] = useState(false);
  const [points, setPoints] = useState(380);

  // New Interactive/Visual States
  const [isHapticShake, setIsHapticShake] = useState(false);
  const [isHapticFlash, setIsHapticFlash] = useState(false);
  const [shareModalText, setShareModalText] = useState<string | null>(null);
  const [dailyTarget] = useState(500); // Daily XP target goal

  const triggerHaptic = (type: "shake" | "flash" | "both" = "both") => {
    if (type === "shake" || type === "both") {
      setIsHapticShake(true);
      setTimeout(() => setIsHapticShake(false), 250);
    }
    if (type === "flash" || type === "both") {
      setIsHapticFlash(true);
      setTimeout(() => setIsHapticFlash(false), 300);
    }
  };

  const handleOpenShare = (source: "profile" | "leaderboard") => {
    triggerHaptic("shake");
    let shareText = "";
    if (source === "profile") {
      shareText = `🏆 I'm level 4 on Mentra Mobile! My total points are ${points} XP, and I'm on a burning ${userStreak}-day coding streak! Solve engineering challenges with me on the go. 📱`;
    } else {
      shareText = `🔥 I just checked the Weekly Leaderboard on Mentra Mobile! I am currently ranked with ${points} XP and a ${userStreak}-day consistency streak. Can you beat my high score? 🚀`;
    }
    setShareModalText(shareText);
  };
  
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "model"; text: string; time: string }>>([
    {
      role: "model",
      text: "Hey! I'm Mentra, your pocket-sized programming companion. How was your coding day? Got a tricky bug to solve, or just want to decompress?",
      time: "8:00 PM"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatTyping, setIsChatTyping] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceWaveform, setVoiceWaveform] = useState<number[]>([]);
  
  // Code editor simulator states
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(PRACTICE_CHALLENGES[0]);
  const [mobileCode, setMobileCode] = useState(PRACTICE_CHALLENGES[0].starterCode);
  const [consoleLogs, setConsoleLogs] = useState<string[]>(["Mobile debugger online.", "Ready to run tests..."]);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [codeSuccess, setCodeSuccess] = useState<boolean | null>(null);
  
  // Custom interactive features
  const [activeNotification, setActiveNotification] = useState<{ title: string; body: string } | null>(null);
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Check daily algorithm goals", done: true },
    { id: 2, text: "Practice Reverse a String", done: false },
    { id: 3, text: "Empathetic check-in with Mentra", done: false },
  ]);

  // Audio waveform animation timer
  useEffect(() => {
    let interval: any;
    if (isVoiceRecording) {
      interval = setInterval(() => {
        setVoiceWaveform(Array.from({ length: 15 }, () => Math.floor(Math.random() * 24) + 4));
      }, 100);
    } else {
      setVoiceWaveform([]);
    }
    return () => clearInterval(interval);
  }, [isVoiceRecording]);

  // Handle device clock sync
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hrs = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, "0");
      const ampm = hrs >= 12 ? "PM" : "AM";
      hrs = hrs % 12;
      hrs = hrs ? hrs : 12; // 12-hour format
      setCurrentTime(`${hrs}:${mins} ${ampm}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync starter code when challenge changes
  useEffect(() => {
    if (selectedChallenge) {
      setMobileCode(selectedChallenge.starterCode);
      setConsoleLogs(["Environment re-initialized.", `Loaded: ${selectedChallenge.title}`]);
      setCodeSuccess(null);
    }
  }, [selectedChallenge]);

  // Trigger push notification simulation
  const triggerSimulatedNotification = () => {
    if (!notificationsEnabled) return;
    const notifications = [
      {
        title: "🔥 Streak At Risk!",
        body: "Your 3-day coding streak is calling. Solve a quick algorithm on the go!"
      },
      {
        title: "🧠 Empathetic Companion",
        body: "Hey developer, hope you are taking microbreaks. Click to chat and reflect."
      },
      {
        title: "💡 Daily Tech Tip",
        body: "JavaScript arrays reverse() in-place. Do you know its memory complexity?"
      }
    ];
    const picked = notifications[Math.floor(Math.random() * notifications.length)];
    setActiveNotification(picked);

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setActiveNotification(null);
    }, 6000);
  };

  // Chat request powered by real server /api/chat or local fallback if offline
  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || chatInput;
    if (!messageText.trim()) return;

    const userMsg = {
      role: "user" as const,
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatTyping(true);
    triggerHaptic("flash");

    if (isOffline) {
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            role: "model",
            text: "📶 [Offline Mode] I'm saved locally in cache! Since your cellular signal is off, I'm keeping your streak secure locally. Once you are back online, your chat history will sync to Mentra Cloud.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsChatTyping(false);
      }, 1200);
      return;
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map(m => ({
            role: m.role === "model" ? "assistant" : "user",
            content: m.text
          })),
          systemInstruction: "You are Mentra Mobile, a pocket-sized coding partner and empathetic companion for engineers. Your interface is a mobile app. Provide friendly, clear, high-contrast, text-only developer guidance. Keep replies under 100 words. Speak directly, warmly, and use occasional emojis."
        })
      });

      if (!response.ok) throw new Error("API call failed");
      const data = await response.json();
      
      setChatMessages(prev => [
        ...prev,
        {
          role: "model",
          text: data.text || "I'm right here with you in your coding journey!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (e) {
      console.error("Mobile AI Chat error, using user-friendly backup:", e);
      setChatMessages(prev => [
        ...prev,
        {
          role: "model",
          text: "That sounds like a great point. Keep focusing on writing modular code and testing corner cases! How else can I assist with your current project?",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsChatTyping(false);
    }
  };

  // Simulate Running Code in Pocket Sandbox
  const handleRunMobileCode = () => {
    if (!selectedChallenge) return;
    setIsRunningCode(true);
    setConsoleLogs(prev => [...prev, "Compiling TypeScript...", "Running tests against standard constraints..."]);
    triggerHaptic("both");
    
    setTimeout(() => {
      setIsRunningCode(false);
      const isSuccessful = Math.random() > 0.15; // Realistic compiler status
      setCodeSuccess(isSuccessful);
      
      if (isSuccessful) {
        setConsoleLogs(prev => [
          ...prev,
          "✓ Test Case 1: Passed (s = ['h','e','l','l','o'])",
          "✓ Test Case 2: Passed (Valid boundary constraints)",
          `🎉 Compilation successful! +${selectedChallenge.points} XP earned.`
        ]);
        setPoints(p => p + selectedChallenge.points);
        setCompletedToday(true);
        triggerHaptic("flash");
        // Mark corresponding checklist item
        setChecklist(list => list.map(item => item.id === 2 ? { ...item, done: true } : item));
      } else {
        setConsoleLogs(prev => [
          ...prev,
          "❌ Test Case 1 Failed: Memory limit exceeded or unhandled null character.",
          "💡 Tip: Verify loop initialization counters."
        ]);
        triggerHaptic("shake");
      }
    }, 1500);
  };

  // Toggle voice assistant recording
  const toggleVoiceRecording = () => {
    if (isVoiceRecording) {
      setIsVoiceRecording(false);
      // Generate simulated transcribed message
      const voicePrompts = [
        "How do I structure a dynamic stack in TypeScript?",
        "Help me stay motivated to code today",
        "Explain Row Level Security simply"
      ];
      const picked = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];
      setChatInput(picked);
    } else {
      setIsVoiceRecording(true);
    }
  };

  // Helper colors
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen py-10 px-4 flex flex-col items-center justify-center transition-colors duration-300 ${
      isDark ? "bg-[#121211] text-[#FAF9F6]" : "bg-[#FAF9F6] text-[#1A1A1A]"
    }`}>
      {/* Background decoration elements */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,rgba(128,128,128,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.06)_1px,transparent_1px)] [background-size:40px_40px] z-0" />
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side: Editorial Showcase & Explainer */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20">
            <Smartphone className="w-3.5 h-3.5 animate-pulse" />
            <span>Interactive Mobile Sandbox</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-extrabold font-sans tracking-tight leading-[1.1]">
            Mentra <br className="hidden lg:block" />
            <span className="text-[#F27D26]">Anywhere.</span>
          </h1>
          
          <p className="text-sm opacity-75 max-w-lg leading-relaxed mx-auto lg:mx-0">
            Learn algorithms, review architecture on the train, and complete daily code check-ins. Try the <strong>fully functional Mentra Mobile simulator</strong> on the right. Tap tabs, run compilation, or chat directly with the live Gemini engine.
          </p>

          {/* Features Checklist */}
          <div className="space-y-3 pt-2 text-left hidden sm:block max-w-md mx-auto lg:mx-0">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                <Check className="w-2.5 h-2.5" />
              </div>
              <p className="text-xs opacity-80">
                <strong>Real Server Integration:</strong> Chat is wired directly to the secure backend AI.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                <Check className="w-2.5 h-2.5" />
              </div>
              <p className="text-xs opacity-80">
                <strong>Pocket Compiler:</strong> Test algorithmic constraints on simulated test benches.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                <Check className="w-2.5 h-2.5" />
              </div>
              <p className="text-xs opacity-80">
                <strong>Empathy Core:</strong> Voice wav checks, push timers, and cellular toggles.
              </p>
            </div>
          </div>

          {/* Interactive controls for the Simulator */}
          <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-4 max-w-md mx-auto lg:mx-0">
            <h3 className="text-xs font-mono uppercase tracking-wider opacity-60 font-bold">Simulator Controls</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeviceType(prev => prev === "ios" ? "android" : "ios")}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition flex items-center justify-center gap-2 cursor-pointer ${
                  isDark ? "bg-white/5 border-white/10 hover:bg-white/10 text-neutral-300" : "bg-black/5 border-black/10 hover:bg-black/10 text-neutral-700"
                }`}
              >
                <span>Frame: {deviceType === "ios" ? "iPhone 15" : "Pixel 8"}</span>
              </button>

              <button
                onClick={triggerSimulatedNotification}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition flex items-center justify-center gap-2 cursor-pointer ${
                  isDark ? "bg-white/5 border-white/10 hover:bg-white/10 text-neutral-300" : "bg-black/5 border-black/10 hover:bg-black/10 text-neutral-700"
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Simulate Alert</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-dashed text-xs border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                {isOffline ? <WifiOff className="w-4 h-4 text-rose-500" /> : <Wifi className="w-4 h-4 text-emerald-500" />}
                <span>Signal Simulation:</span>
              </div>
              <button
                onClick={() => setIsOffline(!isOffline)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase cursor-pointer ${
                  isOffline ? "bg-rose-500 text-white" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}
              >
                {isOffline ? "Offline Active" : "Online"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: The Premium Mobile Frame Device */}
        <div className="lg:col-span-7 flex justify-center items-center">
          
          {/* Smart Phone Shell */}
          <motion.div
            animate={{
              x: isHapticShake ? [-4, 4, -4, 4, 0] : 0,
              borderColor: isHapticFlash 
                ? (deviceType === "ios" ? ["#1E1E1E", "#F27D26", "#1E1E1E"] : ["#2C2C2C", "#F27D26", "#2C2C2C"]) 
                : (deviceType === "ios" ? "#1E1E1E" : "#2C2C2C")
            }}
            transition={{
              x: { duration: 0.22 },
              borderColor: { duration: 0.28 }
            }}
            className={`w-[360px] h-[720px] shadow-2xl relative flex flex-col overflow-hidden transition-all duration-300 ${
              deviceType === "ios" 
                ? "rounded-[48px] border-[11px] outline outline-1 outline-neutral-400/20" 
                : "rounded-[36px] border-[10px] outline outline-1 outline-neutral-400/20"
            } ${isDark ? "bg-[#0C0C0B] text-neutral-100" : "bg-[#FAFAF9] text-neutral-900"}`}
          >
            
            {/* Dynamic Island / Camera punch hole */}
            {deviceType === "ios" ? (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-50 flex items-center justify-between px-3.5 pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-[#111] border border-neutral-900" />
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-4.5 h-4.5 bg-black rounded-full z-50 pointer-events-none flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#111]" />
              </div>
            )}

            {/* Live Status Bar (Top) */}
            <div className="h-11 px-6 flex items-center justify-between text-[11px] font-semibold tracking-wide select-none z-40 bg-transparent shrink-0">
              <span className="font-sans text-neutral-500 dark:text-neutral-400">{currentTime || "8:00 PM"}</span>
              <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                {isOffline ? <WifiOff className="w-3.5 h-3.5 text-rose-500" /> : <Wifi className="w-3.5 h-3.5" />}
                <Signal className="w-3 h-3" />
                <div className="flex items-center gap-0.5">
                  <Battery className="w-3.5 h-3.5 rotate-90 origin-center" />
                  <span className="text-[9px]">100%</span>
                </div>
              </div>
            </div>

            {/* PUSH NOTIFICATION SIMULATOR */}
            <AnimatePresence>
              {activeNotification && (
                <motion.div
                  initial={{ opacity: 0, y: -70, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -70, scale: 0.95 }}
                  onClick={() => {
                    // Navigate appropriately based on clicked message
                    if (activeNotification.title.includes("Streak") || activeNotification.title.includes("Tip")) {
                      setActiveScreen("code");
                    } else {
                      setActiveScreen("companion");
                    }
                    setActiveNotification(null);
                  }}
                  className="absolute top-12 left-3 right-3 p-3.5 rounded-2xl bg-black/90 backdrop-blur-md border border-neutral-800 text-white shadow-xl z-50 cursor-pointer flex gap-3 items-start"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F27D26] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold font-sans truncate">{activeNotification.title}</p>
                    <p className="text-[10px] text-neutral-300 leading-snug mt-0.5 line-clamp-2">{activeNotification.body}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* REAL-TIME SHARE OVERLAY SHEET */}
            <AnimatePresence>
              {shareModalText && (
                <motion.div
                  initial={{ opacity: 0, y: "100%" }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: "100%" }}
                  className="absolute inset-x-0 bottom-0 bg-neutral-50 dark:bg-neutral-950/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 p-5 rounded-t-[32px] z-50 shadow-2xl flex flex-col space-y-3.5 text-neutral-800 dark:text-neutral-100"
                >
                  {/* Pull Indicator bar */}
                  <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold font-mono text-[#F27D26] tracking-wider uppercase">Share Progress</span>
                    <button
                      onClick={() => setShareModalText(null)}
                      className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 uppercase cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[10.5px] leading-relaxed text-neutral-700 dark:text-neutral-300 font-medium font-sans select-all">
                    {shareModalText}
                  </div>

                  {/* Actions Row */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shareModalText);
                        triggerHaptic("flash");
                        alert("Progress copied to clipboard! 📋");
                      }}
                      className="py-2 rounded-xl bg-[#F27D26] hover:bg-[#F27D26]/90 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#F27D26]/10"
                    >
                      <Check className="w-4 h-4" />
                      <span>Copy Text</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        triggerHaptic("shake");
                        alert("Simulated share post successfully posted! 🚀");
                        setShareModalText(null);
                      }}
                      className="py-2 rounded-xl bg-neutral-200 dark:bg-white/10 hover:bg-neutral-300 dark:hover:bg-white/15 border border-black/5 dark:border-white/5 text-neutral-800 dark:text-neutral-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Social Post</span>
                    </button>
                  </div>

                  {/* Quick share shortcut icons */}
                  <div className="flex justify-around pt-1 text-[8.5px] text-neutral-500 dark:text-neutral-400">
                    <div 
                      onClick={() => { triggerHaptic("flash"); alert("MOCKED: Posting to Twitter/X..."); setShareModalText(null); }}
                      className="flex flex-col items-center gap-1 opacity-75 hover:opacity-100 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-black">X</div>
                      <span>Twitter / X</span>
                    </div>
                    <div 
                      onClick={() => { triggerHaptic("flash"); alert("MOCKED: Posting to LinkedIn..."); setShareModalText(null); }}
                      className="flex flex-col items-center gap-1 opacity-75 hover:opacity-100 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-black">in</div>
                      <span>LinkedIn</span>
                    </div>
                    <div 
                      onClick={() => { triggerHaptic("flash"); alert("MOCKED: Sharing on WhatsApp..."); setShareModalText(null); }}
                      className="flex flex-col items-center gap-1 opacity-75 hover:opacity-100 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-black">W</div>
                      <span>WhatsApp</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MAIN CONTAINER FOR ACTIVE MOBILE SCREEN */}
            <div className="flex-1 overflow-y-auto relative p-4 flex flex-col">
              
              {/* SCREEN 1: HOME */}
              {activeScreen === "home" && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="space-y-4 flex-1 pb-16"
                >
                  {/* Custom Mobile Header */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <h4 className="text-[10px] font-mono tracking-widest uppercase opacity-55">Daily Dashboard</h4>
                      <h2 className="text-xl font-extrabold font-sans leading-none mt-0.5">Welcome, Dev</h2>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                  </div>

                  {/* STREAK & XP CARD (Bento Grid Mini Style) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#F27D26]/10 to-transparent border border-[#F27D26]/15 flex flex-col justify-between h-24">
                      <div className="flex items-center justify-between">
                        <Flame className="w-5 h-5 text-[#F27D26] fill-[#F27D26]/10" />
                        <span className="text-[9px] font-mono opacity-50 uppercase font-bold">Streak</span>
                      </div>
                      <div>
                        <p className="text-2xl font-black font-sans leading-none">{userStreak} Days</p>
                        <p className="text-[9px] opacity-70 mt-1">{completedToday ? "✓ Checked in today" : "Keep it burning!"}</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col justify-between h-24">
                      <div className="flex items-center justify-between">
                        <Zap className="w-4.5 h-4.5 text-amber-500 fill-amber-500/10" />
                        <span className="text-[9px] font-mono opacity-50 uppercase font-bold">XP Points</span>
                      </div>
                      <div>
                        <p className="text-2xl font-black font-sans leading-none">{points}</p>
                        <p className="text-[9px] opacity-70 mt-1">Level 4 Alchemist</p>
                      </div>
                    </div>
                  </div>

                  {/* DAILY PROGRESS GOAL PROGRESS BAR */}
                  <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2.5 transition-colors duration-300">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200 font-sans">
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                        Daily Progress Goal
                      </span>
                      <span className="font-mono text-[10px] font-bold text-neutral-500 dark:text-neutral-400">
                        {points} / {dailyTarget} XP
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (points / dailyTarget) * 100)}%` }}
                        transition={{ type: "spring", stiffness: 80, damping: 15 }}
                        className="bg-gradient-to-r from-[#F27D26] to-amber-500 h-full rounded-full"
                      />
                    </div>
                    <div className="flex justify-between items-center text-[9px] opacity-65 font-sans">
                      <span>{points >= dailyTarget ? "🎉 Goal achieved! Master status unlocked." : `${dailyTarget - points} XP needed for daily goal`}</span>
                      <span className="font-semibold">{Math.round(Math.min(100, (points / dailyTarget) * 100))}%</span>
                    </div>
                  </div>

                  {/* DAILY RECOMMENDATION CARD */}
                  <div className="p-4 rounded-2xl bg-[#F27D26] text-white shadow-lg space-y-3 relative overflow-hidden">
                    {/* Background decor circles */}
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/5" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono bg-white/15 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Challenge of the Day
                      </span>
                      <span className="text-[10px] font-mono opacity-85 font-semibold">
                        +100 XP
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm font-sans tracking-tight">Reverse a String</h3>
                      <p className="text-[10px] opacity-85 leading-relaxed mt-1">
                        Implement a high-efficiency character reversal with zero extra buffer allocation.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 relative z-10">
                      <span className="text-[10px] font-mono bg-black/10 px-2 py-0.5 rounded border border-white/5">
                        Easy • TypeScript
                      </span>
                      <button
                        onClick={() => {
                          setSelectedChallenge(PRACTICE_CHALLENGES[0]);
                          setActiveScreen("code");
                        }}
                        className="bg-white text-black hover:bg-neutral-100 px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                      >
                        <Play className="w-2.5 h-2.5 fill-black" />
                        <span>Solve Now</span>
                      </button>
                    </div>
                  </div>

                  {/* COMPANION WIDGET CHECK-IN */}
                  <div 
                    onClick={() => setActiveScreen("companion")}
                    className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between cursor-pointer hover:opacity-95 active:scale-[0.99] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/15">
                        <Brain className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold font-sans">Empathetic Companion</h4>
                        <p className="text-[10px] opacity-65 mt-0.5">Reflect on burnout, goals, or code bugs</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </div>

                  {/* DAILY CHECKLIST */}
                  <div className="space-y-2 pt-1">
                    <h4 className="text-xs font-bold font-sans opacity-70">Daily Milestones</h4>
                    
                    <div className="space-y-1.5">
                      {checklist.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setChecklist(prev => prev.map(cl => cl.id === item.id ? { ...cl, done: !cl.done } : cl));
                          }}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-[11px] font-sans transition cursor-pointer ${
                            item.done 
                              ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-500 dark:text-emerald-400" 
                              : "bg-transparent border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5"
                          }`}
                        >
                          <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${
                            item.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-neutral-400 bg-transparent"
                          }`}>
                            {item.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className={item.done ? "line-through opacity-65" : "font-medium"}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SCREEN 2: PRACTICE CODE ENVIRONMENT */}
              {activeScreen === "code" && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="space-y-3.5 flex-1 pb-16 flex flex-col h-full"
                >
                  <div className="flex items-center justify-between pt-1 shrink-0">
                    <div>
                      <h4 className="text-[10px] font-mono tracking-widest uppercase opacity-55">Pocket Sandbox</h4>
                      <h2 className="text-base font-bold font-sans mt-0.5 leading-none">Code Practising</h2>
                    </div>
                    
                    {/* Selector of available challenges */}
                    <select
                      value={selectedChallenge?.id}
                      onChange={(e) => {
                        const target = PRACTICE_CHALLENGES.find(c => c.id === e.target.value);
                        if (target) setSelectedChallenge(target);
                      }}
                      className="px-2 py-1 rounded bg-neutral-200 dark:bg-white/10 border border-neutral-300 dark:border-neutral-800 text-[10px] font-mono max-w-[130px]"
                    >
                      {PRACTICE_CHALLENGES.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Challenge description display */}
                  <div className="p-3 rounded-xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-1.5 shrink-0 text-[10px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-800 dark:text-neutral-200">{selectedChallenge?.title}</span>
                      <span className="font-mono text-[9px] bg-[#F27D26]/10 text-[#F27D26] px-1.5 py-0.5 rounded font-bold uppercase">{selectedChallenge?.difficulty}</span>
                    </div>
                    <p className="opacity-75 leading-relaxed">{selectedChallenge?.description}</p>
                    <div className="text-[9px] font-mono opacity-50 italic">
                      Constraint: {selectedChallenge?.testCasePrompt}
                    </div>
                  </div>

                  {/* Code Editor Mock Area */}
                  <div className="flex-1 min-h-[160px] rounded-xl border border-black/10 dark:border-white/5 bg-[#0e0e0e] text-neutral-300 font-mono text-[10.5px] p-3 flex flex-col overflow-hidden relative">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-2 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-neutral-400">solution.ts</span>
                      </div>
                      <span className="text-[8px] tracking-wider text-neutral-500 uppercase">TS compiler v5.3</span>
                    </div>
                    
                    {/* Textarea simulation of Mobile Editor */}
                    <textarea
                      value={mobileCode}
                      onChange={(e) => setMobileCode(e.target.value)}
                      spellCheck="false"
                      className="flex-1 w-full bg-transparent border-0 focus:ring-0 p-0 resize-none outline-none font-mono text-[10.5px] leading-relaxed text-emerald-400/90 whitespace-pre"
                    />

                    {/* Preconfigured quick helper buttons to simulate typing */}
                    <div className="absolute bottom-2 left-2 right-2 flex gap-1 justify-end opacity-90">
                      <button
                        onClick={() => setMobileCode(prev => prev.replace("// Write your code here", "console.log('debug in-place');"))}
                        className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[8px] font-mono text-neutral-200 cursor-pointer"
                      >
                        + log()
                      </button>
                      <button
                        onClick={() => {
                          if (selectedChallenge) setMobileCode(selectedChallenge.starterCode);
                        }}
                        className="px-1.5 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-[8px] font-mono text-rose-300 flex items-center gap-0.5 cursor-pointer"
                      >
                        <RotateCcw className="w-2 h-2" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>

                  {/* Action buttons drawer */}
                  <div className="grid grid-cols-2 gap-2.5 shrink-0">
                    <button
                      onClick={() => {
                        setConsoleLogs(prev => [...prev, "Checking syntax rules...", "Checking static analysis rules... no errors found."]);
                        alert("Syntax review passed locally!");
                      }}
                      className={`py-2 rounded-xl text-[11px] font-semibold border transition cursor-pointer ${
                        isDark ? "bg-white/5 border-white/10 hover:bg-white/10 text-neutral-300" : "bg-black/5 border-black/10 hover:bg-black/5 text-neutral-700"
                      }`}
                    >
                      Analyze AST
                    </button>
                    
                    <button
                      onClick={handleRunMobileCode}
                      disabled={isRunningCode}
                      className="py-2 rounded-xl text-[11px] font-bold bg-[#F27D26] hover:bg-[#F27D26]/90 text-white flex items-center justify-center gap-1 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {isRunningCode ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Play className="w-3 h-3 fill-white" />
                      )}
                      <span>Run Pocket Tests</span>
                    </button>
                  </div>

                  {/* Compiler / Console Log Drawer (Bottom section) */}
                  <div className="h-28 rounded-xl border border-black/5 dark:border-white/5 bg-neutral-900 text-neutral-400 font-mono text-[9px] p-2.5 overflow-y-auto shrink-0 space-y-1">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1 opacity-55">
                      <span>DEBUG CONSOLE</span>
                      <span className={codeSuccess === true ? "text-emerald-400" : codeSuccess === false ? "text-rose-400" : ""}>
                        {codeSuccess === true ? "SUCCESS" : codeSuccess === false ? "FAILED" : "IDLE"}
                      </span>
                    </div>
                    {consoleLogs.map((log, idx) => (
                      <p key={idx} className={log.startsWith("✓") ? "text-emerald-400" : log.startsWith("❌") ? "text-rose-400" : ""}>
                        {log}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SCREEN 3: COMPANION CHAT MODE */}
              {activeScreen === "companion" && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="space-y-3.5 flex-1 pb-16 flex flex-col h-full overflow-hidden"
                >
                  {/* Chat top header with empathetic details */}
                  <div className="flex items-center justify-between pt-1 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#F27D26]/10 border border-[#F27D26]/20 flex items-center justify-center">
                        <Brain className="w-4.5 h-4.5 text-[#F27D26]" />
                      </div>
                      <div>
                        <h2 className="text-xs font-bold font-sans">Empathetic Companion</h2>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[9px] opacity-60">Pocket Mindset Partner</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setChatMessages([{
                          role: "model",
                          text: "Conversation thread cleared. Let's start fresh!",
                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }]);
                      }}
                      className="p-1.5 rounded bg-transparent hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-500 cursor-pointer"
                      title="Clear chat"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Messaging list with custom height and scroll */}
                  <div className="flex-1 overflow-y-auto px-1 space-y-3 pr-1 text-[11px] leading-relaxed">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col max-w-[82%] ${
                          msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                        }`}
                      >
                        <div className={`p-3 rounded-2xl ${
                          msg.role === "user"
                            ? "bg-[#F27D26] text-white rounded-br-none"
                            : isDark
                            ? "bg-white/5 border border-white/5 text-neutral-200 rounded-bl-none"
                            : "bg-neutral-100 border border-black/5 text-neutral-800 rounded-bl-none"
                        }`}>
                          <p>{msg.text}</p>
                        </div>
                        <span className="text-[8px] opacity-45 font-mono mt-1 px-1">{msg.time}</span>
                      </div>
                    ))}
                    
                    {isChatTyping && (
                      <div className="flex flex-col items-start mr-auto max-w-[80%]">
                        <div className={`p-3 rounded-2xl rounded-bl-none flex items-center gap-1.5 ${
                          isDark ? "bg-white/5 border border-white/5" : "bg-neutral-100 border border-black/5"
                        }`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-[#F27D26] animate-bounce [animation-delay:0.1s]" />
                          <div className="w-1.5 h-1.5 rounded-full bg-[#F27D26] animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1.5 h-1.5 rounded-full bg-[#F27D26] animate-bounce [animation-delay:0.3s]" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* VOICE INPUT SIMULATION AND RECOMMENDATION BUBBLES */}
                  <div className="space-y-2 shrink-0">
                    <div className="flex gap-1.5 overflow-x-auto pb-1 select-none whitespace-nowrap scrollbar-none text-[9px]">
                      <button
                        onClick={() => handleSendMessage("Feeling burnt out today. Hard to focus.")}
                        className={`px-2.5 py-1 rounded-full border transition cursor-pointer shrink-0 ${
                          isDark ? "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10" : "bg-black/5 border-black/10 text-neutral-700 hover:bg-black/10"
                        }`}
                      >
                        🧘 Burnout Check-in
                      </button>
                      <button
                        onClick={() => handleSendMessage("Give me a motivation check")}
                        className={`px-2.5 py-1 rounded-full border transition cursor-pointer shrink-0 ${
                          isDark ? "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10" : "bg-black/5 border-black/10 text-neutral-700 hover:bg-black/10"
                        }`}
                      >
                        🔥 Get Motivated
                      </button>
                      <button
                        onClick={() => handleSendMessage("Had a bad code review")}
                        className={`px-2.5 py-1 rounded-full border transition cursor-pointer shrink-0 ${
                          isDark ? "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10" : "bg-black/5 border-black/10 text-neutral-700 hover:bg-black/10"
                        }`}
                      >
                        💡 Reflect Review
                      </button>
                    </div>

                    {/* Microphone waveform feedback during recording */}
                    <AnimatePresence>
                      {isVoiceRecording && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 32 }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center justify-center gap-1 bg-red-500/10 border border-red-500/20 rounded-xl overflow-hidden"
                        >
                          <span className="text-[8px] font-mono font-bold text-rose-400 tracking-wider animate-pulse">RECORDING VOICE...</span>
                          <div className="flex items-center gap-0.5 h-5 px-3">
                            {voiceWaveform.map((h, i) => (
                              <div
                                key={i}
                                style={{ height: `${h}px` }}
                                className="w-0.5 bg-rose-500 rounded-full transition-all duration-100"
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Chat Text Input and Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleVoiceRecording}
                        className={`p-2.5 rounded-xl border shrink-0 transition cursor-pointer ${
                          isVoiceRecording 
                            ? "bg-rose-500 text-white border-rose-600 animate-pulse" 
                            : isDark
                            ? "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10"
                            : "bg-black/5 border-black/10 text-neutral-700 hover:bg-black/10"
                        }`}
                      >
                        {isVoiceRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      </button>

                      <div className="flex-1 relative flex items-center">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder={isVoiceRecording ? "Simulating transcription..." : "Send structured query..."}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSendMessage();
                          }}
                          className={`w-full py-2.5 pl-3.5 pr-10 rounded-xl text-xs outline-none border focus:ring-1 focus:ring-[#F27D26]/50 transition ${
                            isDark 
                              ? "bg-white/5 border-white/5 text-neutral-200 placeholder-neutral-500" 
                              : "bg-neutral-100 border-black/5 text-neutral-800 placeholder-neutral-500"
                          }`}
                        />
                        <button
                          onClick={() => handleSendMessage()}
                          className="absolute right-2 text-[#F27D26] hover:opacity-85 transition cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SCREEN 4: LEADERBOARD TROPHY */}
              {activeScreen === "leaderboard" && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="space-y-4 flex-1 pb-16 text-[11px]"
                >
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <h4 className="text-[10px] font-mono tracking-widest uppercase opacity-55">Global Rankings</h4>
                      <h2 className="text-base font-bold font-sans mt-0.5 leading-none">Weekly Leaderboard</h2>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenShare("leaderboard")}
                        className="p-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 text-neutral-600 dark:text-neutral-400 hover:text-[#F27D26] hover:border-[#F27D26]/20 transition flex items-center justify-center cursor-pointer"
                        title="Share your leaderboard standing"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <Trophy className="w-5 h-5 text-amber-500" />
                    </div>
                  </div>

                  {/* Leaderboard Ranks list */}
                  <div className="space-y-1.5">
                    {[
                      { rank: 1, name: "Sophia Chen", points: 2950, streak: 14, active: false, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
                      { rank: 2, name: "Marcus Vance", points: 2120, streak: 9, active: false, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
                      { rank: 3, name: "You (Developer)", points: points, streak: userStreak, active: true, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" },
                      { rank: 4, name: "Dr. Elena Rostova", points: 310, streak: 2, active: false, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" },
                    ].sort((a,b) => b.points - a.points).map((player, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                          player.active 
                            ? "bg-[#F27D26]/10 border-[#F27D26]/30 text-neutral-800 dark:text-neutral-100" 
                            : "bg-transparent border-black/5 dark:border-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-[10px] font-bold opacity-60 w-3">{idx + 1}</span>
                          <img
                            src={player.avatar}
                            alt={player.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full object-cover border border-neutral-400/20"
                          />
                          <div>
                            <p className="font-bold font-sans">{player.name}</p>
                            <p className="text-[9px] opacity-65 flex items-center gap-1 font-mono">
                              <Flame className="w-3 h-3 text-[#F27D26] fill-[#F27D26]/10" />
                              <span>{player.streak} day streak</span>
                            </p>
                          </div>
                        </div>

                        <span className="font-mono text-[10px] font-bold text-[#F27D26]">{player.points} XP</span>
                      </div>
                    ))}
                  </div>

                  {/* Achievements badges collection */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold font-sans opacity-70">Milestone Achievements</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-xl border border-black/5 dark:border-white/5 bg-neutral-100 dark:bg-white/5 flex flex-col items-center text-center space-y-1">
                        <Award className="w-6 h-6 text-yellow-500" />
                        <span className="font-bold text-[9px] font-sans leading-none">AST Master</span>
                        <span className="text-[7.5px] opacity-60 leading-tight">Solve designing challenges</span>
                      </div>

                      <div className="p-3 rounded-xl border border-black/5 dark:border-white/5 bg-neutral-100 dark:bg-white/5 flex flex-col items-center text-center space-y-1">
                        <Flame className="w-6 h-6 text-[#F27D26]" />
                        <span className="font-bold text-[9px] font-sans leading-none">Consistency King</span>
                        <span className="text-[7.5px] opacity-60 leading-tight">Active daily streaks</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SCREEN 5: PROFILE SETTINGS */}
              {activeScreen === "profile" && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="space-y-4 flex-1 pb-16 text-[11px]"
                >
                  <div className="flex items-center justify-between pt-1">
                    <h2 className="text-base font-bold font-sans leading-none">Pocket Profile</h2>
                    <User className="w-4.5 h-4.5 text-neutral-500" />
                  </div>

                  {/* User Profile Card */}
                  <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 text-center space-y-2">
                    <div className="relative w-16 h-16 mx-auto">
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
                        alt="Developer Profile"
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#F27D26]"
                      />
                      <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border border-white dark:border-neutral-900 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm font-sans">{user?.name || "Developer Expert"}</h3>
                      <p className="text-[9px] font-mono opacity-50 mt-0.5">{user?.email || "dev@mentra.com"}</p>
                    </div>

                    <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-around text-center">
                      <div>
                        <p className="text-base font-bold font-sans text-[#F27D26]">{points}</p>
                        <p className="text-[8px] opacity-55 font-mono uppercase">Total XP</p>
                      </div>
                      <div>
                        <p className="text-base font-bold font-sans text-[#F27D26]">{userStreak} Days</p>
                        <p className="text-[8px] opacity-55 font-mono uppercase">Streak</p>
                      </div>
                      <div>
                        <p className="text-base font-bold font-sans text-[#F27D26]">Level 4</p>
                        <p className="text-[8px] opacity-55 font-mono uppercase">Rank Tier</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-black/5 dark:border-white/5">
                      <button
                        onClick={() => handleOpenShare("profile")}
                        className="w-full py-2.5 rounded-xl bg-[#F27D26]/10 hover:bg-[#F27D26]/15 border border-[#F27D26]/20 hover:border-[#F27D26]/30 text-[#F27D26] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share Progress 📱</span>
                      </button>
                    </div>
                  </div>

                  {/* App Options list */}
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-mono tracking-wider opacity-60 font-bold uppercase mb-2">Application Preferences</h4>
                    
                    <div className="flex items-center justify-between p-2.5 bg-neutral-100/50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                      <span>Enable Mobile Alerts</span>
                      <input
                        type="checkbox"
                        checked={notificationsEnabled}
                        onChange={(e) => setNotificationsEnabled(e.target.checked)}
                        className="rounded accent-[#F27D26]"
                      />
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-neutral-100/50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                      <span>Live Device Clock Sync</span>
                      <span className="text-[9px] font-mono font-bold text-emerald-400">SYNCED</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-neutral-100/50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                      <span>Local Cache Storage</span>
                      <button
                        onClick={() => {
                          setPoints(380);
                          setUserStreak(3);
                          setCompletedToday(false);
                          setConsoleLogs(["Environment reset successfully."]);
                          alert("Local applet cache cleared.");
                        }}
                        className="text-[9px] text-rose-500 underline font-semibold cursor-pointer"
                      >
                        Reset Storage
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>

            {/* Native Tab Navigation Bar (Bottom) */}
            <div className={`h-16 border-t flex items-center justify-around px-2 py-1 select-none z-40 bg-opacity-95 backdrop-blur-md absolute bottom-0 left-0 right-0 shrink-0 transition-colors duration-300 ${
              isDark 
                ? "bg-[#0C0C0B] border-white/10" 
                : "bg-[#FAFAF9] border-black/10"
            }`}>
              
              <button 
                onClick={() => {
                  triggerHaptic("flash");
                  setActiveScreen("home");
                }}
                className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                  activeScreen === "home" ? "text-[#F27D26] font-bold" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-300"
                }`}
              >
                {activeScreen === "home" && (
                  <motion.div
                    layoutId="activeMobileTabBackground"
                    className="absolute inset-0 bg-[#F27D26]/10 dark:bg-[#F27D26]/20 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <Home className="w-5 h-5" />
                <span className="text-[8px] font-semibold mt-0.5">Home</span>
              </button>

              <button 
                onClick={() => {
                  triggerHaptic("flash");
                  setActiveScreen("code");
                }}
                className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                  activeScreen === "code" ? "text-[#F27D26] font-bold" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-300"
                }`}
              >
                {activeScreen === "code" && (
                  <motion.div
                    layoutId="activeMobileTabBackground"
                    className="absolute inset-0 bg-[#F27D26]/10 dark:bg-[#F27D26]/20 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <Code2 className="w-5 h-5" />
                <span className="text-[8px] font-semibold mt-0.5">Code</span>
              </button>

              <button 
                onClick={() => {
                  triggerHaptic("flash");
                  setActiveScreen("companion");
                }}
                className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                  activeScreen === "companion" ? "text-[#F27D26] font-bold" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-300"
                }`}
              >
                {activeScreen === "companion" && (
                  <motion.div
                    layoutId="activeMobileTabBackground"
                    className="absolute inset-0 bg-[#F27D26]/10 dark:bg-[#F27D26]/20 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <div className="relative">
                  <Brain className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#F27D26]" />
                </div>
                <span className="text-[8px] font-semibold mt-0.5">Companion</span>
              </button>

              <button 
                onClick={() => {
                  triggerHaptic("flash");
                  setActiveScreen("leaderboard");
                }}
                className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                  activeScreen === "leaderboard" ? "text-[#F27D26] font-bold" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-300"
                }`}
              >
                {activeScreen === "leaderboard" && (
                  <motion.div
                    layoutId="activeMobileTabBackground"
                    className="absolute inset-0 bg-[#F27D26]/10 dark:bg-[#F27D26]/20 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <Trophy className="w-5 h-5" />
                <span className="text-[8px] font-semibold mt-0.5">Trophy</span>
              </button>

              <button 
                onClick={() => {
                  triggerHaptic("flash");
                  setActiveScreen("profile");
                }}
                className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                  activeScreen === "profile" ? "text-[#F27D26] font-bold" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-300"
                }`}
              >
                {activeScreen === "profile" && (
                  <motion.div
                    layoutId="activeMobileTabBackground"
                    className="absolute inset-0 bg-[#F27D26]/10 dark:bg-[#F27D26]/20 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <User className="w-5 h-5" />
                <span className="text-[8px] font-semibold mt-0.5">Profile</span>
              </button>

            </div>

          </motion.div>

        </div>

      </div>
    </div>
  );
}
