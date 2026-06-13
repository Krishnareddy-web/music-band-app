"use client";

import { MapPin, Play, Image as ImageIcon, ExternalLink, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

interface Event {
    id: string;
    date: string;
    venue: string;
    location: string;
    title: string;
    imageUrl: string | null;
    videoUrl: string | null;
    status: string;
}

export default function LiveDatesClient({ initialEvents }: { initialEvents: Event[] }) {
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const now = new Date();
    const todayStr = now.toDateString();

    const categorized = initialEvents.reduce((acc, event) => {
        const eventDate = new Date(event.date);
        const eventDateStr = eventDate.toDateString();

        if (eventDateStr === todayStr) {
            acc.live.push(event);
        } else if (eventDate < now) {
            acc.completed.push(event);
        } else {
            acc.upcoming.push(event);
        }
        return acc;
    }, { live: [] as Event[], upcoming: [] as Event[], completed: [] as Event[] });

    const SectionHeader = ({ title, count, color = "yellow" }: { title: string, count: number, color?: string }) => (
        <div className="flex items-center gap-4 mb-8">
            <h2 className={cn(
                "text-2xl md:text-3xl font-black uppercase tracking-tighter",
                theme === "dark" ? "text-white" : "text-black"
            )}>{title}</h2>
            <div className={cn(
                "h-[2px] flex-1",
                theme === "dark" ? "bg-white/10" : "bg-black/10"
            )} />
            <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                color === "red" ? "bg-red-500/10 text-red-500" :
                    color === "green" ? "bg-green-500/10 text-green-500" :
                        "bg-yellow-500/10 text-yellow-500"
            )}>{count} Events</span>
        </div>
    );

    const EventGrid = ({ events, isCompleted = false }: { events: Event[], isCompleted?: boolean }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event, index) => {
                const eventDateStr = new Date(event.date).toDateString();

                return (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        viewport={{ once: true }}
                        className={cn(
                            "group relative flex flex-col rounded-[2.5rem] overflow-hidden border transition-all duration-500",
                            theme === "dark"
                                ? "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06] shadow-2xl shadow-black/50"
                                : "bg-white border-black/10 hover:border-black/20 hover:shadow-2xl shadow-black/5",
                            isCompleted && "opacity-80 grayscale hover:grayscale-0"
                        )}
                    >
                        {/* Media Section */}
                        <div className="relative h-64 overflow-hidden">
                            {event.imageUrl ? (
                                <Image
                                    src={event.imageUrl}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            ) : (
                                <div className={cn(
                                    "w-full h-full flex items-center justify-center bg-yellow-500/10",
                                    theme === "dark" ? "text-white/20" : "text-black/10"
                                )}>
                                    <ImageIcon size={64} strokeWidth={1} />
                                </div>
                            )}

                            {/* Badge */}
                            <div className="absolute top-6 left-6 z-10">
                                <span className={cn(
                                    "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border",
                                    isCompleted ? "bg-gray-500/20 text-gray-400 border-gray-500/20" :
                                        eventDateStr === todayStr ? "bg-green-500/20 text-green-500 border-green-500/20 animate-pulse" :
                                            "bg-yellow-500/20 text-yellow-500 border-yellow-500/20"
                                )}>
                                    {isCompleted ? "Completed" : eventDateStr === todayStr ? "Live" : "Upcoming"}
                                </span>
                            </div>

                            {/* Play Video Overlay */}
                            {event.videoUrl && (
                                <button
                                    onClick={() => setSelectedVideo(event.videoUrl)}
                                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black scale-75 group-hover:scale-100 transition-transform duration-500 shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                                        <Play fill="currentColor" size={24} className="ml-1" />
                                    </div>
                                </button>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="p-8 space-y-6 flex-1 flex flex-col">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-600">
                                        <CalendarIcon size={18} />
                                    </div>
                                    <span className={cn(
                                        "text-sm font-black uppercase tracking-widest",
                                        theme === "dark" ? "text-white" : "text-black"
                                    )}>
                                        {new Date(event.date).toLocaleDateString(language, {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>

                                <h3 className={cn(
                                    "text-2xl font-black uppercase tracking-tighter leading-tight group-hover:text-yellow-500 transition-colors",
                                    theme === "dark" ? "text-white" : "text-black"
                                )}>{event.venue}</h3>

                                <div className={cn(
                                    "flex items-center text-sm gap-2 opacity-50 font-medium",
                                    theme === "dark" ? "text-gray-400" : "text-black"
                                )}>
                                    <MapPin size={16} className="text-yellow-500" />
                                    <span>{event.location}</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/5 flex gap-4">
                                {event.videoUrl && (
                                    <button
                                        onClick={() => setSelectedVideo(event.videoUrl)}
                                        className={cn(
                                            "flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                            theme === "dark" ? "bg-white text-black hover:bg-yellow-500" : "bg-black text-white hover:bg-yellow-600"
                                        )}
                                    >
                                        <Play size={14} fill="currentColor" />
                                        Watch Video
                                    </button>
                                )}
                                <div className={cn(
                                    "px-4 flex items-center justify-center rounded-2xl border",
                                    theme === "dark" ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                                )}>
                                    <Clock size={16} className="text-yellow-500" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );

    return (
        <div className="space-y-24">
            <section className="text-center space-y-6 relative py-10">
                <div className="absolute inset-0 bg-yellow-500/5 blur-[100px] rounded-full -z-10 animate-pulse" />
                <h1 className={cn(
                    "text-5xl md:text-7xl font-black uppercase tracking-tighter py-4 overflow-visible leading-[0.9]",
                    theme === "dark"
                        ? "text-white drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                        : "text-black"
                )}>
                    {t.liveDates.title}
                </h1>
                <p className={cn(
                    "max-w-2xl mx-auto text-lg font-medium opacity-60 tracking-wide italic",
                    theme === "dark" ? "text-gray-400" : "text-black/70"
                )}>
                    {t.liveDates.subtitle}
                </p>
            </section>

            <div className="space-y-24">
                {categorized.live.length > 0 && (
                    <section>
                        <SectionHeader title="Today / Live" count={categorized.live.length} color="green" />
                        <EventGrid events={categorized.live} />
                    </section>
                )}

                {categorized.upcoming.length > 0 && (
                    <section>
                        <SectionHeader title="Upcoming Events" count={categorized.upcoming.length} />
                        <EventGrid events={categorized.upcoming} />
                    </section>
                )}

                {categorized.completed.length > 0 && (
                    <section>
                        <SectionHeader title="Completed Events" count={categorized.completed.length} color="gray" />
                        <EventGrid events={categorized.completed} isCompleted />
                    </section>
                )}

                {initialEvents.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-gray-500">{t.liveDates.empty}</p>
                    </div>
                )}
            </div>

            {/* Video Modal Logic */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-10 backdrop-blur-xl"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <div className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-3xl">
                            <iframe
                                src={selectedVideo.replace("watch?v=", "embed/")}
                                className="w-full h-full"
                                allowFullScreen
                                title="Event Video"
                            />
                            <button
                                className="absolute top-6 right-6 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
                                onClick={() => setSelectedVideo(null)}
                            >
                                <Play size={24} className="rotate-45" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
