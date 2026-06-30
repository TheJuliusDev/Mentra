/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Terminal, Github, Linkedin, Twitter, MessageSquare } from "lucide-react";

interface FooterProps {
  theme: "light" | "dark";
  onNavigate: (page: string) => void;
}

export default function Footer({ theme, onNavigate }: FooterProps) {
  const isDark = theme === "dark";

  const resourcesLinks = [
    { label: "Features", page: "features" },
    { label: "Practice", page: "practice" },
    { label: "Companion Mode", page: "companion" },
    { label: "About Story", page: "about" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", page: "faq" },
    { label: "Terms of Service", page: "faq" },
    { label: "Journal Hub", page: "blog" },
    { label: "Contact Us", page: "contact" },
  ];

  return (
    <footer
      id="app-footer"
      className={`border-t py-16 transition-colors duration-500 relative ${
        isDark
          ? "bg-[#121211] border-white/5 text-neutral-400"
          : "bg-[#FAF9F6] border-black/5 text-[#1A1A1A]/70"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left column info */}
        <div className="md:col-span-5 space-y-6">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? "bg-white" : "bg-black"}`}>
              <div className={`w-2.5 h-2.5 rotate-45 ${isDark ? "bg-[#121211]" : "bg-[#FAF9F6]"}`} />
            </div>
            <span className="font-sans text-lg font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white leading-none">
              Mentra
            </span>
          </div>

          <p className="text-xs leading-relaxed max-w-sm font-sans">
            Mentra is a premium software development and mindfulness sounding board platform designed for active developers, career changers, and computer science students.
          </p>

          <div className="flex space-x-2.5 pt-2">
            {[
              { icon: Github, href: "https://github.com" },
              { icon: Linkedin, href: "https://linkedin.com" },
              { icon: Twitter, href: "https://x.com" },
              { icon: MessageSquare, href: "https://discord.com" },
            ].map((soc, i) => {
              const Icon = soc.icon;
              return (
                <a
                  key={i}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full border transition ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-neutral-300"
                      : "bg-black/5 border-black/10 hover:bg-black/10 text-neutral-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Center column links */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white">
            Developer Space
          </h4>
          <ul className="space-y-2.5 text-xs font-sans">
            {resourcesLinks.map((link, idx) => (
              <li key={idx}>
                <button
                  onClick={() => onNavigate(link.page)}
                  className="hover:text-[#F27D26] hover:underline transition text-left"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column links */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white">
            Company & Trust
          </h4>
          <ul className="space-y-2.5 text-xs font-sans">
            {legalLinks.map((link, idx) => (
              <li key={idx}>
                <button
                  onClick={() => onNavigate(link.page)}
                  className="hover:text-[#F27D26] hover:underline transition text-left"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Editorial Trust Block & Micro Stats - Artistic Flair style */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-10 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40 dark:text-white/40 mb-3">
            Backed By
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2 grayscale opacity-50 dark:opacity-40">
            <span className="font-black text-xs tracking-tighter italic">FORGE VENTURES</span>
            <span className="font-black text-xs tracking-tighter">N-GRAPH</span>
            <span className="font-black text-xs tracking-tighter">SEQUEL_</span>
          </div>
        </div>

        <div className="flex items-center gap-8 md:gap-12">
          <div className="text-left md:text-right">
            <span className="block text-xl font-medium tracking-tight text-[#1A1A1A] dark:text-white font-serif italic">1.2M+</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]/40 dark:text-white/40">Daily Solves</span>
          </div>
          <div className="text-left md:text-right">
            <span className="block text-xl font-medium tracking-tight text-[#1A1A1A] dark:text-white font-serif italic">98.4%</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]/40 dark:text-white/40">Growth Rate</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
        <span>© {new Date().getFullYear()} Mentra Technologies, Inc. All rights reserved.</span>
        <div className="flex space-x-6">
          <span>SFO // CLOUD RUN NATIVE</span>
          <span>v2.5.0-BETA</span>
        </div>
      </div>
    </footer>
  );
}
