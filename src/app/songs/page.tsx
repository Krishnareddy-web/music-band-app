"use client";

import Navigation from "@/components/Navigation";
import PaymentGate from "@/components/PaymentGate";
import SongPlayer from "@/components/SongPlayer";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { cn } from "@/lib/utils";

export default function SongsPage() {
    const { t } = useLanguage();
    const { theme } = useTheme();

    return (
        <main className={cn(
            "min-h-screen pt-40 pb-12 px-4 md:px-8 transition-colors duration-500",
            theme === "dark" ? "bg-transparent text-white" : "bg-white text-black"
        )}>
            <Navigation />

            <div className="max-w-7xl mx-auto space-y-12">
                <section className="text-center space-y-4">
                    <h1 className={cn(
                        "text-4xl md:text-6xl font-bold py-4 overflow-visible",
                        theme === "dark"
                            ? "bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500"
                            : "text-black"
                    )}>
                        {t.songs.title}
                    </h1>
                    <p className={cn(
                        "max-w-2xl mx-auto text-lg",
                        theme === "dark" ? "text-gray-400" : "text-black/70"
                    )}>
                        {t.songs.subtitle}
                    </p>
                </section>

                <PaymentGate>
                    <SongPlayer />
                </PaymentGate>
            </div>
        </main>
    );
}
