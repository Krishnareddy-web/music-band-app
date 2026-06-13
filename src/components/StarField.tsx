"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import { useTheme } from "@/lib/ThemeContext";
import * as THREE from "three";

function RotatingStars() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
            groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.02;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Layer 1: Distant dense stars */}
            <Stars
                radius={100}
                depth={50}
                count={typeof window !== 'undefined' && window.innerWidth < 768 ? 2000 : 5000}
                factor={4}
                saturation={0}
                fade
                speed={1}
            />
            {/* Layer 2: Closer, larger glowing stars */}
            <Stars
                radius={50}
                depth={50}
                count={typeof window !== 'undefined' && window.innerWidth < 768 ? 400 : 1000}
                factor={7}
                saturation={0}
                fade
                speed={2}
            />
            {/* Layer 3: Occasional bright focal points */}
            <Stars
                radius={150}
                depth={100}
                count={200}
                factor={10}
                saturation={0.5}
                fade
                speed={0.5}
            />
        </group>
    );
}

export default function StarField() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted || theme !== "dark") return null;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000 bg-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
            <Canvas
                camera={{ position: [0, 0, 1] }}
                dpr={[1, 1.2]}
                gl={{ antialias: false, powerPreference: "high-performance" }}
            >
                <Suspense fallback={null}>
                    <RotatingStars />
                </Suspense>
            </Canvas>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        </div>
    );
}
