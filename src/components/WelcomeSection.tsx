"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";

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
    <>
      <section className="relative overflow-hidden py-10 px-8 md:py-12 border border-white/20 dark:border-gray-800 rounded-3xl shadow-lg transition-all bg-white/40 dark:bg-black/20 backdrop-blur-xl group">
        {/* Dynamic Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 via-white/20 to-emerald-50/50 dark:from-indigo-900/20 dark:via-gray-900/40 dark:to-emerald-900/20 opacity-100 transition-opacity duration-500" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />

        <div className="relative z-10 container mx-auto text-center flex flex-col items-center space-y-6">
          {/* Animated headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center gap-2"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-sm">
              {greeting}
              {userName ? (
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                  , {userName}
                </span>
              ) : (
                ""
              )}
            </h1>
          </motion.div>

          {/* Date & Time */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-1"
          >
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md shadow-sm">
              <span className="text-xs uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mr-2">
                {formattedDate}
              </span>
              <span className="w-1 h-3 border-r border-gray-300 dark:border-gray-600 mx-2"></span>
              <span className="text-sm font-mono font-semibold text-gray-700 dark:text-gray-200">
                {formattedTime}
              </span>
            </div>
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto text-base md:text-lg font-medium leading-relaxed"
          >
            Pantau aktivitas kedisiplinan dan perkembangan siswa secara
            real-time.
          </motion.p>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4"
          >
            <p className="italic text-sm text-gray-400 dark:text-gray-500 max-w-sm mx-auto">
              “{quote}”
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
