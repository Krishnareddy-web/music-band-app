"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Shield } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { t } = useLanguage();
    const { theme } = useTheme();
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Use NextAuth signIn
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.ok) {
            router.push("/profile");
        } else {
            alert(t.auth.login.failed);
        }
        setIsLoading(false);
    };

    if (!mounted) return (
        <main className="min-h-screen flex flex-col items-center pt-40 pb-20 px-4 bg-black">
            <div className="w-full max-w-md h-[400px] bg-white/5 rounded-3xl animate-pulse" />
        </main>
    );

    return (
        <main className={cn(
            "min-h-screen flex flex-col items-center pt-40 pb-20 px-4 transition-colors duration-500",
            theme === "dark" ? "bg-transparent text-white" : "bg-gray-50 text-black"
        )}>
            <Navigation />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "w-full max-w-md space-y-8 border p-8 rounded-3xl backdrop-blur-sm relative overflow-hidden transition-all duration-500",
                    theme === "dark" ? "bg-white/5 border-white/10" : "bg-white border-black/20 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                )}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

                <div className="text-center space-y-2">
                    <div className={cn("inline-flex p-4 rounded-2xl mb-2", theme === "dark" ? "bg-white/10" : "bg-black/5")}>
                        <Shield className="w-8 h-8 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]" />
                    </div>
                    <h1 className={cn(
                        "text-3xl font-black uppercase tracking-tighter py-2 leading-snug overflow-visible",
                        theme === "dark" ? "text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "text-black"
                    )}>{t.auth.login.title}</h1>
                    <p className={cn(
                        "font-medium italic tracking-wide",
                        theme === "dark" ? "text-white/70" : "text-black/60"
                    )}>{t.auth.login.subtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className={cn("text-[10px] font-black uppercase tracking-widest ml-1", theme === "dark" ? "text-gray-500" : "text-black/40")}>Email or Phone Number</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={cn(
                                    "w-full border rounded-xl px-12 py-3.5 transition-all font-light focus:outline-none",
                                    theme === "dark"
                                        ? "bg-black/50 border-white/10 text-white focus:border-white/30"
                                        : "bg-white border-black/10 text-black focus:border-black/30"
                                )}
                                placeholder="name@email.com or +91..."
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={cn("text-[10px] font-black uppercase tracking-widest ml-1", theme === "dark" ? "text-gray-500" : "text-black/40")}>{t.auth.login.password}</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={cn(
                                    "w-full border rounded-xl px-12 py-3.5 transition-all font-light focus:outline-none",
                                    theme === "dark"
                                        ? "bg-black/50 border-white/10 text-white focus:border-white/30"
                                        : "bg-white border-black/10 text-black focus:border-black/30"
                                )}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                            "w-full font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 group disabled:opacity-50 shadow-xl",
                            theme === "dark" ? "bg-white text-black hover:bg-yellow-500" : "bg-black text-white hover:bg-yellow-600"
                        )}
                    >
                        {isLoading ? t.auth.login.consulting : (
                            <>
                                <LogIn className="w-4 h-4" />
                                {t.auth.login.signIn}
                            </>
                        )}
                    </button>
                </form>

                <div className="relative flex items-center gap-4">
                    <div className={cn("flex-1 h-[1px]", theme === "dark" ? "bg-white/10" : "bg-black/10")} />
                    <span className={cn("text-[10px] uppercase font-black tracking-widest", theme === "dark" ? "text-gray-600" : "text-black/30")}>{t.auth.login.secureAccess}</span>
                    <div className={cn("flex-1 h-[1px]", theme === "dark" ? "bg-white/10" : "bg-black/10")} />
                </div>

                <button
                    onClick={() => signIn("google")}
                    className={cn(
                        "w-full flex items-center justify-center gap-3 font-bold py-4 rounded-xl border transition-all uppercase tracking-widest text-[10px]",
                        theme === "dark" ? "bg-white/5 text-white border-white/10 hover:bg-white/10" : "bg-black/5 text-black border-black/10 hover:bg-black/10"
                    )}
                >
                    <Image src="https://www.google.com/favicon.ico" alt="Google" width={16} height={16} className={cn(theme === "dark" ? "grayscale" : "")} />
                    {t.auth.login.google}
                </button>

                <p className={cn(
                    "text-center text-[10px] uppercase tracking-[0.2em] font-black",
                    theme === "dark" ? "text-gray-400" : "text-black/40"
                )}>
                    {t.auth.login.noAccount} <Link href="/signup" className={cn(
                        "transition-all decoration-2 underline-offset-4 hover:underline",
                        theme === "dark" ? "text-white hover:text-yellow-500" : "text-black hover:text-yellow-600"
                    )}>{t.auth.login.signUp}</Link>
                </p>
            </motion.div>
        </main>
    );
}

