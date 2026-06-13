"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/ThemeContext";

export default function DevotionalBell({ className }: { className?: string }) {
    const [isRinging, setIsRinging] = useState(false);
    const { theme, toggleTheme } = useTheme();
    // Using your custom ghanta sound from public/assets
    const BELL_SOUND = "/assets/ghanta.mp3";

    const ringBell = () => {
        if (isRinging) return; // Prevent spamming

        setIsRinging(true);
        toggleTheme();

        const audio = new Audio(BELL_SOUND);
        audio.volume = 1.0;
        audio.play().catch(e => console.log("Audio play failed:", e));

        // Reset ringing state after sound has time to resonate
        setTimeout(() => setIsRinging(false), 1500);
    };

    return (
        <button
            onClick={ringBell}
            className={cn(
                "relative group p-2 rounded-full transition-all border shrink-0 w-10 h-10 flex items-center justify-center",
                theme === "dark"
                    ? "bg-white/5 hover:bg-white/15 border-white/10"
                    : "bg-black/5 hover:bg-black/15 border-black/10",
                className
            )}
            aria-label="Toggle Theme & Ring Bell"
        >
            <motion.div
                animate={isRinging ? {
                    rotate: [0, -20, 20, -15, 15, 0],
                    scale: [1, 1.2, 1]
                } : { rotate: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            >
                <Bell className={cn(
                    "w-6 h-6 transition-colors",
                    theme === "dark" ? "text-white" : "text-black",
                    isRinging && "text-yellow-400 fill-yellow-400"
                )} />
            </motion.div>

            <span className="sr-only">Ring Bell</span>
        </button>
    );
}
