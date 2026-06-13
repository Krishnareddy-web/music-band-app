"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Database, Terminal, Settings, LogOut, LayoutDashboard, Bug, Activity, Users, ClipboardList, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function DeveloperLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
        if (status === "authenticated" && session?.user?.role !== "DEVELOPER") {
            router.push("/admin"); // Fallback to admin if they are admin but not dev
        }
    }, [status, session, router]);

    if (status === "loading" || (status === "authenticated" && session?.user?.role !== "DEVELOPER")) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    const navItems = [
        { name: "Overview", href: "/developer", icon: LayoutDashboard },
        { name: "Database Explorer", href: "/developer/db", icon: Database },
        { name: "Session Monitor", href: "/developer/sessions", icon: Activity },
        { name: "Registrations", href: "/developer/registrations", icon: Users },
        { name: "Bookings", href: "/developer/bookings", icon: ClipboardList },
        { name: "System Logs", href: "/developer/logs", icon: Terminal },
        { name: "Global Config", href: "/developer/config", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-black text-white font-mono flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-purple-500/20 bg-black sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-purple-500 flex items-center justify-center text-black font-bold text-xs">DS</div>
                    <span className="font-bold tracking-widest text-purple-400 text-sm">DEV CONSOLE</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 border-r border-purple-500/20 flex flex-col pt-24 md:pt-24 bg-black transition-transform duration-300 md:translate-x-0 md:sticky md:top-0 md:h-screen",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="px-6 mb-8 hidden md:block">
                    <h2 className="text-xl font-bold tracking-widest text-purple-400">DEV CONSOLE</h2>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">System Architect Access</p>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all",
                                    isActive ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon size={18} />
                                <span className="text-sm tracking-tight">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-purple-500/20 mt-auto">
                    <div className="flex items-center space-x-3 p-3 mb-4 rounded bg-purple-500/5">
                        <div className="w-8 h-8 rounded bg-purple-500 shrink-0 flex items-center justify-center text-black font-bold">
                            {session?.user?.name?.substring(0, 2).toUpperCase() || '??'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-medium truncate">{session?.user?.name}</p>
                            <p className="text-[10px] text-purple-400 truncate tracking-tight uppercase">
                                Root Session
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pt-8 md:pt-24 px-4 md:px-10 pb-10">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
