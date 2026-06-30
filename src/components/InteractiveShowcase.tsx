/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  Code,
  LineChart,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  Terminal,
  Send,
  Loader2,
} from "lucide-react";

interface InteractiveShowcaseProps {
  theme: "light" | "dark";
}

export default function InteractiveShowcase({ theme }: InteractiveShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"editor" | "chat" | "dashboard">("editor");

  // Code editor states
  const [editorCode, setEditorCode] = useState(`// Mentra Coding Practice Environment
function findLongestSubstring(s: string): number {
  let maxLength = 0;
  let start = 0;
  const seen = new Map<string, number>();

  for (let end = 0; end < s.length; end++) {
    const char = s[end];
    if (seen.has(char)) {
      start = Math.max(start, seen.get(char)! + 1);
    }
    seen.set(char, end);
    maxLength = Math.max(maxLength, end - start + 1);
  }

  return maxLength;
}

// Test call
console.log(findLongestSubstring("abcabcbb")); // Expected: 3`);

  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  // Companion Chat states
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: "Hello! I am Mentra, your companion. Whether you want to discuss your career, practice dynamic programming, or simply talk about your day, I'm here. How are you feeling today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Trigger server-side code review (Fully Mock for Landing Page Sandbox)
  const handleRunReview = () => {
    setIsReviewing(true);
    setReviewResult(null);
    
    // Simulate compilation and AI processing
    setTimeout(() => {
      // Analyze current editorCode simple cues to give contextual mock reviews
      let complexity = "O(N) Linear Time";
      let suggestions = "* **Style:** Outstanding variable naming (\`maxLength\`, \`start\`, \`seen\`).\n* **Recommendation:** Consider adding an early-return guard: \`if (s.length <= 1) return s.length;\` to bypass redundant allocations.";
      
      if (editorCode.includes("for") && editorCode.includes("while")) {
        complexity = "O(N²) Quadratic Time";
        suggestions = "* **Performance Warning:** Nested loop bindings detected. If possible, optimize to a linear lookup using a sliding map index.\n* **Recommendation:** Ensure bounds are checked to avoid runtime callstack errors.";
      } else if (editorCode.includes("binary") || editorCode.includes("mid")) {
        complexity = "O(log N) Logarithmic Time";
        suggestions = "* **Style:** Perfect partitioning using middle indices.\n* **Recommendation:** Watch out for integer overflow when computing standard \`mid\` values under huge arrays.";
      }

      setReviewResult(`### 🔍 AI Code Review (Mock Proving Grounds)
* **Time Complexity:** ${complexity}
* **Space Complexity:** O(min(M, N)) auxiliary lookup
* **Parsing Safety:** ✓ Syntactic AST matches expected signature
${suggestions}

💡 **Workspace Alert:** To save this sandbox solution and track your daily score tier, click **Get Started** above to create a free account!`);
      setIsReviewing(false);
    }, 1200);
  };

  // Trigger server-side companion chat (Fully Mock for Landing Page Sandbox)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: "user" as const, text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    const currentInput = chatInput.toLowerCase();
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = "That's a wonderful thought. Remember that learning is a gradual process—every error you debug is building your software muscle! Let me know how else I can support you.";
      
      if (currentInput.includes("stress") || currentInput.includes("tired") || currentInput.includes("burn") || currentInput.includes("anxious") || currentInput.includes("exhaust")) {
        reply = "I completely understand. Developer fatigue is extremely real, and taking care of your wellness is just as critical as writing correct syntax. How about we close our eyes, take a slow deep breath, and log a simple win for today? I'm always here to chat.";
      } else if (currentInput.includes("help") || currentInput.includes("code") || currentInput.includes("bug") || currentInput.includes("exercise") || currentInput.includes("learn")) {
        reply = "That's why I'm here! Let's break down the logic: first map your inputs, specify your base boundaries, and code incrementally. Would you like to try a mini recursive exercise next, or explore system design concepts?";
      } else {
        reply = `I appreciate you sharing that. As your learning companion, I'm here to help you unpack tech obstacles and balance high-stress workloads. To unlock full persistent conversations and customize your AI Companion profile, click **Get Started** at the top right to sign up!`;
      }

      setChatMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      setIsTyping(false);
    }, 1000);
  };

  const isDark = theme === "dark";

  return (
    <div
      id="interactive-showcase"
      className={`w-full max-w-5xl mx-auto rounded-2xl border transition-colors duration-500 overflow-hidden shadow-2xl ${
        isDark
          ? "bg-neutral-900/80 border-neutral-800 backdrop-blur-md text-white"
          : "bg-white/95 border-neutral-200 backdrop-blur-md text-neutral-900"
      }`}
    >
      {/* Mock Window Topbar */}
      <div
        className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? "border-neutral-800 bg-neutral-950/60" : "border-neutral-100 bg-neutral-50/50"
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/85" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/85" />
            <div className="w-3 h-3 rounded-full bg-green-500/85" />
          </div>
          <span className="pl-3 font-mono text-xs opacity-50">mentra-interactive-sandbox v2.5</span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1">
          {[
            { id: "editor", label: "Interactive Editor", icon: Code },
            { id: "chat", label: "Companion Chat", icon: MessageSquare },
            { id: "dashboard", label: "Analytics Hub", icon: LineChart },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-button-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-4 py-2 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all duration-300 ${
                  isSelected
                    ? isDark
                      ? "text-[#F27D26] bg-white/5"
                      : "text-white bg-black"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                {isSelected && (
                  <motion.div
                    layoutId="active-showcase-tab"
                    className="absolute inset-0 rounded-lg border border-[#F27D26]/20 pointer-events-none"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Sandbox Area */}
      <div className="min-h-[500px] flex flex-col md:flex-row">
        <AnimatePresence mode="wait">
          {/* TAB 1: CODE EDITOR */}
          {activeTab === "editor" && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col md:flex-row"
            >
              {/* Left: Code Editor Input */}
              <div className="flex-1 p-6 flex flex-col border-r border-neutral-800/20 dark:border-neutral-800/60">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-60 flex items-center">
                    <Terminal className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                    TypeScript Editor
                  </span>
                  <div className="flex space-x-2">
                    <button
                      id="reset-code"
                      onClick={() =>
                        setEditorCode(`function findLongestSubstring(s: string): number {
  let maxLength = 0;
  let start = 0;
  const seen = new Map<string, number>();

  for (let end = 0; end < s.length; end++) {
    const char = s[end];
    if (seen.has(char)) {
      start = Math.max(start, seen.get(char)! + 1);
    }
    seen.set(char, end);
    maxLength = Math.max(maxLength, end - start + 1);
  }

  return maxLength;
}`)
                      }
                      title="Reset code"
                      className="p-1 rounded bg-neutral-500/10 hover:bg-neutral-500/20 transition text-xs opacity-60"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  id="sandbox-textarea"
                  value={editorCode}
                  onChange={(e) => setEditorCode(e.target.value)}
                  className={`flex-1 min-h-[300px] font-mono text-sm p-4 rounded-xl border focus:outline-none focus:ring-1 ${
                    isDark
                      ? "bg-neutral-950 border-neutral-850 text-white focus:ring-[#F27D26]/50"
                      : "bg-neutral-50 border-neutral-200 text-neutral-800 focus:ring-black/50"
                  }`}
                  spellCheck="false"
                />

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs opacity-50 font-mono">Output: Map-based sliding window</span>
                  <button
                    id="trigger-review"
                    onClick={handleRunReview}
                    disabled={isReviewing}
                    className={`px-5 py-2.5 rounded-xl font-medium text-xs flex items-center space-x-2 shadow-lg active:scale-95 transition-all ${
                      isDark
                        ? "bg-[#F27D26] hover:bg-[#F27D26]/90 text-white shadow-[#F27D26]/10"
                        : "bg-black hover:bg-[#1A1A1A]/90 text-white shadow-black/10"
                    }`}
                  >
                    {isReviewing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Run AI Review</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right: Code Evaluation & Comments */}
              <div
                className={`w-full md:w-80 p-6 flex flex-col justify-between ${
                  isDark ? "bg-neutral-950/40" : "bg-neutral-50/20"
                }`}
              >
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider opacity-60 mb-3 flex items-center">
                    <Award className="w-3.5 h-3.5 mr-1.5 text-yellow-500" />
                    AI Mentor Feedback
                  </h4>

                  {!reviewResult && !isReviewing && (
                    <div className="py-12 text-center">
                      <Code className="w-8 h-8 mx-auto mb-3 opacity-20 text-blue-500" />
                      <p className="text-xs opacity-60 max-w-[200px] mx-auto leading-relaxed">
                        Modify the editor code on the left and click **Run AI Review** to stream full complexity feedback.
                      </p>
                    </div>
                  )}

                  {isReviewing && (
                    <div className="space-y-3 py-6">
                      <div className="h-3 w-3/4 rounded bg-neutral-300 dark:bg-neutral-850 animate-pulse" />
                      <div className="h-3 w-5/6 rounded bg-neutral-300 dark:bg-neutral-850 animate-pulse" />
                      <div className="h-3 w-2/3 rounded bg-neutral-300 dark:bg-neutral-850 animate-pulse" />
                      <div className="h-3 w-1/2 rounded bg-neutral-300 dark:bg-neutral-850 animate-pulse" />
                    </div>
                  )}

                  {reviewResult && !isReviewing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs font-mono space-y-3 prose dark:prose-invert prose-xs"
                    >
                      <div className="p-3.5 rounded-lg border border-[#F27D26]/15 bg-[#F27D26]/5 text-[#F27D26] mb-2 font-sans flex items-start space-x-2">
                        <Sparkles className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                        <span>Evaluated by **Gemini AI Mock Sandbox Engine**. To unlock real live persistence and customized companion profiles, please register.</span>
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed opacity-90">{reviewResult}</div>
                    </motion.div>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-500/10 text-center font-sans">
                  <span className="text-[10px] opacity-40">Mentra compiler engine v1.4</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: COMPANION CHAT */}
          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col h-[500px]"
            >
              {/* Message Display */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col">
                {chatMessages.map((msg, idx) => {
                  const isAssistant = msg.role === "assistant";
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          isAssistant
                            ? isDark
                              ? "bg-neutral-800 text-neutral-100 rounded-bl-none"
                              : "bg-neutral-100 text-neutral-850 rounded-bl-none"
                            : isDark
                              ? "bg-[#F27D26] text-white rounded-br-none"
                              : "bg-[#F27D26] text-white rounded-br-none"
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                    </motion.div>
                  );
                })}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-neutral-100 dark:bg-neutral-850 rounded-2xl rounded-bl-none px-4 py-3 flex space-x-1.5 items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              {/* Message Form */}
              <form
                onSubmit={handleSendMessage}
                className={`p-4 border-t flex space-x-3 items-center ${
                  isDark ? "border-neutral-850 bg-neutral-950/30" : "border-neutral-150 bg-neutral-50/30"
                }`}
              >
                <input
                  id="chat-input-field"
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Share what is on your mind, or ask for dynamic programming exercises..."
                  className={`flex-1 px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-1 ${
                    isDark
                      ? "bg-neutral-950 border-neutral-800 text-white focus:ring-[#F27D26]/50"
                      : "bg-white border-neutral-250 text-neutral-900 focus:ring-black/50"
                  }`}
                />
                <button
                  id="submit-chat"
                  type="submit"
                  className={`p-3 rounded-xl flex items-center justify-center transition active:scale-95 shadow-lg ${
                    isDark
                      ? "bg-[#F27D26] hover:bg-[#F27D26]/90 text-white shadow-[#F27D26]/10"
                      : "bg-black hover:bg-[#1A1A1A]/90 text-white shadow-black/10"
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Psychological Disclaimer bar */}
              <div className="px-6 py-2.5 border-t border-neutral-500/10 flex justify-center text-center">
                <span className="text-[10px] opacity-40 leading-relaxed font-sans">
                  Companion Mode is designed for daily motivation and supportive developer sounding board chats. It is not a clinical replacement for professional counseling or medical care.
                </span>
              </div>
            </motion.div>
          )}

          {/* TAB 3: DASHBOARD */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Box 1: Streak */}
              <div
                className={`rounded-xl border p-5 flex flex-col justify-between ${
                  isDark ? "bg-neutral-950/40 border-neutral-850" : "bg-neutral-50/50 border-neutral-200"
                }`}
              >
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-60">Daily Streak</span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
                      12
                    </span>
                    <span className="text-sm opacity-60">Days Active</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-500/10">
                  <div className="flex space-x-1.5 justify-between">
                    {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                      <div key={index} className="flex flex-col items-center space-y-1">
                        <span className="text-[10px] opacity-50 font-mono">{day}</span>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                            index < 5
                              ? "bg-gradient-to-tr from-orange-500 to-amber-400 text-white"
                              : "bg-neutral-200 dark:bg-neutral-800 opacity-30"
                          }`}
                        >
                          {index < 5 ? "✓" : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] opacity-50 mt-3 text-center">
                    Keep up the afternoon practice to secure your bonus chest!
                  </p>
                </div>
              </div>

              {/* Box 2: Objectives Progress */}
              <div
                className={`rounded-xl border p-5 flex flex-col justify-between ${
                  isDark ? "bg-neutral-950/40 border-neutral-850" : "bg-neutral-50/50 border-neutral-200"
                }`}
              >
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-60">
                    Weekly Practice Goal
                  </span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-4xl font-bold text-[#F27D26]">80%</span>
                    <span className="text-sm opacity-60">Completed</span>
                  </div>
                </div>

                {/* Simulated circular progress or simple loading bar graphics */}
                <div className="mt-4 pt-3">
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="opacity-70">Algorithms Completed</span>
                        <span className="font-mono opacity-80">4 / 5</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div className="bg-[#F27D26] h-full rounded-full" style={{ width: "80%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="opacity-70">Companion Checkins</span>
                        <span className="font-mono opacity-80">3 / 3</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: "100%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 3: Mastered Skills */}
              <div
                className={`rounded-xl border p-5 flex flex-col justify-between ${
                  isDark ? "bg-neutral-950/40 border-neutral-850" : "bg-neutral-50/50 border-neutral-200"
                }`}
              >
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-60">Expert Badges</span>
                  <div className="flex space-x-2.5 mt-3">
                    <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold leading-none">Binary Search Master</h5>
                      <span className="text-[10px] opacity-50 block mt-1">Unlocked 2 days ago</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-500/10 space-y-2">
                  <div className="flex items-center space-x-2 text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    <span className="opacity-80">Sliding Window Patterns</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    <span className="opacity-80">Dynamic Programming Intro</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] opacity-50">
                    <div className="w-3.5 h-3.5 border border-dashed rounded-full" />
                    <span>Memory Allocation Mechanics (In Progress)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
