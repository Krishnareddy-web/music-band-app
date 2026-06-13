"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Event {
    id: string;
    title: string;
    date: string;
    venue: string;
    location: string;
    availableSeats: number;
    status: string;
    imageUrl?: string;
    videoUrl?: string;
}

export default function AdminEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalingOpen, setIsModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Partial<Event> | null>(null);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/events");
            const data = await res.json();
            setEvents(data);
        } catch (err) {
            console.error("Failed to fetch events", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = currentEvent?.id ? "PATCH" : "POST";
        const url = currentEvent?.id ? `/api/admin/events/${currentEvent.id}` : "/api/admin/events";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentEvent),
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchEvents();
            }
        } catch (err) {
            console.error("Failed to save event", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
            if (res.ok) fetchEvents();
        } catch (err) {
            console.error("Failed to delete event", err);
        }
    };

    return (
        <div>
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-light tracking-tight capitalize flex items-center gap-3">
                        <Calendar className="text-[#d4af37]" />
                        Manage Events
                    </h1>
                    <p className="text-gray-400 mt-2 font-serif italic text-lg">
                        Creating and curating the divine schedule.
                    </p>
                </div>
                <button
                    onClick={() => { setCurrentEvent({}); setIsModalOpen(true); }}
                    className="px-6 py-2 bg-[#d4af37] text-black text-sm font-bold rounded-full hover:bg-[#b8962d] transition-colors uppercase tracking-widest flex items-center gap-2"
                >
                    <Plus size={18} />
                    New Event
                </button>
            </header>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5 uppercase tracking-tighter text-xs">
                            <th className="px-6 py-4 font-bold">Event Title</th>
                            <th className="px-6 py-4 font-bold text-center">Date</th>
                            <th className="px-6 py-4 font-bold text-center">Status</th>
                            <th className="px-6 py-4 font-bold text-center">Seats</th>
                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-gray-400">
                                    <div className="animate-pulse">Retrieving records...</div>
                                </td>
                            </tr>
                        ) : events.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-gray-500 font-serif italic text-lg">
                                    No events found.
                                </td>
                            </tr>
                        ) : (
                            events.map((event) => (
                                <tr key={event.id} className="border-b border-white/5 hover:bg-white/[0.02] group transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="font-medium group-hover:text-[#d4af37] transition-colors">{event.title}</div>
                                        <div className="text-sm text-gray-400 lowercase italic">{event.location}</div>
                                    </td>
                                    <td className="px-6 py-5 text-center text-sm font-mono text-gray-300">
                                        {new Date(event.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                            event.status === 'OPEN' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                                                "bg-red-500/10 text-red-400 border border-red-500/20"
                                        )}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center text-sm">
                                        {event.availableSeats} <span className="text-gray-500">remaining</span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => { setCurrentEvent(event); setIsModalOpen(true); }}
                                                className="p-2 text-gray-400 hover:text-[#d4af37] transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalingOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-2xl font-light tracking-tight text-[#d4af37]">
                                {currentEvent?.id ? "Edit Event" : "Create New Event"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Event Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={currentEvent?.title || ""}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-all"
                                        placeholder="e.g. Mandalapooja Mahotsavam"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Date</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={currentEvent?.date ? new Date(currentEvent.date).toISOString().slice(0, 16) : ""}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Status</label>
                                    <select
                                        value={currentEvent?.status || "OPEN"}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, status: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-all"
                                    >
                                        <option value="OPEN">OPEN</option>
                                        <option value="LIVE">LIVE</option>
                                        <option value="COMPLETED">COMPLETED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Venue</label>
                                    <input
                                        type="text"
                                        required
                                        value={currentEvent?.venue || ""}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, venue: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-all"
                                        placeholder="e.g. Main Temple Hall"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Location</label>
                                    <input
                                        type="text"
                                        required
                                        value={currentEvent?.location || ""}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, location: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-all"
                                        placeholder="e.g. Sabarimala"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Total Seats</label>
                                    <input
                                        type="number"
                                        required
                                        value={currentEvent?.availableSeats || 100}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, availableSeats: parseInt(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Video URL (Optional)</label>
                                    <input
                                        type="text"
                                        value={currentEvent?.videoUrl || ""}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, videoUrl: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-all"
                                        placeholder="YouTube URL"
                                    />
                                </div>
                            </div>
                            <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 border border-white/10 rounded-full hover:bg-white/5 transition-all text-sm uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all text-sm uppercase tracking-widest flex items-center gap-2"
                                >
                                    <Check size={18} />
                                    Save Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
