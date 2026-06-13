"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Users, Calendar, Settings, LogOut, LayoutDashboard, ClipboardList, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
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
        if (status === "authenticated" && session?.user?.role !== "ADMIN" && session?.user?.role !== "DEVELOPER") {
            router.push("/profile");
        }
    }, [status, session, router]);

    if (status === "loading" || (status === "authenticated" && session?.user?.role !== "ADMIN" && session?.user?.role !== "DEVELOPER")) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    const navItems = [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Events", href: "/admin/events", icon: Calendar },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Bookings", href: "/admin/bookings", icon: ClipboardList },
    ];

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-black sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#d4af37] flex items-center justify-center text-black font-bold text-xs uppercase">DS</div>
                    <span className="font-bold tracking-widest text-[#d4af37] text-sm">ADMIN PANEL</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-[#d4af37] hover:bg-white/5 rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 flex flex-col pt-24 md:pt-24 bg-black transition-transform duration-300 md:translate-x-0 md:sticky md:top-0 md:h-screen",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="px-6 mb-8 hidden md:block">
                    <h2 className="text-xl font-bold tracking-widest text-[#d4af37]">ADMIN PANEL</h2>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-tighter">Temple Management</p>
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
                                    isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 mt-auto">
                    <div className="flex items-center space-x-3 p-3 mb-4 rounded bg-white/5">
                        <div className="w-8 h-8 rounded-full bg-[#d4af37] shrink-0 flex items-center justify-center text-black font-bold text-xs">
                            {session?.user?.role === "ADMIN" ? "HP" : "TA"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{session?.user?.name}</p>
                            <p className="text-[10px] text-gray-400 truncate tracking-tight uppercase">
                                {session?.user?.role === "ADMIN" ? "Priest Role" : "Architect Role"}
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
                {children}
            </main>
        </div>
    );
}
