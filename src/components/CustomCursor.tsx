"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
    const [mounted, setMounted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 300 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            setIsHovered(
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") !== null ||
                target.closest("a") !== null ||
                target.classList.contains("clickable")
            );
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleHover);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleHover);
        };
    }, [cursorX, cursorY, mounted]);

    if (!mounted) return null;

    return (
        <>
            {/* Outer Ring with Glow */}
            <motion.div
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                    left: -20,
                    top: -20,
                }}
                className="fixed pointer-events-none z-[9999] w-10 h-10 rounded-full border border-white/30 mix-blend-difference"
                animate={{
                    scale: isHovered ? 1.5 : 1,
                    borderColor: isHovered ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.3)",
                    boxShadow: isHovered ? "0 0 20px rgba(255, 215, 0, 0.5)" : "0 0 0px rgba(255, 215, 0, 0)",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
            {/* Inner Dot with Pulse */}
            <motion.div
                style={{
                    translateX: cursorX,
                    translateY: cursorY,
                    left: -3,
                    top: -3,
                }}
                className="fixed pointer-events-none z-[9999] w-1.5 h-1.5 bg-white rounded-full mix-blend-difference"
                animate={{
                    scale: isHovered ? 2.5 : 1,
                }}
            />
        </>
    );
}
