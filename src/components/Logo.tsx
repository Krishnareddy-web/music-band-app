"use client";

import { useTheme } from "@/lib/ThemeContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Logo() {
    const { theme } = useTheme();

    return (
        <div className="flex items-center justify-center cursor-pointer select-none group">
            <motion.div
                className="relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Outer Traditional Border */}
                <svg viewBox="0 0 100 100" className="w-9 h-9 md:w-12 md:h-12 drop-shadow-2xl">
                    <defs>
                        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
                            <stop offset="50%" style={{ stopColor: '#FDB931', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#B8860B', stopOpacity: 1 }} />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Intricate Circular Border */}
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="url(#gold-grad)" strokeWidth="2" strokeDasharray="4 2" className="opacity-40" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="url(#gold-grad)" strokeWidth="1" />

                    {/* Traditional "DS" Monogram */}
                    <text
                        x="50%"
                        y="50%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fill="url(#gold-grad)"
                        className="font-serif font-black"
                        style={{
                            fontSize: '44px',
                            filter: theme === 'dark' ? 'url(#glow)' : 'none',
                            letterSpacing: '-2px'
                        }}
                    >
                        DS
                    </text>

                    {/* Decorative Dots */}
                    <circle cx="50" cy="8" r="1.5" fill="url(#gold-grad)" />
                    <circle cx="50" cy="92" r="1.5" fill="url(#gold-grad)" />
                    <circle cx="8" cy="50" r="1.5" fill="url(#gold-grad)" />
                    <circle cx="92" cy="50" r="1.5" fill="url(#gold-grad)" />
                </svg>

                {/* Ambient Glow */}
                <div className={cn(
                    "absolute inset-0 rounded-full blur-2xl transition-opacity duration-1000",
                    theme === "dark"
                        ? "bg-yellow-500/10 opacity-60"
                        : "bg-yellow-600/5 opacity-0"
                )} />
            </motion.div>
        </div>
    );
}

