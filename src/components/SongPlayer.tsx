"use client";

import { useState, useRef } from "react";
import { Play, Pause, Music, Video, SkipBack, SkipForward } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

interface LyricLine {
    time: number;
    text: string;
}

const FULL_LYRICS: LyricLine[] = [
    { time: 0, text: "Harivarasanam Viswamohanam" },
    { time: 6, text: "Haridadhiswaram Aaradhyapadhukam" },
    { time: 12, text: "Arivimardhanam Nithyanarthanam" },
    { time: 18, text: "Hariharathmajam Devamashraye" },
    { time: 24, text: "Saranam Ayyappa Swamy Saranam Ayyappa" },
    { time: 30, text: "Saranam Ayyappa Swamy Saranam Ayyappa" },
    { time: 36, text: "Pranayasathyakam Praananayakam" },
    { time: 42, text: "Pranathakalpakam Suprabhanjitham" },
    { time: 48, text: "Pranavamanthiram Keerthanapriyam" },
    { time: 54, text: "Hariharathmajam Devamashraye" },
];

export default function SongPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [mode, setMode] = useState<"audio" | "video">("audio");
    const [currentTime, setCurrentTime] = useState(0);
    const { t } = useLanguage();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const togglePlay = () => {
        if (!isPlaying) {
            timerRef.current = setInterval(() => {
                setCurrentTime(prev => (prev >= 60 ? 0 : prev + 1));
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        setIsPlaying(!isPlaying);
    };

    const seekTo = (time: number) => {
        setCurrentTime(time);
        if (!isPlaying) togglePlay();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
            {/* Player Section */}
            <div className="space-y-6">
                <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 relative group shadow-2xl shadow-yellow-500/10">
                    {mode === "video" ? (
                        <div className="w-full h-full">
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/Esw_cAsNscg?autoplay=${isPlaying ? 1 : 0}&start=${currentTime}`}
                                title="Harivarasanam"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-black relative">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.05),transparent_70%)]" />
                            <Music className="w-20 h-20 text-white/10 animate-pulse" />
                            <div className="mt-6 text-center z-10">
                                <h3 className="text-2xl font-bold text-white tracking-widest">HARIVARASANAM</h3>
                                <p className="text-sm text-yellow-500/70 mt-1 uppercase tracking-tighter">Traditional Devotional</p>
                            </div>
                        </div>
                    )}

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/5 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
                            animate={{ width: `${(currentTime / 60) * 100}%` }}
                            transition={{ ease: "linear", duration: 1 }}
                        />
                    </div>

                    {/* Controls Overlay (Only for visual feedback, iframe has its own) */}
                    {mode === "audio" && (
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 backdrop-blur-[2px]">
                            <button className="p-2 text-white hover:text-yellow-400 transition-colors"><SkipBack className="w-8 h-8" /></button>
                            <button onClick={togglePlay} className="p-5 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-xl">
                                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current px-1" />}
                            </button>
                            <button className="p-2 text-white hover:text-yellow-400 transition-colors"><SkipForward className="w-8 h-8" /></button>
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-6 p-1 bg-white/5 rounded-full w-fit mx-auto border border-white/10">
                    <button
                        onClick={() => setMode("audio")}
                        className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-sm font-semibold transition-all ${mode === "audio" ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"}`}
                    >
                        <Music className="w-4 h-4" /> {t.songs.audio}
                    </button>
                    <button
                        onClick={() => setMode("video")}
                        className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-sm font-semibold transition-all ${mode === "video" ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"}`}
                    >
                        <Video className="w-4 h-4" /> {t.songs.video}
                    </button>
                </div>
            </div>

            {/* Lyrics Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-[550px] overflow-y-auto custom-scrollbar backdrop-blur-md">
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-black/40 py-2 backdrop-blur-md z-10 border-b border-white/5">
                    <h3 className="text-xl font-bold text-white tracking-widest uppercase">{t.songs.lyrics}</h3>
                    <span className="text-xs font-mono text-yellow-500/50">{t.songs.syncActive}</span>
                </div>
                <div className="space-y-8">
                    {FULL_LYRICS.map((line, index) => {
                        const isActive = currentTime >= line.time && currentTime < (FULL_LYRICS[index + 1]?.time || 60);
                        return (
                            <motion.div
                                key={index}
                                onClick={() => seekTo(line.time)}
                                className={`group p-4 rounded-xl cursor-pointer transition-all duration-500 ${isActive ? "bg-white/[0.08] border-l-4 border-yellow-500 shadow-lg" : "hover:bg-white/[0.03] border-l-4 border-transparent"}`}
                                animate={{ x: isActive ? 10 : 0 }}
                            >
                                <p className={`text-xl font-serif leading-relaxed ${isActive ? "text-yellow-400" : "text-gray-400 group-hover:text-gray-200"}`}>
                                    {line.text}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
                                        {t.songs.verse} {index + 1}
                                    </span>
                                    <span className="text-xs text-zinc-700 font-mono">
                                        {Math.floor(line.time / 60)}:{String(line.time % 60).padStart(2, '0')}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
