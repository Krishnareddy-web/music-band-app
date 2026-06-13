"use client";

import { useState } from "react";
import { Lock, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentGate({ children }: { children: React.ReactNode }) {
    const [hasPaid, setHasPaid] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId: "song_book_01", amount: 100 })
            });

            if (res.ok) {
                setHasPaid(true);
            } else {
                alert("Payment verification failed. Please try again.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("An error occurred during payment processing.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (hasPaid) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm max-w-2xl mx-auto mt-12">
            <div className="p-4 bg-white/10 rounded-full">
                <Lock className="w-12 h-12 text-yellow-500" />
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Unlock Digital Song Books</h2>
                <p className="text-gray-400 max-w-md mx-auto">
                    Get exclusive access to high-quality audio, video, and synchronized lyrics for all our devotional songs.
                </p>
            </div>

            <div className="py-4 px-8 bg-black/50 rounded-lg border border-white/5">
                <span className="text-3xl font-bold text-white">₹ 100</span>
                <span className="text-sm text-gray-500 block">One-time payment</span>
            </div>

            <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-50"
            >
                {isProcessing ? (
                    "Processing..."
                ) : (
                    <>
                        <CreditCard className="w-5 h-5" />
                        Pay Now & Unlock
                    </>
                )}
            </button>

            <p className="text-xs text-gray-500">
                Secure payment powered by DevotionalPay
            </p>
        </div>
    );
}
