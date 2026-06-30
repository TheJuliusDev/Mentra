/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Challenge {
  id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  starterCode: string;
  language: string;
  testCasePrompt: string;
  durationMinutes: number;
  points: number;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: "Engineering" | "AI" | "Learning" | "Culture";
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  text: string;
  category: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// Static Data Store
export const PRACTICE_CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "Reverse a String",
    category: "Algorithms",
    difficulty: "Easy",
    description: "Write a function that reverses a string. The input string is given as an array of characters.",
    starterCode: `function reverseString(s: string[]): string[] {\n  // Write your code here\n  return s.reverse();\n}`,
    language: "typescript",
    testCasePrompt: "Implement it in-place with O(1) extra memory.",
    durationMinutes: 10,
    points: 100,
  },
  {
    id: "2",
    title: "Two Sum Problem",
    category: "Arrays",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    starterCode: `function twoSum(nums: number[], target: number): number[] {\n  // Write your code here\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement)!, i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
    language: "typescript",
    testCasePrompt: "Can you do this in O(N) time complexity?",
    durationMinutes: 15,
    points: 120,
  },
  {
    id: "3",
    title: "Valid Parentheses",
    category: "Stacks",
    difficulty: "Medium",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    starterCode: `function isValid(s: string): boolean {\n  // Write your code here\n  const stack: string[] = [];\n  const pairs: Record<string, string> = { ')': '(', '}': '{', ']': '[' };\n  for (const char of s) {\n    if (['(', '{', '['].includes(char)) {\n      stack.push(char);\n    } else {\n      if (stack.pop() !== pairs[char]) return false;\n    }\n  }\n  return stack.length === 0;\n}`,
    language: "typescript",
    testCasePrompt: "An empty string is also considered valid.",
    durationMinutes: 20,
    points: 250,
  },
  {
    id: "4",
    title: "LRU Cache Implementation",
    category: "Design",
    difficulty: "Hard",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    starterCode: `class LRUCache {\n  private capacity: number;\n  // Complete implementation...\n  constructor(capacity: number) {\n    this.capacity = capacity;\n  }\n\n  get(key: number): number {\n    return -1;\n  }\n\n  put(key: number, value: number): void {\n    // Implementation here\n  }\n}`,
    language: "typescript",
    testCasePrompt: "Both get and put operations should run in O(1) average time complexity.",
    durationMinutes: 45,
    points: 500,
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "The Architecture Behind Mentra: Building a Real-time AI Programming Partner",
    summary: "A deep dive into how we orchestrate server-side language models, AST parsing, and conversational memory streams to build a highly responsive companion.",
    content: "Building an AI that feels like a true programming companion requires more than a simple API wrapper. At Mentra, we've designed a hybrid architecture that balances immediate static syntax analysis with deep LLM evaluation. In this post, we explore how server-side streaming tokens are rendered with sub-50ms latency, the structure of our context pruning layers, and how we balance friendly conversational support with strict engineering problem-solving guidance.",
    category: "Engineering",
    author: {
      name: "Sophia Chen",
      role: "Lead Systems Engineer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
    date: "June 24, 2026",
    readTime: "8 min read",
    featured: true,
  },
  {
    id: "post-2",
    title: "Designing for Devs: Why Every AI Tool Needs an Editorial Approach to UI",
    summary: "Developers hate clutter. They love high-contrast, text-forward typography, and lightning-fast speeds. Here is our design system story.",
    content: "Silicon Valley is currently flooded with high-energy animated grids and oversized gradient badges. We decided to take a step back. Drawing inspiration from Swiss design, print editorial layouts, and high-contrast terminal environments, Mentra's UI emphasizes spacious grid alignments, crisp sans-serif headings, and JetBrains Mono monospace readouts. We walk through our journey of designing a developer interface that feels confident, minimal, and intensely product-focused.",
    category: "AI",
    author: {
      name: "Marcus Vance",
      role: "Head of Product Design",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    date: "June 15, 2026",
    readTime: "5 min read",
  },
  {
    id: "post-3",
    title: "Beyond Syntax: The Psychological Importance of an AI companion for Engineers",
    summary: "Software engineering is high-stress. We explain why a conversational companion mode acts as a powerful psychological buffer against developer burnout.",
    content: "It is easy to focus purely on coding velocity, but burnout is a massive challenge in tech. Companion Mode was created to tackle this head-on. By offering supportive, pressure-free daily check-ins, motivation prompts, and stress-reflection prompts, Mentra acts as a mental workspace buffer. We emphasize that while Companion Mode is purely a conversational companion and never a replacement for clinical care, it serves as an invaluable daily soundboard.",
    category: "Learning",
    author: {
      name: "Dr. Elena Rostova",
      role: "Cognitive Scientist & Advisor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    },
    date: "June 08, 2026",
    readTime: "6 min read",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "John William",
    role: "Student",
    company: "Federal University of Technology Akure",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
    text: "Mentra completely replaced LeetCode and generic chat apps for me. Having a structured coding environment that provides contextual code reviews rather than just copy-paste answers has skyrocketed my learning curve.",
    category: "Student",
  },
  {
    id: "test-2",
    name: "James Daniel",
    role: "CEO",
    company: "Manis",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    text: "The sheer visual polish of the Mentra platform is inspiring. It gets out of my way, looks stunningly minimal, and the companion conversations in the evening help me unwind, reflect on my progress, and shut my laptop with a positive mindset.",
    category: "Frontend",
  },
  {
    id: "test-3",
    name: "David Matthew",
    role: "Backend developer",
    company: "",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    text: "As a backend dev, I appreciated the architectural integrity of Mentra. It is incredibly fast. The AI hints are remarkably precise, focusing on spatial and time complexities instead of spoonfeeding solution files.",
    category: "Backend",
  },
  {
    id: "test-4",
    name: "Phillip Davis",
    role: "Full-stack developer",
    company: "",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    text: "Switching careers into tech is intensely intimidating. Mentra provides that constant, encouraging, non-judgmental mentor that keeps me accountable. It is like having a companion and a principal engineer in my corner.",
    category: "Self-taught",
  },
];

export const TIMELINE: TimelineItem[] = [
  {
    year: "Q1 2025",
    title: "The Spark of Mentra",
    description: "Founded by a small group of open-source developers frustrated by standard, repetitive chatbot interfaces. We wanted a tool that could code AND converse naturally.",
  },
  {
    year: "Q3 2025",
    title: "Neural Sandbox & Interactive Editor",
    description: "Built our core offline-first code execution simulator and compiled AST evaluators. Standardized deep structural feedback systems.",
  },
  {
    year: "Q1 2026",
    title: "Introducing Companion Mode",
    description: "Pioneered the 'thoughtful conversation companion' layout. Designed to provide motivational structures and active listening for tech-workers in high-stress roles.",
  },
  {
    year: "Q3 2026",
    title: "Global Launch & Series A Funding",
    description: "Preparing to onboard 250,000 developers from our waitlist, with support from leading open-source startup investors.",
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Is Mentra a replacement for developer documentation or standard IDEs?",
    answer: "Absolutely not. Mentra acts as a collaborative partner. It sits beside your existing stack to accelerate your technological learning, challenge your algorithmic limits with daily coding problems, and offer a conversational sounding board when you need to brainstorm, decompress, or check in on your career goals.",
  },
  {
    question: "How does the AI Companion mode differ from a generic coding assistant?",
    answer: "Generic assistants are purely transaction-based: you ask for a function, they output code. Mentra's Companion mode is designed with professional developer workflows and mental health in mind. It switches into an empathetic, active-listening companion that discusses daily goals, provides motivation, checks in on stress, and helps engineers build consistent, healthy, long-term learning habits.",
  },
  {
    question: "Does Mentra run code locally or in the cloud?",
    answer: "Mentra leverages a hybrid system. Code execution checks are simulated on our high-efficiency client-side virtual sandbox, while deep, context-aware architectural reviews and complex hints are securely powered server-side by our fine-tuned Gemini models, keeping your secrets perfectly secure.",
  },
  {
    question: "Can I use Mentra for team collaboration or interview prep?",
    answer: "Yes! Mentra includes difficulty tiers, full interactive challenge environments, daily developer streaks, and leaderboards designed explicitly for interview readiness, curriculum tracking, and technical challenge sharing.",
  },
  {
    question: "What is Mentra's policy on user privacy and data security?",
    answer: "Your privacy is our core engineering guideline. We never train models on your proprietary codebase. All conversational memory streams and code review histories are kept private, secure, and under full user control, adhering strictly to enterprise-grade data handling standards.",
  },
];
