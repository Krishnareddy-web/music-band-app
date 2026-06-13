"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { LayoutDashboard } from "lucide-react";

interface Event {
    id: string;
    title: string;
    date: string;
    venue: string;
    location: string;
    availableSeats: number;
    status: string;
}

export default function AdminOverview() {
    const { data: session } = useSession();
    const [events, setEvents] = useState<Event[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [eventsRes, usersRes] = await Promise.all([
                    fetch("/api/admin/events"),
                    fetch("/api/admin/users")
                ]);
                const [eventsData, usersData] = await Promise.all([
                    eventsRes.json(),
                    usersRes.json()
                ]);
                setEvents(eventsData);
                setUsers(usersData);
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <header className="mb-10">
                <h1 className="text-4xl font-light tracking-tight capitalize flex items-center gap-3">
                    <LayoutDashboard className="text-[#d4af37]" />
                    Overview
                </h1>
                <p className="text-gray-400 mt-2 font-serif italic text-lg">
                    {session?.user?.role === "ADMIN" ? "Managing the divine schedule" : "Architecting the sacred domain"}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#d4af37]/30 transition-all">
                    <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">Total Events</h3>
                    {loading ? <div className="h-10 w-20 bg-white/10 animate-pulse rounded" /> : <p className="text-4xl font-light">{events.length}</p>}
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#d4af37]/30 transition-all">
                    <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">Total Users</h3>
                    {loading ? <div className="h-10 w-20 bg-white/10 animate-pulse rounded" /> : <p className="text-4xl font-light">{users.length}</p>}
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#d4af37]/30 transition-all">
                    <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">Service Status</h3>
                    <p className="text-2xl font-light text-green-400">Divine & Active</p>
                </div>
            </div>

            <div className="mt-12">
                <h3 className="text-xl font-bold mb-6 text-[#d4af37] tracking-widest uppercase">Recent Activity</h3>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-gray-500 font-serif italic">
                    The temple logs are being updated...
                </div>
            </div>
        </div>
    );
}
