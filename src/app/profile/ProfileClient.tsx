"use client";

import { motion } from "framer-motion";
import { Book, Play, Music2, MapPin, Ticket, Music } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/lib/ThemeContext";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

interface Purchase {
    id: string;
    title: string;
    type: string;
    date: string;
    status: string;
}

interface Booking {
    id: string;
    title: string;
    location: string;
    type: string;
    date: string;
    status: string;
    favoriteSongs: string[];
}

export default function ProfileClient({ initialPurchases, initialBookings }: { initialPurchases: Purchase[], initialBookings: Booking[] }) {
    const { theme } = useTheme();
    const { t } = useLanguage();

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between border-b pb-8 border-black/5 dark:border-white/5">
                <div className="flex items-center gap-5">
                    <div className="w-1.5 h-10 bg-yellow-500 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)]" />
                    <h2 className={cn(
                        "text-3xl font-black uppercase tracking-[0.1em] lg:text-4xl",
                        theme === "dark" ? "text-white" : "text-black"
                    )}>{t.profile.bookshelf}</h2>
                </div>
                <div className={cn(
                    "px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] opacity-50",
                    theme === "dark" ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                )}>
                    {initialPurchases.length} {t.profile.items}{initialPurchases.length !== 1 ? 'S' : ''}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {initialPurchases.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                            delay: index * 0.15,
                            duration: 0.8,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className={cn(
                            "group relative border p-8 rounded-[2rem] transition-all duration-500 overflow-hidden",
                            theme === "dark"
                                ? "bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
                                : "bg-black/[0.02] border-black/5 hover:bg-black/[0.05] hover:border-black/15 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
                        )}
                    >
                        <div className="flex justify-between items-start mb-10">
                            <div className={cn(
                                "p-5 rounded-2xl transition-all duration-500 group-hover:rotate-12",
                                theme === "dark" ? "bg-white/5 shadow-inner" : "bg-black/5 shadow-sm"
                            )}>
                                <Book className="w-8 h-8 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/10 backdrop-blur-md">
                                {item.status}
                            </span>
                        </div>

                        <div className="space-y-2 mb-10">
                            <h3 className={cn(
                                "text-2xl font-black uppercase tracking-tight leading-tight",
                                theme === "dark" ? "text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "text-black"
                            )}>{item.title}</h3>
                            <p className={cn(
                                "text-[10px] uppercase tracking-[0.3em] font-black",
                                theme === "dark" ? "text-gray-300" : "text-black/60"
                            )}>{item.type} • {item.date}</p>
                        </div>

                        <Link
                            href="/songs"
                            className={cn(
                                "flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 relative overflow-hidden",
                                theme === "dark"
                                    ? "bg-white text-black hover:bg-yellow-500"
                                    : "bg-black text-white hover:bg-yellow-600 shadow-xl"
                            )}
                        >
                            <Play className="w-4 h-4 fill-current" />
                            {t.profile.enterSanctuary}
                        </Link>
                    </motion.div>
                ))}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    whileHover={{ opacity: 1, scale: 1.02 }}
                    transition={{ delay: (initialPurchases.length + 1) * 0.1 }}
                    className={cn(
                        "flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-[2rem] text-center space-y-6 transition-all duration-500",
                        theme === "dark"
                            ? "border-white/10 bg-white/[0.02]"
                            : "border-black/5 bg-black/[0.01]"
                    )}
                >
                    <div className={cn(
                        "p-6 rounded-full shadow-inner",
                        theme === "dark" ? "bg-white/5" : "bg-black/5"
                    )}>
                        <Music2 className={cn("w-10 h-10", theme === "dark" ? "text-gray-500" : "text-gray-400")} />
                    </div>
                    <div className="space-y-2">
                        <p className={cn("text-xs uppercase tracking-[0.4em] font-black", theme === "dark" ? "text-gray-300" : "text-gray-500")}>
                            {t.profile.divineCollection}
                        </p>
                        <p className={cn("text-sm font-bold italic", theme === "dark" ? "text-gray-400" : "text-black/60")}>
                            {t.profile.moreSacred}
                        </p>
                    </div>
                    <Link
                        href="/songs"
                        className={cn(
                            "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all border duration-500",
                            theme === "dark"
                                ? "bg-white/10 text-white hover:bg-white border-white/10 hover:text-black"
                                : "bg-black/5 text-black hover:bg-black border-black/5 hover:text-white"
                        )}
                    >
                        {t.profile.browseStore}
                    </Link>
                </motion.div>
            </div>

            {/* Bookings Section */}
            <div className="flex items-center justify-between border-b pb-8 border-black/5 dark:border-white/5 pt-10">
                <div className="flex items-center gap-5">
                    <div className="w-1.5 h-10 bg-yellow-500 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)]" />
                    <h2 className={cn(
                        "text-3xl font-black uppercase tracking-[0.1em] lg:text-4xl",
                        theme === "dark" ? "text-white" : "text-black"
                    )}>Sacred Bookings</h2>
                </div>
                <div className={cn(
                    "px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] opacity-50",
                    theme === "dark" ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                )}>
                    {initialBookings.length} {initialBookings.length === 1 ? 'BOOKING' : 'BOOKINGS'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {initialBookings.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                            delay: index * 0.15,
                            duration: 0.8,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                        className={cn(
                            "relative border p-8 rounded-[2rem] transition-all duration-500 overflow-hidden",
                            theme === "dark"
                                ? "bg-white/[0.03] border-white/10 hover:border-white/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
                                : "bg-black/[0.02] border-black/5 hover:border-black/15 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
                        )}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={cn(
                                "p-4 rounded-2xl",
                                theme === "dark" ? "bg-white/5" : "bg-black/5"
                            )}>
                                <Ticket className="w-6 h-6 text-yellow-500" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/10">
                                {item.status}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className={cn(
                                    "text-2xl font-black uppercase tracking-tight",
                                    theme === "dark" ? "text-white" : "text-black"
                                )}>{item.title}</h3>
                                <div className="flex items-center gap-2 opacity-50 text-[10px] font-black uppercase tracking-widest">
                                    <MapPin size={12} className="text-yellow-500" />
                                    <span>{item.location} • {item.date}</span>
                                </div>
                            </div>

                            {item.favoriteSongs.length > 0 && (
                                <div className="pt-4 border-t border-black/5 dark:border-white/5">
                                    <p className="text-[10px] uppercase text-gray-500 font-black mb-3 tracking-widest flex items-center gap-2">
                                        <Music size={12} /> Favorite Songs
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.favoriteSongs.map((song, idx) => (
                                            <span key={idx} className={cn(
                                                "text-[9px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider",
                                                theme === "dark" ? "bg-white/5 text-gray-300" : "bg-black/5 text-black/60"
                                            )}>
                                                {song}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {initialBookings.length === 0 && (
                    <div className={cn(
                        "flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-[2rem] text-center opacity-40 col-span-full",
                        theme === "dark" ? "border-white/10" : "border-black/5"
                    )}>
                        <p className="text-sm font-black uppercase tracking-widest">No active bookings yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
