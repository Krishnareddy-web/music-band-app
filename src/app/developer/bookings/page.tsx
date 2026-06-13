"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Clock, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DeveloperBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch("/api/admin/bookings");
                const data = await res.json();
                setBookings(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    return (
        <div className="space-y-8 font-mono">
            <header>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <ClipboardList className="text-purple-400" />
                    Booking Relation Map
                </h1>
                <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Auditing the transactional state of all event reservations.</p>
            </header>

            <div className="bg-black/40 border border-purple-500/20 rounded-xl overflow-hidden shadow-2xl shadow-purple-500/5">
                <table className="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr className="bg-purple-500/5 border-b border-purple-500/20 text-purple-400">
                            <th className="px-6 py-4 font-bold uppercase tracking-widest">Transaction ID</th>
                            <th className="px-6 py-4 font-bold uppercase tracking-widest">Relation Nodes (User {'->'} Event)</th>
                            <th className="px-6 py-4 font-bold uppercase tracking-widest text-center">State</th>
                            <th className="px-6 py-4 font-bold uppercase tracking-widest text-right">TTL / Expiry</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} className="px-6 py-20 text-center text-gray-600 animate-pulse">Mapping relations...</td></tr>
                        ) : (
                            bookings.map((booking) => (
                                <tr key={booking.id} className="border-b border-white/5 hover:bg-purple-500/[0.05] transition-colors">
                                    <td className="px-6 py-4 text-purple-900 font-mono">{booking.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500 text-[10px]">USR:</span>
                                                <span className="text-gray-300">{booking.user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500 text-[10px]">EVT:</span>
                                                <span className="text-[#d4af37]">{booking.event.title}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <code className={cn(
                                            "px-2 py-0.5 rounded text-[10px]",
                                            booking.status === 'CONFIRMED' ? "bg-green-500/10 text-green-500" :
                                                booking.status === 'PENDING' ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"
                                        )}>
                                            {booking.status}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-500 font-mono">
                                        {booking.expiresAt ? new Date(booking.expiresAt).toISOString() : '∞ PERMANENT'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
