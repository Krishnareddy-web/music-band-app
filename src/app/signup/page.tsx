"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import Navigation from "@/components/Navigation";
import { otpService } from "@/lib/otp-service";
import { ShieldCheck, Phone, Mail, Lock, User, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function SignupPage() {
    const router = useRouter();
    const [method, setMethod] = useState<"choice" | "email" | "phone">("choice");
    const [step, setStep] = useState(1); // 1: Input, 2: OTP, 3: Password
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const { t } = useLanguage();
    const { theme } = useTheme();

    // Password validation state
    const [passwordValidations, setPasswordValidations] = useState({
        length: false,
        uppercase: false,
        number: false,
        special: false
    });

    useEffect(() => {
        setPasswordValidations({
            length: formData.password.length >= 8,
            uppercase: /[A-Z]/.test(formData.password),
            number: /[0-9]/.test(formData.password),
            special: /[^A-Za-z0-9]/.test(formData.password)
        });
    }, [formData.password]);

    const isPasswordStrong = Object.values(passwordValidations).every(Boolean);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        const identifier = method === "email" ? formData.email : formData.phone;
        const res = await otpService.sendOTP(identifier, method as any);
        if (res.success) {
            setStep(2);
            setOtp("");
            setMessage(res.message || "");
        } else {
            setError(res.message);
        }
        setIsLoading(false);
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        const identifier = method === "email" ? formData.email : formData.phone;
        const res = await otpService.verifyOTP(identifier, otp, method as any);
        if (res.success) {
            setStep(3);
            setOtp("");
            setMessage(`${method === "email" ? "Email" : "Phone"} verified successfully!`);
        } else {
            setError(res.message || "Invalid OTP");
        }
        setIsLoading(false);
    };

    const handleFinalSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isPasswordStrong) return;

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: method === "email" ? formData.email : null,
                    phone: method === "phone" ? formData.phone : null,
                    password: formData.password,
                    [method === "email" ? "emailVerified" : "phoneVerified"]: true
                })
            });

            const data = await res.json();

            if (res.ok) {
                otpService.clearVerifications(formData.email, formData.phone);
                router.push(`/login?message=${encodeURIComponent("Account created securely. Please log in.")}`);
            } else {
                setError(data.error || "Signup failed");
            }
        } catch (err) {
            setError("Something went wrong");
        }

        setIsLoading(false);
    };

    const renderStep = () => {
        if (method === "choice") {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                >
                    <button
                        onClick={() => signIn("google")}
                        className={cn(
                            "w-full flex items-center justify-center gap-3 font-bold py-4 rounded-xl border transition-all uppercase tracking-widest text-xs",
                            theme === "dark" ? "bg-white/5 text-white border-white/10 hover:bg-white/10" : "bg-black/5 text-black border-black/10 hover:bg-black/10 shadow-sm"
                        )}
                    >
                        <Image src="https://www.google.com/favicon.ico" alt="Google" width={20} height={20} />
                        Continue with Google
                    </button>

                    <div className="relative flex items-center gap-4 py-2">
                        <div className={cn("flex-1 h-[1px]", theme === "dark" ? "bg-white/10" : "bg-black/10")} />
                        <span className={cn("text-[10px] uppercase font-black tracking-widest px-2", theme === "dark" ? "text-gray-600" : "text-black/30")}>Or use traditional ways</span>
                        <div className={cn("flex-1 h-[1px]", theme === "dark" ? "bg-white/10" : "bg-black/10")} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setMethod("email")}
                            className={cn(
                                "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all hover:scale-[1.02]",
                                theme === "dark" ? "bg-white/5 border-white/10 hover:border-white/30" : "bg-white border-black/10 hover:border-black/30 shadow-md"
                            )}
                        >
                            <Mail className="w-8 h-8 text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Via Email</span>
                        </button>
                        <button
                            onClick={() => setMethod("phone")}
                            className={cn(
                                "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all hover:scale-[1.02]",
                                theme === "dark" ? "bg-white/5 border-white/10 hover:border-white/30" : "bg-white border-black/10 hover:border-black/30 shadow-md"
                            )}
                        >
                            <Phone className="w-8 h-8 text-green-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Via Phone</span>
                        </button>
                    </div>
                </motion.div>
            );
        }

        switch (step) {
            case 1:
                return (
                    <motion.form
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        onSubmit={handleSendOTP} className="space-y-4"
                    >
                        <button
                            type="button" onClick={() => setMethod("choice")}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#d4af37] transition-colors mb-4"
                        >
                            <ArrowLeft size={14} /> Back to choices
                        </button>

                        <div className="space-y-2">
                            <label className={cn("text-xs font-bold uppercase tracking-wider flex items-center gap-2", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
                                <User size={14} /> Full Name
                            </label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={cn(
                                    "w-full border rounded-xl px-4 py-3 transition-all outline-none font-medium",
                                    theme === "dark"
                                        ? "bg-white/5 border-white/10 text-white focus:border-[#d4af37]/50"
                                        : "bg-gray-50 border-black/10 text-black focus:border-[#d4af37]/50"
                                )}
                                placeholder="Ayyappa Devotee"
                            />
                        </div>

                        {method === "email" ? (
                            <div className="space-y-2">
                                <label className={cn("text-xs font-bold uppercase tracking-wider flex items-center gap-2", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
                                    <Mail size={14} /> Email Address
                                </label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={cn(
                                        "w-full border rounded-xl px-4 py-3 transition-all outline-none font-medium",
                                        theme === "dark"
                                            ? "bg-white/5 border-white/10 text-white focus:border-[#d4af37]/50"
                                            : "bg-gray-50 border-black/10 text-black focus:border-[#d4af37]/50"
                                    )}
                                    placeholder="devotee@example.com"
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className={cn("text-xs font-bold uppercase tracking-wider flex items-center gap-2", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
                                    <Phone size={14} /> Phone Number
                                </label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className={cn(
                                        "w-full border rounded-xl px-4 py-3 transition-all outline-none font-medium",
                                        theme === "dark"
                                            ? "bg-white/5 border-white/10 text-white focus:border-[#d4af37]/50"
                                            : "bg-gray-50 border-black/10 text-black focus:border-[#d4af37]/50"
                                    )}
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                "w-full font-black py-4 rounded-xl transition-all disabled:opacity-50 shadow-xl uppercase tracking-widest text-xs mt-4",
                                theme === "dark" ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
                            )}
                        >
                            {isLoading ? "..." : `Verify ${method === "email" ? "Email" : "Phone"}`}
                        </button>
                    </motion.form>
                );
            case 2:
                return (
                    <motion.form
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        onSubmit={handleVerify} className="space-y-6"
                    >
                        <button
                            type="button" onClick={() => setStep(1)}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#d4af37] transition-colors"
                        >
                            <ArrowLeft size={14} /> Edit details
                        </button>

                        <div className="flex flex-col items-center space-y-4">
                            <div className="p-4 bg-yellow-500/10 rounded-full">
                                <ShieldCheck className="w-8 h-8 text-yellow-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold uppercase tracking-widest mb-1">Verify {method === "email" ? "Email" : "Mobile"}</p>
                                <p className="text-xs text-gray-500">{method === "email" ? formData.email : formData.phone}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <input
                                required
                                maxLength={6}
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className={cn(
                                    "w-full rounded-xl px-4 py-4 text-center text-3xl font-black tracking-[0.5em] outline-none border-2",
                                    theme === "dark" ? "bg-black/50 border-white/10 text-white focus:border-white/30" : "bg-white border-black/10 text-black focus:border-black/30"
                                )}
                                placeholder="000000"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#d4af37] text-black font-black py-4 rounded-xl hover:bg-[#c4a132] transition-colors disabled:opacity-50 uppercase tracking-widest text-xs"
                        >
                            {isLoading ? "..." : "Verify OTP"}
                        </button>
                    </motion.form>
                );
            case 3:
                return (
                    <motion.form
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        onSubmit={handleFinalSignup} className="space-y-6"
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className={cn("text-xs font-bold uppercase tracking-wider flex items-center gap-2", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
                                    <Lock size={14} /> Create Password
                                </label>
                                <input
                                    required
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={cn(
                                        "w-full border rounded-xl px-4 py-3 transition-all outline-none font-medium",
                                        theme === "dark"
                                            ? "bg-white/5 border-white/10 text-white focus:border-[#d4af37]/50"
                                            : "bg-gray-50 border-black/10 text-black focus:border-[#d4af37]/50"
                                    )}
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2 p-4 rounded-xl bg-black/5 border border-white/5">
                                <div className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter", passwordValidations.length ? "text-green-500" : "text-gray-500")}>
                                    {passwordValidations.length ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />} Min 8 Chars
                                </div>
                                <div className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter", passwordValidations.uppercase ? "text-green-500" : "text-gray-500")}>
                                    {passwordValidations.uppercase ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />} 1 Uppercase
                                </div>
                                <div className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter", passwordValidations.number ? "text-green-500" : "text-gray-500")}>
                                    {passwordValidations.number ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />} 1 Number
                                </div>
                                <div className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter", passwordValidations.special ? "text-green-500" : "text-gray-500")}>
                                    {passwordValidations.special ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />} 1 Special
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isPasswordStrong}
                            className={cn(
                                "w-full font-black py-4 rounded-xl transition-all disabled:opacity-50 shadow-xl uppercase tracking-widest text-xs",
                                theme === "dark" ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
                            )}
                        >
                            {isLoading ? "..." : "Complete Signup"}
                        </button>
                    </motion.form>
                );
            default:
                return null;
        }
    };

    return (
        <main className={cn(
            "min-h-screen flex flex-col items-center pt-32 pb-20 px-4 transition-colors duration-500",
            theme === "dark" ? "bg-transparent text-white" : "bg-gray-50 text-black"
        )}>
            <Navigation />

            <div className={cn(
                "w-full max-w-md border p-1 rounded-3xl backdrop-blur-md relative overflow-hidden transition-all duration-500",
                theme === "dark" ? "bg-black/40 border-white/10" : "bg-white border-black/5 shadow-2xl"
            )}>
                {/* Progress Bar (only if not in choice method) */}
                {method !== "choice" && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
                        <motion.div
                            className="h-full bg-[#d4af37]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                )}

                <div className="p-8 space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className={cn(
                            "text-3xl font-black uppercase tracking-[0.2em] leading-tight",
                            theme === "dark" ? "text-white" : "text-black"
                        )}>Join the Divine</h1>
                        <p className={cn("text-xs uppercase tracking-widest font-bold", theme === "dark" ? "text-gray-500" : "text-black/40")}>
                            {method === "choice" ? "Choose your registration path" : `Signup with ${method === "email" ? "Email" : "Phone"}`}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>

                    <div className="space-y-4">
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20"
                            >
                                {error}
                            </motion.p>
                        )}
                        {message && (
                            <p className="text-[#d4af37] text-[10px] font-black uppercase tracking-widest text-center">{message}</p>
                        )}

                        <p className={cn(
                            "text-center text-[10px] font-black uppercase tracking-widest",
                            theme === "dark" ? "text-gray-400" : "text-black/40"
                        )}>
                            Already have an account? <Link href="/login" className={cn(
                                "hover:text-[#d4af37] transition-colors underline-offset-4 hover:underline",
                                theme === "dark" ? "text-white" : "text-black"
                            )}>Sign In Here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
