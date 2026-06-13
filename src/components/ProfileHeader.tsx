"use client";

import { ShieldCheck } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
    userName: string;
}

export default function ProfileHeader({ userName }: ProfileHeaderProps) {
    const { theme } = useTheme();
    const { t } = useLanguage();

    return (
        <header className={cn(
            "flex flex-col md:flex-row md:items-center justify-between gap-10 p-8 md:p-14 rounded-[3rem] border backdrop-blur-xl relative overflow-hidden group transition-all duration-700",
            theme === "dark"
                ? "bg-white/[0.03] border-white/10 shadow-[0_0_60px_-15px_rgba(255,255,255,0.05)]"
                : "bg-black/[0.02] border-black/5 shadow-[0_0_60px_-15px_rgba(0,0,0,0.02)]"
        )}>
            {/* Animated Background Pulse */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/10 blur-[120px] -mr-40 -mt-40 rounded-full group-hover:bg-yellow-500/20 transition-all duration-1000 animate-pulse" />

            <div className="relative z-10 space-y-5 text-left flex-1">
                <h1 className={cn(
                    "text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight leading-[1.1] md:leading-[1.05]",
                    theme === "dark" ? "text-white" : "text-black"
                )}>
                    {t.profile.welcome}, <span className="text-yellow-500">{userName}</span>
                </h1>
                <p className={cn(
                    "text-sm md:text-base lg:text-lg font-medium tracking-wide opacity-50 max-w-2xl leading-relaxed",
                    theme === "dark" ? "text-gray-400" : "text-black/60"
                )}>
                    {t.profile.subtitle}
                </p>
            </div>

            <div className={cn(
                "relative z-10 flex items-center gap-5 px-8 py-5 rounded-3xl border transition-all duration-500 hover:scale-[1.02] self-start md:self-center shrink-0",
                theme === "dark"
                    ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
                    : "bg-black/5 border-black/5 hover:bg-black/10 hover:border-black/20"
            )}>
                <div className="p-3 bg-yellow-500/10 rounded-2xl shadow-inner">
                    <ShieldCheck className="w-6 h-6 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
                </div>
                <div className="flex flex-col">
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.3em] mb-0.5",
                        theme === "dark" ? "text-gray-500" : "text-black/30"
                    )}>{t.profile.status}</span>
                    <span className={cn(
                        "text-xs font-black uppercase tracking-widest",
                        theme === "dark" ? "text-white" : "text-black"
                    )}>{t.profile.verifiedSoul}</span>
                </div>
            </div>
        </header>
    );
}
