"use client";

import Navigation from "@/components/Navigation";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { submitContactForm } from "@/lib/actions/contact";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/ThemeContext";

export default function ContactPage() {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        const result = await submitContactForm(formData);
        setStatus(result);
        setIsPending(false);
        if (result.success) {
            (document.getElementById('contact-form') as HTMLFormElement).reset();
        }
    }

    return (
        <main className={cn(
            "min-h-screen pt-40 pb-12 px-4 md:px-8 transition-colors duration-500",
            theme === "dark" ? "bg-transparent text-white" : "bg-white text-black"
        )}>
            <Navigation />

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <section className="space-y-4">
                        <h1 className={cn(
                            "text-4xl md:text-5xl font-bold py-4 overflow-visible",
                            theme === "dark"
                                ? "bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500"
                                : "text-black"
                        )}>
                            {t.contact.title}
                        </h1>
                        <p className={cn(
                            "text-lg",
                            theme === "dark" ? "text-gray-400" : "text-black/70"
                        )}>
                            {t.contact.subtitle}
                        </p>
                    </section>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className={cn("p-3 rounded-full", theme === "dark" ? "bg-white/5" : "bg-black/5")}>
                                <Mail className={cn("w-5 h-5", theme === "dark" ? "text-white" : "text-black")} />
                            </div>
                            <div>
                                <h3 className={cn("font-medium", theme === "dark" ? "text-white" : "text-black")}>{t.contact.email}</h3>
                                <p className={cn(theme === "dark" ? "text-gray-400" : "text-black/60")}>contact@devotionalband.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className={cn("p-3 rounded-full", theme === "dark" ? "bg-white/5" : "bg-black/5")}>
                                <Phone className={cn("w-5 h-5", theme === "dark" ? "text-white" : "text-black")} />
                            </div>
                            <div>
                                <h3 className={cn("font-medium", theme === "dark" ? "text-white" : "text-black")}>{t.contact.phone}</h3>
                                <p className={cn(theme === "dark" ? "text-gray-400" : "text-black/60")}>+91 98765 43210</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className={cn("p-3 rounded-full", theme === "dark" ? "bg-white/5" : "bg-black/5")}>
                                <MapPin className={cn("w-5 h-5", theme === "dark" ? "text-white" : "text-black")} />
                            </div>
                            <div>
                                <h3 className={cn("font-medium", theme === "dark" ? "text-white" : "text-black")}>Studio</h3>
                                <p className={cn(theme === "dark" ? "text-gray-400" : "text-black/60")}>Divine Sounds Studio,<br />Hyderabad, India</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cn(
                    "border rounded-2xl p-6 md:p-8 transition-colors",
                    theme === "dark" ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                )}>
                    <form id="contact-form" action={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className={cn("text-sm font-medium", theme === "dark" ? "text-gray-300" : "text-gray-700")}>{t.contact.name}</label>
                            <input
                                name="name"
                                type="text"
                                id="name"
                                required
                                className={cn(
                                    "w-full border rounded-lg px-4 py-3 transition-colors focus:outline-none",
                                    theme === "dark"
                                        ? "bg-black/50 border-white/10 text-white focus:border-white/30"
                                        : "bg-white border-black/10 text-black focus:border-black/30"
                                )}
                                placeholder={t.contact.name}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className={cn("text-sm font-medium", theme === "dark" ? "text-gray-300" : "text-gray-700")}>{t.contact.email}</label>
                            <input
                                name="email"
                                type="email"
                                id="email"
                                required
                                className={cn(
                                    "w-full border rounded-lg px-4 py-3 transition-colors focus:outline-none",
                                    theme === "dark"
                                        ? "bg-black/50 border-white/10 text-white focus:border-white/30"
                                        : "bg-white border-black/10 text-black focus:border-black/30"
                                )}
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className={cn("text-sm font-medium", theme === "dark" ? "text-gray-300" : "text-gray-700")}>{t.contact.message}</label>
                            <textarea
                                name="message"
                                id="message"
                                rows={4}
                                required
                                className={cn(
                                    "w-full border rounded-lg px-4 py-3 transition-colors focus:outline-none resize-none",
                                    theme === "dark"
                                        ? "bg-black/50 border-white/10 text-white focus:border-white/30"
                                        : "bg-white border-black/10 text-black focus:border-black/30"
                                )}
                                placeholder={t.contact.subtitle}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className={cn(
                                "w-full font-bold py-3 rounded-lg transition-colors disabled:opacity-50",
                                theme === "dark" ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
                            )}
                        >
                            {isPending ? "..." : t.contact.send}
                        </button>

                        {status && (
                            <p className={cn(
                                "text-center text-sm font-medium p-3 rounded-lg",
                                status.success ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                            )}>
                                {status.message}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </main>
    );
}
