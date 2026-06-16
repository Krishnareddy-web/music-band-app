"use client";


import Navigation from "@/components/Navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/ThemeContext";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function Home() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleBooking = () => {
    router.push("/book-band");
  };

  return (
    <main className={cn(
      "relative min-h-screen flex flex-col items-center justify-center transition-colors duration-500 overflow-hidden",
      mounted && theme === "dark" ? "bg-transparent text-white" : "bg-white text-black"
    )}>

      <Navigation />

      <div className="relative z-10 flex flex-col items-center text-center space-y-10 px-4 max-w-7xl mt-20">
        <h1 className={cn(
          "text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter transition-all duration-700 uppercase leading-[0.9]",
          theme === "dark"
            ? "text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.5)] drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]"
            : "text-black drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)]"
        )}>
          DAPPU SRINU
          <span className={cn(
            "block text-4xl md:text-6xl lg:text-7xl mt-4 transition-colors",
            theme === "dark" ? "text-white/60" : "text-black/50"
          )}>
            AYYAPPA
          </span>
        </h1>
        <p className={cn(
          "text-xl md:text-3xl max-w-3xl font-bold tracking-wide leading-relaxed transition-colors mt-8",
          theme === "dark" ? "text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]" : "text-gray-800"
        )}>
          {t.home.subtitle}
        </p>

        <button
          onClick={handleBooking}
          className={cn(
            "px-10 py-5 rounded-full font-bold transition-all tracking-widest uppercase text-lg border-2 shadow-2xl mt-10 hover:scale-105 active:scale-95",
            theme === "dark"
              ? "bg-white text-black hover:bg-gray-100 border-transparent"
              : "bg-black text-white hover:bg-gray-900 border-transparent shadow-black/20"
          )}
        >
          {t.home.bookBtn}
        </button>
      </div>

      <footer className={cn(
        "absolute bottom-4 text-xs font-mono z-10 transition-colors duration-500",
        theme === "dark" ? "text-gray-600" : "text-gray-400"
      )}>
        &copy; 2026 Devotional Band. All rights reserved.
      </footer>
    </main>
  );
}
