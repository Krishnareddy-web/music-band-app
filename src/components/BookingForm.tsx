"use client";

import { useEffect, useState } from "react";
import { useBookingStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CreditCard, CheckCircle, Music, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";
import { SONGS } from "@/lib/songs";

export default function BookingForm() {
    const { isBooking, timeLeft, decrementTimer, resetBooking } = useBookingStore();
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", eventLocation: "" });
    const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);
    const [couponError, setCouponError] = useState("");

    const BASE_PRICE = 5000;

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isBooking) {
            interval = setInterval(() => {
                decrementTimer();
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isBooking, decrementTimer]);

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleApplyCoupon = () => {
        if (coupon.toUpperCase() === "SWAMI10") {
            setDiscount(BASE_PRICE * 0.1);
            setCouponError("");
        } else {
            setCouponError(t.booking.invalidCoupon);
            setDiscount(0);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2); // Move to songs
    };

    const toggleSong = (songId: string) => {
        if (selectedSongs.includes(songId)) {
            setSelectedSongs((prev: string[]) => prev.filter((id: string) => id !== songId));
        } else if (selectedSongs.length < 5) {
            setSelectedSongs((prev: string[]) => [...prev, songId]);
        }
    };

    const handlePayment = async () => {
        // Simulate payment processing
        setTimeout(async () => {
            const songTitles = selectedSongs.map(id => SONGS.find(s => s.id === id)?.title || id);
            const success = await useBookingStore.getState().confirmBooking(songTitles, {
                address: formData.address,
                location: formData.eventLocation,
                phone: formData.phone
            });
            if (success) {
                setStep(4); // Success
                setTimeout(() => {
                    resetBooking();
                }, 4000);
            } else {
                alert(t.booking.failed);
                setStep(1);
            }
        }, 1500);
    };

    if (!isBooking) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md relative overflow-hidden"
            >
                {/* Timer Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800">
                    <motion.div
                        className="h-full bg-yellow-500"
                        initial={{ width: "100%" }}
                        animate={{ width: `${(timeLeft / (8 * 60)) * 100}%` }}
                        transition={{ ease: "linear", duration: 1 }}
                    />
                </div>

                <div className="flex justify-between items-center mb-6 mt-2">
                    <h2 className="text-xl font-bold text-white">{t.booking.holdTitle}</h2>
                    <div className="flex items-center gap-2 text-yellow-500 font-mono bg-yellow-500/10 px-3 py-1 rounded-full text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.form
                            key="step1"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">{t.contact.name}</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-white/50 outline-none"
                                    placeholder={t.contact.name}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">{t.contact.email}</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-white/50 outline-none text-sm"
                                        placeholder="devotee@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Phone</label>
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-white/50 outline-none text-sm"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Your Address</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-white/50 outline-none resize-none text-sm"
                                    placeholder="Enter your complete address"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Event Location</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.eventLocation}
                                    onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-white/50 outline-none text-sm"
                                    placeholder="Where should the band perform?"
                                />
                            </div>
                            <button type="submit" className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-gray-200 mt-4 uppercase tracking-widest text-xs">
                                {t.booking.proceed}
                            </button>
                        </motion.form>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-between items-end mb-2">
                                <h3 className="text-white font-bold uppercase tracking-widest text-sm">Select Fav Songs (Max 5)</h3>
                                <span className={cn(
                                    "text-xs font-mono",
                                    selectedSongs.length === 5 ? "text-green-500" : "text-yellow-500"
                                )}>{selectedSongs.length}/5 Selected</span>
                            </div>

                            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {SONGS.map(song => (
                                    <button
                                        key={song.id}
                                        onClick={() => toggleSong(song.id)}
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                                            selectedSongs.includes(song.id)
                                                ? "bg-yellow-500/10 border-yellow-500 text-white"
                                                : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Music size={14} className={selectedSongs.includes(song.id) ? "text-yellow-500" : "text-gray-600"} />
                                            <div>
                                                <p className="text-sm font-bold uppercase tracking-tight">{song.title}</p>
                                                <p className="text-[10px] opacity-40 uppercase">{song.category}</p>
                                            </div>
                                        </div>
                                        {selectedSongs.includes(song.id) && <CheckCircle size={14} className="text-yellow-500" />}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setStep(3)}
                                disabled={selectedSongs.length === 0}
                                className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-gray-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
                            >
                                Continue to Payment
                            </button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                                <p className="text-sm text-gray-400">{t.booking.amount}</p>
                                <div className="flex items-baseline justify-center gap-2">
                                    {discount > 0 && (
                                        <span className="text-lg text-gray-500 line-through">₹ {BASE_PRICE.toLocaleString()}</span>
                                    )}
                                    <span className="text-3xl font-bold text-white">₹ {(BASE_PRICE - discount).toLocaleString()}</span>
                                </div>
                                {discount > 0 && <p className="text-xs text-green-400 mt-1">{t.booking.discount}</p>}
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/10">
                                    <p className="text-[10px] uppercase text-yellow-500 font-black mb-2 tracking-widest">Included Favorites</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSongs.map(id => (
                                            <span key={id} className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-gray-300">
                                                {SONGS.find(s => s.id === id)?.title}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs text-gray-500 uppercase tracking-widest">{t.booking.coupon}</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={coupon}
                                            onChange={(e) => setCoupon(e.target.value)}
                                            className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-white/30 text-sm"
                                            placeholder="SWAMI10"
                                        />
                                        <button
                                            onClick={handleApplyCoupon}
                                            className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-colors"
                                        >
                                            {t.booking.apply}
                                        </button>
                                    </div>
                                    {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                className="w-full bg-green-600 text-white font-black py-4 rounded-xl hover:bg-green-500 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                            >
                                <CreditCard className="w-5 h-5" />
                                {t.booking.payNow}
                            </button>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center justify-center py-8 space-y-4 text-center"
                        >
                            <CheckCircle className="w-16 h-16 text-green-500" />
                            <h3 className="text-2xl font-black text-white uppercase tracking-widest">{t.booking.confirmed}</h3>
                            <p className="text-gray-400 font-medium italic">{t.booking.blessMessage}</p>
                            <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] pt-4 font-bold">Booking added to your profile</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={resetBooking}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                >
                    ✕
                </button>
            </motion.div>
        </div>
    );
}
