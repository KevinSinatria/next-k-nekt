"use client";

import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  desc?: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({
  title,
  desc,
  value,
  icon,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 transition-all duration-300",
        // Light mode
        "bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100",
        // Dark mode
        "dark:bg-neutral-900/50 dark:border-neutral-800 dark:hover:border-neutral-700",
        className,
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {desc && (
            <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <p className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}
