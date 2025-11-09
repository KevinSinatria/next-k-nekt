"use client";

import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  desc?: string;
  value: string | number;
}

export function StatsCard({ title, desc, value }: StatsCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 transition-all duration-300",
        // Light mode
        "bg-white border border-gray-200 shadow-sm hover:shadow-md",
        // Dark mode
        "dark:bg-gradient-to-br dark:from-neutral-900 dark:to-neutral-800 dark:border-neutral-800"
      )}
    >
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-blue-50000 to-sky-600" />

      <div className="space-y-1 mt-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </h3>
        {desc && (
          <p className="text-xs text-muted-foreground">{desc}</p>
        )}
        <p className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
