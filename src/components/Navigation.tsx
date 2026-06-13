"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Globe, Menu, X, LogOut, User as UserIcon, Shield, Terminal } from "lucide-react";

import { useLanguage, type Language } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import Logo from "./Logo";
import DevotionalBell from "./DevotionalBell";

export default function Navigation() {
    const pathname = usePathname();
    const { theme } = useTheme();
    const { data: session } = useSession();
    const { language, setLanguage, t } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return null;

    const navItems = [
        { name: t.nav.home, href: "/" },
        { name: t.nav.about, href: "/about" },
        { name: t.nav.liveDates, href: "/live-dates" },
        { name: t.nav.songs, href: "/songs" },
        { name: t.nav.bookBand || "Book Band", href: "/book-band" },
        { name: t.nav.contact, href: "/contact" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 md:pt-6 px-3 md:px-4">
            <nav className={cn(
                "w-fit mx-auto flex items-center gap-2 md:gap-4 py-2 md:py-3 px-3 md:px-5 rounded-xl md:rounded-full backdrop-blur-md transition-all duration-500",
                theme === "dark"
                    ? "bg-black/40 border-white/10"
                    : "bg-white/40 border-black/10",
                "border shadow-2xl"
            )}>
                {/* Left Side: Mobile Toggle & Logo */}
                <div className="flex items-center gap-1">
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={cn(
                                "p-2 rounded-full transition-colors",
                                theme === "dark" ? "text-white hover:bg-white/5" : "text-black hover:bg-black/5"
                            )}
                            aria-label="Toggle Menu"
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    <Link
                        href="/"
                        className="scale-90 md:scale-100"
                        onClick={(e) => {
                            if (window.innerWidth < 1024) {
                                e.preventDefault();
                                setIsMenuOpen(!isMenuOpen);
                            }
                        }}
                    >
                        <Logo />
                    </Link>
                </div>

                {/* Desktop Navigation Items */}
                <div className="hidden lg:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative px-2 py-1.5 text-[11px] font-black uppercase tracking-widest transition-colors whitespace-nowrap",
                                    theme === "dark"
                                        ? (isActive ? "text-white" : "text-gray-400 hover:text-white")
                                        : (isActive ? "text-black" : "text-gray-600 hover:text-black")
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className={cn(
                                            "absolute inset-0 rounded-full",
                                            theme === "dark" ? "bg-white/10" : "bg-black/10"
                                        )}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side Tools & Actions */}
                <div className="flex items-center gap-2 md:gap-4 pr-1">
                    {/* Desktop Auth */}
                    <div className="hidden lg:flex items-center gap-1">
                        {session ? (
                            <>
                                {session.user.role === "ADMIN" && (
                                    <Link href="/admin" className="p-2 hover:bg-white/5 rounded-full text-indigo-400" title="Admin Panel"><Shield size={16} /></Link>
                                ) || session.user.role === "DEVELOPER" && (
                                    <Link href="/developer" className="p-2 hover:bg-white/5 rounded-full text-purple-400" title="Developer Console"><Terminal size={16} /></Link>
                                )}
                                <Link href="/profile" className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors" title="My Profile"><UserIcon size={16} /></Link>
                                <button onClick={() => signOut()} className="p-2 hover:bg-white/5 rounded-full text-red-400 transition-colors" title="Logout"><LogOut size={16} /></button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4af37] px-4 py-1.5 border border-[#d4af37]/20 rounded-full hover:bg-[#d4af37]/10 transition-all font-serif"
                            >
                                {t.nav.login}
                            </Link>
                        )}
                    </div>

                    {/* Universal Tools */}
                    <div className={cn(
                        "flex items-center gap-2 pl-2 md:pl-4 border-l",
                        theme === "dark" ? "border-white/10" : "border-black/10"
                    )}>
                        <div className="relative">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className={cn(
                                    "flex items-center gap-1 text-[10px] font-black focus:outline-none cursor-pointer uppercase tracking-tighter px-2 py-1 rounded-md transition-colors",
                                    theme === "dark" ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"
                                )}
                            >
                                {language}
                                <Globe size={12} className={cn("transition-transform duration-300", isLangOpen && "rotate-180")} />
                            </button>

                            <AnimatePresence>
                                {isLangOpen && (
                                    <>
                                        {/* Backdrop to close on click outside */}
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsLangOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                            className={cn(
                                                "absolute right-0 top-full mt-2 min-w-[80px] p-1 rounded-xl border shadow-2xl z-20 overflow-hidden",
                                                theme === "dark" ? "bg-black/90 border-white/10 backdrop-blur-xl" : "bg-white/90 border-black/10 backdrop-blur-md"
                                            )}
                                        >
                                            {(['en', 'te', 'ml'] as Language[]).map((lang) => (
                                                <button
                                                    key={lang}
                                                    onClick={() => {
                                                        setLanguage(lang);
                                                        setIsLangOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-colors rounded-lg",
                                                        language === lang
                                                            ? (theme === "dark" ? "bg-white/10 text-white" : "bg-black/10 text-black")
                                                            : (theme === "dark" ? "text-white/40 hover:text-white hover:bg-white/5" : "text-black/40 hover:text-black hover:bg-black/5")
                                                    )}
                                                >
                                                    {lang}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                        <DevotionalBell className="scale-90 md:scale-100" />
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "fixed inset-x-4 top-24 z-40 lg:hidden p-6 rounded-3xl border backdrop-blur-xl shadow-3xl",
                            theme === "dark" ? "bg-black/90 border-white/10" : "bg-white/90 border-black/10"
                        )}
                    >
                        <div className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-2xl font-black uppercase tracking-tighter hover:text-yellow-500 transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className={cn("h-px my-2", theme === "dark" ? "bg-white/10" : "bg-black/10")} />
                            {session ? (
                                <div className="space-y-4">
                                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-lg font-bold">
                                        <UserIcon size={20} /> {t.nav.profile}
                                    </Link>
                                    {session.user.role === "ADMIN" && (
                                        <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-lg font-bold">
                                            <Shield size={20} /> {t.nav.admin}
                                        </Link>
                                    )}
                                    <button onClick={() => signOut()} className="flex items-center gap-3 text-lg font-bold text-red-500 w-full text-left">
                                        <LogOut size={20} /> {t.nav.logout}
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black uppercase text-yellow-500">
                                    {t.nav.login}
                                </Link>
                            )}
                            <div className={cn("h-px my-2", theme === "dark" ? "bg-white/10" : "bg-black/10")} />
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-widest opacity-50">Language</span>
                                <div className="flex gap-4 font-mono text-sm">
                                    {['en', 'te', 'ml'].map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => { setLanguage(lang as Language); setIsMenuOpen(false); }}
                                            className={cn(language === lang ? "text-yellow-500 font-bold" : "opacity-50")}
                                        >
                                            {lang.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
