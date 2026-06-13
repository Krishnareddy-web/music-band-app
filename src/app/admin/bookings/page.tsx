"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Trash2, Check, Clock, MapPin, Phone, Music } from "lucide-react";
import { cn } from "@/lib/utils";

interface Booking {
    id: string;
    userId: string;
    eventId: string;
    status: string;
    createdAt: string;
    favoriteSongs?: string;
    clientAddress?: string;
    eventLocation?: string;
    clientPhone?: string;
    user: {
        name: string;
        email: string;
    };
    event: {
        title: string;
        date: string;
    };
}

export default function AdminBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/bookings");
            const data = await res.json();
            setBookings(data);
        } catch (err) {
            console.error("Failed to fetch bookings", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/admin/bookings/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) fetchBookings();
        } catch (err) {
            console.error("Failed to update booking status", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this booking?")) return;

        try {
            const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
            if (res.ok) fetchBookings();
        } catch (err) {
            console.error("Failed to delete booking", err);
        }
    };

    return (
        <div>
            <header className="mb-10">
                <h1 className="text-4xl font-light tracking-tight capitalize flex items-center gap-3">
                    <ClipboardList className="text-[#d4af37]" />
                    Bookings & Registrations
                </h1>
                <p className="text-gray-400 mt-2 font-serif italic text-lg">
                    Tracking the divine calls and band bookings.
                </p>
            </header>

            <div className="space-y-6">
                {loading ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-20 text-center text-gray-400">
                        <div className="animate-pulse">Retrieving scrolls...</div>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-20 text-center text-gray-500 font-serif italic text-lg">
                        No bookings found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#d4af37]/30 transition-all flex flex-col gap-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#d4af37]">{booking.event.title}</h3>
                                        <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                                            <Clock size={14} />
                                            {new Date(booking.event.date).toLocaleString()}
                                        </p>
                                    </div>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                        booking.status === 'CONFIRMED' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                                            booking.status === 'PENDING' ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                                                "bg-red-500/10 text-red-400 border border-red-500/20"
                                    )}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1">User Details</label>
                                            <p className="font-medium">{booking.user.name}</p>
                                            <p className="text-gray-400 text-xs">{booking.user.email}</p>
                                        </div>
                                        {booking.clientPhone && (
                                            <div>
                                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1 flex items-center gap-1">
                                                    <Phone size={10} /> Contact
                                                </label>
                                                <p>{booking.clientPhone}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        {booking.eventLocation && (
                                            <div>
                                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1 flex items-center gap-1">
                                                    <MapPin size={10} /> Event Location
                                                </label>
                                                <p className="text-gray-300">{booking.eventLocation}</p>
                                                <p className="text-[10px] text-gray-500 mt-1">{booking.clientAddress}</p>
                                            </div>
                                        )}
                                        {booking.favoriteSongs && (
                                            <div>
                                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1 flex items-center gap-1">
                                                    <Music size={10} /> Favorite Songs
                                                </label>
                                                <p className="text-gray-300 italic">"{booking.favoriteSongs}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10 flex justify-between items-center mt-auto">
                                    <button
                                        onClick={() => handleDelete(booking.id)}
                                        className="text-xs text-red-400 hover:underline uppercase tracking-widest font-bold flex items-center gap-1"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                    <div className="flex gap-2">
                                        {booking.status !== 'CONFIRMED' && (
                                            <button
                                                onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                                                className="px-4 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-[10px] font-bold hover:bg-green-500/20 transition-all uppercase tracking-widest flex items-center gap-1"
                                            >
                                                <Check size={14} /> Confirm
                                            </button>
                                        )}
                                        {booking.status !== 'CANCELLED' && (
                                            <button
                                                onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                                                className="px-4 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-[10px] font-bold hover:bg-red-500/20 transition-all uppercase tracking-widest"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
