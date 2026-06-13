"use client";

import { useState, useEffect } from "react";
import { Activity, Clock, Shield, User as UserIcon, LogIn, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SessionMonitor() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            // Filter users with some activity or just show all for total overview
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
        const interval = setInterval(fetchSessions, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, []);

    const activeUsers = users.filter(u => {
        if (!u.lastActive) return false;
        const lastActive = new Date(u.lastActive).getTime();
        const now = new Date().getTime();
        return (now - lastActive) < 300000; // Active in last 5 mins
    });

    return (
        <div className="space-y-8 font-mono">
            <header>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Activity className="text-green-400 animate-pulse" />
                            Session Pulse Monitor
                        </h1>
                        <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Real-time tracking of authenticated user nodes.</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-lg">
                        <span className="text-xs text-green-400 font-bold tracking-widest uppercase">Live Nodes: {activeUsers.length}</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    label="Active Sessions"
                    value={activeUsers.length}
                    sub="LAST 5 MINUTES"
                    color="green"
                />
                <MetricCard
                    label="Total Registered"
                    value={users.length}
                    sub="TOTAL DB RECORDS"
                    color="purple"
                />
                <MetricCard
                    label="System Load"
                    value="NOMINAL"
                    sub="RESOURCES OPTIMIZED"
                    color="blue"
                />
            </div>

            <div className="bg-black/40 border border-purple-500/20 rounded-xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                        <tr className="bg-purple-500/5 border-b border-purple-500/20 text-purple-400">
                            <th className="px-6 py-4 uppercase tracking-widest font-bold">Identity</th>
                            <th className="px-6 py-4 uppercase tracking-widest font-bold">Last Known Activity</th>
                            <th className="px-6 py-4 uppercase tracking-widest font-bold">Session Start (Login)</th>
                            <th className="px-6 py-4 uppercase tracking-widest font-bold text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && users.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-20 text-center text-gray-700 animate-pulse">Syncing session clusters...</td></tr>
                        ) : (
                            users.sort((a, b) => new Date(b.lastActive || 0).getTime() - new Date(a.lastActive || 0).getTime()).map((u) => {
                                const isActive = u.lastActive && (new Date().getTime() - new Date(u.lastActive).getTime()) < 300000;
                                return (
                                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-gray-800")} />
                                                <div className="flex flex-col">
                                                    <span className="text-gray-300 font-bold">{u.email}</span>
                                                    <span className="text-gray-600 text-[9px] uppercase tracking-tighter">{u.role} | {u.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {u.lastActive ? new Date(u.lastActive).toLocaleString() : 'NEVER_TRACED'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-widest",
                                                isActive ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-gray-500/10 text-gray-500 border border-white/5"
                                            )}>
                                                {isActive ? 'ONLINE' : 'OFFLINE'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function MetricCard({ label, value, sub, color }: any) {
    const colors: any = {
        green: "text-green-400 border-green-500/20 bg-green-500/5",
        purple: "text-purple-400 border-purple-500/20 bg-purple-500/5",
        blue: "text-blue-400 border-blue-500/20 bg-blue-500/5",
    };
    return (
        <div className={cn("p-6 border rounded-xl", colors[color])}>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">{label}</p>
            <p className="text-2xl font-bold mt-1 text-white">{value}</p>
            <p className="text-[9px] mt-1 opacity-40 uppercase tracking-tighter">{sub}</p>
        </div>
    );
}
