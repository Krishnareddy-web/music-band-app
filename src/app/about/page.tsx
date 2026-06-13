"use client";

import Navigation from "@/components/Navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/ThemeContext";
import { cn } from "@/lib/utils";

interface BandMember {
    id: number;
    name: string;
    role: string;
    description: string;
}

const bandMembers: BandMember[] = [
    { id: 1, name: "Arjun Dev", role: "Lead Vocalist", description: "A prodigy in Carnatic music with 15 years of experience in devotional bhajans. His voice resonates with deep spiritual conviction." },
    { id: 2, name: "Karthik Nair", role: "Percussion Master", description: "Specializes in traditional Kerala percussion, bringing rhythmic complexity and raw energy to every performance." },
    { id: 3, name: "Sai Krishna", role: "Harmonium & Melodics", description: "Expert in blending classical scales with contemporary devotional textures, creating a bridge between traditions." },
    { id: 4, name: "Manoj Kumar", role: "Tabla & Rhythm", description: "Trained under legendary masters, his tabla beats provide the heartbeat that drives the ensemble's spiritual journey." },
    { id: 5, name: "Vishnu Prasad", role: "Flautist", description: "His bamboo flute melodies evoke the serene landscapes of Sabarimala, bringing a sense of peace to the audience." },
    { id: 6, name: "Suresh Babu", role: "Vocal Accompanist", description: "A master of vocal harmonies and group chants, ensuring the collective spirit of the band is felt in every note." },
    { id: 7, name: "Ratnam", role: "Dappu Specialist", description: "Carrying forward the ancestral legacy of Dappu art, his performance is a tribute to the roots of folk devotion." },
    { id: 8, name: "Gopal Rao", role: "Ancient Drums", description: "Expert in various traditional drums, his beats connect the modern stage to ancient temple traditions." },
    { id: 9, name: "Shiva Shankar", role: "Cymbals & Taalam", description: "Maintains the sacred tempo with precision, his rhythmic patterns are essential for the meditative flow." },
    { id: 10, name: "Balaji", role: "Mridangam Artist", description: "Brings the disciplined structure of classical percussion to the band's dynamic devotional soundscape." },
    { id: 11, name: "Nandhu", role: "Keys & Ambience", description: "Integrates subtle electronic textures and cinematic pads to enhance the atmospheric depth of our music." },
    { id: 12, name: "Vikram", role: "String Bass", description: "His deep, resonating bass lines provide the grounding foundation that allows our melodies to soar." },
    { id: 13, name: "Sunil", role: "Acoustic Support", description: "Versatile musician providing multi-instrumental support for a richer, fuller ensemble sound." },
    { id: 14, name: "Prashanth", role: "Chant Leader", description: "Leading the call-and-response segments, he engages the audience in a powerful collective experience." },
    { id: 15, name: "Raghav", role: "Choral Director", description: "Ensures the vocal arrangements are perfectly balanced, creating a wall of sound that is both powerful and pure." },
];

export default function AboutPage() {
    const { t } = useLanguage();
    const { theme } = useTheme();

    // Localized member descriptions (showing how it scales)
    const getLocalizedDescription = (memberId: number) => {
        // In a real app, this would be in translations.ts
        // For this demo, we use the core descriptions with a fallback
        return bandMembers.find(m => m.id === memberId)?.description;
    };

    return (
        <main className={cn(
            "min-h-screen pt-40 pb-12 px-4 md:px-8 transition-colors duration-500",
            theme === "dark" ? "bg-transparent text-white" : "bg-white text-black"
        )}>
            <Navigation />

            <div className="max-w-7xl mx-auto space-y-12">
                <section className="text-center space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "text-4xl md:text-6xl font-black uppercase py-4 overflow-visible",
                            theme === "dark"
                                ? "bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500"
                                : "text-black"
                        )}
                    >
                        {t.about.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={cn(
                            "max-w-2xl mx-auto text-lg font-light",
                            theme === "dark" ? "text-gray-400" : "text-black/70"
                        )}
                    >
                        {t.about.subtitle}
                    </motion.p>
                </section>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {bandMembers.map((member, index) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                "group relative border rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl",
                                theme === "dark"
                                    ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 hover:shadow-white/5"
                                    : "bg-black/5 border-black/10 hover:bg-black/10 hover:border-black/30 hover:shadow-black/5"
                            )}
                        >
                            <div className={cn(
                                "aspect-[4/5] w-full flex items-center justify-center relative transition-colors",
                                theme === "dark" ? "bg-neutral-950 group-hover:bg-black" : "bg-neutral-100 group-hover:bg-neutral-200"
                            )}>
                                <span className={cn(
                                    "text-6xl font-black tracking-tighter transition-all duration-700",
                                    theme === "dark"
                                        ? "text-neutral-800 opacity-10 group-hover:opacity-100 group-hover:text-yellow-500/10"
                                        : "text-neutral-300 opacity-20 group-hover:opacity-100 group-hover:text-yellow-600/10"
                                )}>
                                    {member.id.toString().padStart(2, '0')}
                                </span>
                                <div className={cn(
                                    "absolute inset-0 opacity-60",
                                    theme === "dark" ? "bg-gradient-to-t from-black via-transparent to-transparent" : "bg-gradient-to-t from-white via-transparent to-transparent"
                                )} />
                            </div>
                            <div className="p-5 relative">
                                <h3 className={cn(
                                    "text-lg font-bold transition-colors uppercase tracking-tight",
                                    theme === "dark" ? "text-white group-hover:text-yellow-500" : "text-black group-hover:text-yellow-600"
                                )}>
                                    {member.name}
                                </h3>
                                <p className={cn(
                                    "text-[10px] tracking-[0.2em] font-black uppercase mt-1",
                                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                                )}>
                                    {member.role}
                                </p>
                                <p className={cn(
                                    "text-sm mt-4 line-clamp-2 font-light leading-relaxed group-hover:line-clamp-none transition-all duration-300",
                                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                                )}>
                                    {getLocalizedDescription(member.id)}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}

