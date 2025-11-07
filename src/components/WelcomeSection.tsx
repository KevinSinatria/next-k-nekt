"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function WelcomeSection({ userName }: { userName?: string }) {
  const [time, setTime] = useState(new Date());
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format jam & tanggal
  const formattedTime = time.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const formattedDate = time.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Greeting dinamis
  const hour = time.getHours();
  let greeting = "Selamat Datang";
  if (hour >= 5 && hour < 11) greeting = "Selamat Pagi";
  else if (hour >= 11 && hour < 15) greeting = "Selamat Siang";
  else if (hour >= 15 && hour < 18) greeting = "Selamat Sore";
  else greeting = "Selamat Malam";

  // Optional quote inspiratif
  const quotes = [
    "Disiplin adalah jembatan antara tujuan dan pencapaian.",
    "Langkah kecil hari ini menentukan arah besar esok.",
    "Karakter baik lahir dari kebiasaan baik.",
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  useEffect(() => {
    setQuote(randomQuote);
  }, []);

  return (
    <section className="relative overflow-hidden py-8 px-8 md:py-10 border rounded-2xl shadow-sm hover:shadow-lg transition-all bg-background/60 backdrop-blur-sm">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 via-transparent to-emerald-400/20 dark:from-gray-700 dark:to-gray-700 blur-3xl" />

      <div className="relative z-10 container mx-auto text-center space-y-6">
        {/* Animated headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={cn(
            "text-2xl md:text-4xl font-bold tracking-tight",
            "bg-clip-text pb-2 text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-slate-200 dark:via-purple-200 dark:to-pink-200"
          )}
        >
          {greeting}
          {userName ? `, ${userName}` : ""} ✨
        </motion.h1>

        {/* Date & Time */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center justify-center space-y-1"
        >
          <span className="text-sm text-muted-foreground dark:text-gray-100">{formattedDate}</span>
          <span className="text-2xl md:text-3xl font-semibold tracking-widest dark:text-gray-100">
            {formattedTime}
          </span>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base dark:text-gray-100"
        >
          Pantau data kedisiplinan, pelanggaran, dan aktivitas siswa dengan
          visualisasi yang elegan dan real-time.
        </motion.p>

        {/* Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="italic text-sm text-muted-foreground max-w-md mx-auto dark:text-gray-200"
        >
          “{quote}”
        </motion.p>
      </div>
    </section>
  );
}
