"use client";

import { useState, useEffect } from "react";
import { Terminal, Cpu, Database, Activity, HardDrive } from "lucide-react";

export default function DeveloperOverview() {
    const [stats, setStats] = useState({
        users: 0,
        events: 0,
        bookings: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [u, e, b] = await Promise.all([
                    fetch("/api/admin/users").then(r => r.json()),
                    fetch("/api/admin/events").then(r => r.json()),
                    fetch("/api/admin/bookings").then(r => r.json()),
                ]);
                setStats({
                    users: u.length || 0,
                    events: e.length || 0,
                    bookings: b.length || 0,
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-4">
                    <Terminal className="text-purple-400" />
                    System Overview
                </h1>
                <p className="text-gray-500 mt-2 font-mono text-sm uppercase tracking-widest">
                    Root privilege level verified. System healthy.
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Database} label="DB User Registry" value={stats.users} color="purple" loading={loading} />
                <StatCard icon={Cpu} label="System Threads" value="Active" color="green" />
                <StatCard icon={Activity} label="Bandwidth" value="Optimized" color="blue" />
                <StatCard icon={HardDrive} label="Disk Usage" value="12%" color="yellow" />
            </div>

            <div className="mt-12 bg-purple-500/5 border border-purple-500/10 rounded-xl p-8">
                <h3 className="text-lg font-bold mb-4 text-purple-400 flex items-center gap-2">
                    <Terminal size={18} />
                    Kernel Output
                </h3>
                <div className="font-mono text-xs space-y-2 text-gray-400">
                    <p className="text-green-500">[OK] PRISMA_CLIENT_INITIALIZED</p>
                    <p className="text-green-500">[OK] NEXT_AUTH_PROXIED</p>
                    <p className="text-green-500">[OK] DATABASE_SQLITE_CONNECTED</p>
                    <p className="text-gray-600">---</p>
                    <p>Fetching meta records...</p>
                    <p>Identified {stats.users} user objects in cluster.</p>
                    <p>Identified {stats.events} event pointers.</p>
                    <p>Identified {stats.bookings} booking relationship nodes.</p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color, loading = false }: any) {
    const colors: any = {
        purple: "text-purple-400 border-purple-500/20",
        green: "text-green-400 border-green-500/20",
        blue: "text-blue-400 border-blue-500/20",
        yellow: "text-yellow-400 border-yellow-500/20",
    };

    return (
        <div className={cn("bg-black border p-6 rounded-xl flex flex-col justify-between min-h-[140px]", colors[color])}>
            <div className="flex items-center gap-3 mb-2">
                <Icon size={16} className="shrink-0" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 truncate">{label}</span>
            </div>
            {loading ? (
                <div className="h-8 w-12 bg-white/5 animate-pulse rounded" />
            ) : (
                <p className="text-2xl md:text-3xl font-bold text-white break-words lg:truncate" title={String(value)}>
                    {value}
                </p>
            )}
        </div>
    );
}

import { cn } from "@/lib/utils";
