"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, User, Home, Music, ChevronLeft, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/ThemeContext";
import { cn } from "@/lib/utils";

interface EventDetails {
    id: string;
    title: string;
    location: string;
    date: string;
    venue: string;
    imageUrl?: string | null;
    videoUrl?: string | null;
    bookedBy: {
        name: string;
        address: string;
        location: string;
        songs: string[];
    } | null;
}

export default function EventDetailsClient({ event }: { event: EventDetails }) {
    const router = useRouter();
    const { theme } = useTheme();

    return (
        <div className="space-y-12 pb-20">
            <button
                onClick={() => router.back()}
                className={cn(
                    "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-all",
                    theme === "dark" ? "text-white" : "text-black"
                )}
            >
                <ChevronLeft size={14} /> Back to Events
            </button>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-yellow-500">
                            <Ticket size={24} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Event Details</span>
                        </div>
                        <h1 className={cn(
                            "text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none",
                            theme === "dark" ? "text-white" : "text-black"
                        )}>
                            {event.venue}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-sm font-bold opacity-60">
                            <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-yellow-500" />
                                <span>{new Date(event.date).toLocaleDateString(undefined, {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={18} className="text-yellow-500" />
                                <span>{event.location}</span>
                            </div>
                        </div>
                    </div>

                    {event.bookedBy && (
                        <div className={cn(
                            "p-8 rounded-[2.5rem] border space-y-8 overflow-hidden relative group",
                            theme === "dark" ? "bg-white/[0.02] border-white/10" : "bg-black/[0.02] border-black/5"
                        )}>
                            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/5 blur-[60px] rounded-full -mr-20 -mt-20 group-hover:bg-yellow-500/10 transition-all duration-700" />

                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 rounded-2xl bg-yellow-500/10 text-yellow-500">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Sacred Host / Booked By</p>
                                        <h3 className={cn("text-2xl font-black uppercase tracking-tight", theme === "dark" ? "text-white" : "text-black")}>
                                            {event.bookedBy.name}
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex items-start gap-3">
                                        <Home size={16} className="text-yellow-500 mt-1 shrink-0" />
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest opacity-30">Booking Address</p>
                                            <p className="font-medium opacity-80">{event.bookedBy.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin size={16} className="text-yellow-500 mt-1 shrink-0" />
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest opacity-30">Event Conduct Location</p>
                                            <p className="font-medium opacity-80">{event.bookedBy.location}</p>
                                        </div>
                                    </div>
                                </div>

                                {event.bookedBy.songs.length > 0 && (
                                    <div className="pt-6 border-t border-white/5">
                                        <p className="text-[10px] uppercase font-black tracking-widest opacity-30 mb-4 flex items-center gap-2">
                                            <Music size={12} /> Favorite Songs Requested
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {event.bookedBy.songs.map((song, i) => (
                                                <span key={i} className={cn(
                                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                                                    theme === "dark" ? "bg-white/5 border-white/5 text-gray-300" : "bg-black/5 border-black/5 text-black/60"
                                                )}>
                                                    {song}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!event.bookedBy && (
                        <div className="p-12 border-2 border-dashed border-white/10 rounded-[2.5rem] text-center opacity-40">
                            <p className="text-sm font-black uppercase tracking-widest">Awaiting Divine Confirmation</p>
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 group"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60" />
                    {event.imageUrl ? (
                        <img
                            src={event.imageUrl}
                            alt={event.venue}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                    ) : (
                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                            <Music size={80} className="text-white/10" />
                        </div>
                    )}

                    <div className="absolute bottom-10 left-10 z-20 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-yellow-500">Sacred Performance</p>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{event.venue}</h2>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
