import React from "react";
import { motion } from "motion/react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rect" | "circle";
  animated?: boolean;
}

export default function Skeleton({ className = "", variant = "rect", animated = true }: SkeletonProps) {
  const baseClasses = "bg-neutral-200 dark:bg-neutral-800/80";
  
  const variantClasses = 
    variant === "circle" 
      ? "rounded-full" 
      : variant === "text" 
      ? "rounded h-3.5 w-full" 
      : "rounded-2xl";

  const pulseAnimation = animated ? {
    opacity: [0.5, 0.9, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  } : undefined;

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses} ${className}`}
      animate={pulseAnimation}
    />
  );
}

// Higher-level compound Skeleton layout templates for easy reusability
export function ChallengeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900/60 shadow-sm flex flex-col justify-between h-[210px]">
      <div className="space-y-4">
        {/* Category & Language Header */}
        <div className="flex justify-between items-center">
          <Skeleton className="w-16 h-5 rounded" />
          <Skeleton className="w-14 h-4 rounded" />
        </div>
        
        {/* Title */}
        <Skeleton className="w-3/4 h-6" />
        
        {/* Description body lines */}
        <div className="space-y-2">
          <Skeleton className="w-full h-3" />
          <Skeleton className="w-5/6 h-3" />
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-6 pt-4 border-t border-neutral-500/10 flex justify-between items-center">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-28 h-7 rounded-full" />
      </div>
    </div>
  );
}

export function SidebarBlockSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-4">
      {/* Sidebar Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="w-28 h-4" />
        <Skeleton className="w-5 h-5 rounded-full" />
      </div>

      {/* Main big numbers or bars */}
      <div className="space-y-2">
        <Skeleton className="w-16 h-10" />
        <Skeleton className="w-24 h-4" />
      </div>

      {/* Small body */}
      <div className="space-y-1.5">
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-4/5 h-3" />
      </div>

      {/* Progress line */}
      <Skeleton className="w-full h-2 rounded-full" />
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="w-36 h-4" />
        <Skeleton className="w-4 h-4 rounded-full" />
      </div>

      {/* List items */}
      <div className="space-y-3.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="w-8 h-8 rounded-full" variant="circle" />
              <Skeleton className="w-24 h-4" />
            </div>
            <Skeleton className="w-12 h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
