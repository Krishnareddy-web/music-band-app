"use client";

import { MapPin, Calendar as CalendarIcon, Ticket, Clock, AlertCircle, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/ThemeContext";
import { motion } from "framer-motion";
import { useBookingStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Event {
    id: string;
    date: string;
    venue: string;
    location: string;
    title: string;
    availableSeats: number;
    totalSeats: number;
}

export default function BookBandClient({ initialEvents }: { initialEvents: Event[] }) {
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    const { startBooking } = useBookingStore();
    const { data: session } = useSession();
    const router = useRouter();

    const now = new Date();
    const availableEvents = initialEvents.filter(e => new Date(e.date) >= now && e.availableSeats > 0);
    const closedEvents = initialEvents.filter(e => new Date(e.date) >= now && e.availableSeats <= 0);

    const handleBooking = async (eventId: string) => {
        if (!session) {
            router.push(`/login?callbackUrl=/book-band`);
            return;
        }
        await startBooking(eventId);
    };

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
                    {t.nav.bookBand || "Book The Band"}
                </h1>
                <p className={cn(
                    "max-w-2xl mx-auto text-lg font-medium opacity-60 tracking-wide italic",
                    theme === "dark" ? "text-gray-400" : "text-black/70"
                )}>
                    {t.liveDates.subtitle}
                </p>
            </section>

            <div className="space-y-12 pb-20 mt-10">
                <div className="flex items-center gap-4 mb-8">
                    <Ticket size={24} className="text-yellow-500" />
                    <h2 className={cn(
                        "text-2xl md:text-3xl font-black uppercase tracking-tighter",
                        theme === "dark" ? "text-white" : "text-black"
                    )}>Available Dates</h2>
                    <div className={cn(
                        "h-[2px] flex-1",
                        theme === "dark" ? "bg-white/10" : "bg-black/10"
                    )} />
                    <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-yellow-500/10 text-yellow-500"
                    )}>{availableEvents.length} Slots</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableEvents.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "group p-8 rounded-[2.5rem] border flex flex-col items-center justify-center text-center gap-6 transition-all duration-500",
                                theme === "dark"
                                    ? "bg-white/[0.02] border-white/10 hover:border-yellow-500/40 hover:bg-white/[0.04] shadow-2xl"
                                    : "bg-white border-black/10 hover:border-yellow-500/40 hover:shadow-2xl"
                            )}
                        >
                            <div className="space-y-2">
                                <div className="p-4 rounded-full bg-yellow-500/10 w-fit mx-auto mb-2">
                                    <CalendarIcon size={24} className="text-yellow-500" />
                                </div>
                                <h4 className={cn(
                                    "text-xl font-black uppercase tracking-widest",
                                    theme === "dark" ? "text-white" : "text-black"
                                )}>
                                    {new Date(event.date).toLocaleDateString(language, {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </h4>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
                                    {new Date(event.date).toLocaleDateString(language, { weekday: 'long' })}
                                </p>
                            </div>

                            <button
                                onClick={() => handleBooking(event.id)}
                                className={cn(
                                    "w-full px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl active:scale-95",
                                    theme === "dark"
                                        ? "bg-white text-black hover:bg-yellow-500"
                                        : "bg-black text-white hover:bg-yellow-600"
                                )}
                            >
                                {t.nav.bookBand || "Book Band"}
                            </button>
                        </motion.div>
                    ))}

                    {availableEvents.length === 0 && (
                        <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-[3.5rem] bg-white/[0.01]">
                            <AlertCircle className="mx-auto mb-4 text-gray-500" size={40} />
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No slots available right now</p>
                        </div>
                    )}
                </div>

                {closedEvents.length > 0 && (
                    <div className="space-y-8 pt-20">
                        <div className="flex items-center gap-4">
                            <X size={24} className="text-red-500" />
                            <h2 className={cn(
                                "text-2xl font-black uppercase tracking-tighter opacity-60",
                                theme === "dark" ? "text-white" : "text-black"
                            )}>Closed Dates</h2>
                            <div className={cn(
                                "h-[1px] flex-1",
                                theme === "dark" ? "bg-white/5" : "bg-black/5"
                            )} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {closedEvents.map((event, idx) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => router.push(`/live-dates/${event.id}`)}
                                    className={cn(
                                        "p-6 rounded-3xl border border-dashed text-center space-y-2 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 hover:border-solid hover:border-yellow-500/50 transition-all cursor-pointer group",
                                        theme === "dark" ? "border-white/10 bg-white/5" : "border-black/5 bg-black/5"
                                    )}
                                >
                                    <p className="text-xs font-black uppercase tracking-widest group-hover:text-yellow-500 transition-colors">
                                        {new Date(event.date).toLocaleDateString(language, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-[10px] font-bold uppercase text-red-500 tracking-widest">View Details</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <section className={cn(
                "p-12 rounded-[3.5rem] border text-center space-y-6 transition-all duration-500",
                theme === "dark" ? "bg-white/[0.02] border-white/10" : "bg-black/5 border-black/10"
            )}>
                <h3 className={cn(
                    "text-3xl font-black uppercase tracking-tighter",
                    theme === "dark" ? "text-white" : "text-black"
                )}>Need a Special Arrangement?</h3>
                <p className="max-w-xl mx-auto opacity-50 font-medium">
                    If you have a specific date in mind or require a custom performance setup, please reach out to us directly through our contact page.
                </p>
                <button
                    onClick={() => router.push('/contact')}
                    className="px-10 py-4 rounded-full border border-yellow-500/50 text-yellow-500 font-black uppercase tracking-widest text-[10px] hover:bg-yellow-500 hover:text-black transition-all"
                >
                    Contact Ensemble
                </button>
            </section>
        </div >
    );
}
