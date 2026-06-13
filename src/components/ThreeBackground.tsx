"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sparkles, Float, useTexture } from "@react-three/drei";
import { Suspense } from "react";
import { useTheme } from "@/lib/ThemeContext";
import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";
import * as THREE from "three";

function DivineScene() {
    const { theme } = useTheme();
    const texture = useTexture("/assets/ayyappa.png");

    return (
        <>
            <ambientLight intensity={theme === "dark" ? 0.2 : 0.6} />
            <pointLight position={[10, 10, 10]} intensity={theme === "dark" ? 2 : 1.5} color="#ffd700" />
            <pointLight position={[-10, -10, -10]} intensity={1} color={theme === "dark" ? "#4444ff" : "#ffffff"} />

            <Sparkles
                count={typeof window !== 'undefined' && window.innerWidth < 768 ? 60 : 150}
                scale={15}
                size={theme === "dark" ? 1.5 : 2}
                speed={0.4}
                opacity={theme === "dark" ? 0.8 : 0.4}
                color={theme === "dark" ? "#ffd700" : "#ffcc00"}
            />

            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Glowing Aura Outer */}
                <mesh position={[0, 0, -1.2]}>
                    <planeGeometry args={[8, 8]} />
                    <meshStandardMaterial
                        transparent
                        opacity={theme === "dark" ? 0.15 : 0.1}
                        color="#ffd700"
                        emissive="#ffd700"
                        emissiveIntensity={theme === "dark" ? 4 : 2}
                    />
                </mesh>

                {/* Glowing Aura Inner */}
                <mesh position={[0, 0, -0.6]}>
                    <planeGeometry args={[5, 5]} />
                    <meshStandardMaterial
                        transparent
                        opacity={theme === "dark" ? 0.3 : 0.2}
                        color="#ffffff"
                        emissive="#ffd700"
                        emissiveIntensity={theme === "dark" ? 6 : 3}
                    />
                </mesh>

                {/* Image Plane */}
                <mesh position={[0, 0, 0.5]}>
                    <planeGeometry args={[4.5, 4.5]} />
                    <meshBasicMaterial map={texture} transparent alphaTest={0.05} />
                </mesh>

                {/* Sacred Geometry Frame */}
                <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
                    <torusGeometry args={[2.8, 0.04, 16, 120]} />
                    <meshStandardMaterial
                        color="#ffd700"
                        emissive="#ffd700"
                        emissiveIntensity={theme === "dark" ? 4 : 2}
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            </Float>
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={typeof window !== 'undefined' && window.innerWidth > 768}
                autoRotateSpeed={0.5}
            />
        </>
    );
}


export default function ThreeBackground() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) {
        return <div className="fixed inset-0 z-0 bg-white" />;
    }

    return (
        <div className={cn("fixed inset-0 z-0 transition-colors duration-1000", theme === "dark" ? "bg-black" : "bg-white")}>
            <Canvas
                camera={{ position: [0, 0, 6], fov: 50 }}
                dpr={[1, 1.5]} // Limit pixel ratio for performance
                gl={{ antialias: false, powerPreference: "high-performance" }}
            >
                <Suspense fallback={null}>
                    <DivineScene />
                </Suspense>
            </Canvas>
            <div className={cn(
                "absolute inset-0 pointer-events-none transition-opacity duration-1000",
                theme === "dark"
                    ? "bg-gradient-to-b from-black/50 via-transparent to-black"
                    : "bg-gradient-to-b from-white/20 via-transparent to-white/40"
            )} />
            <div className={cn(
                "absolute inset-0 pointer-events-none transition-opacity duration-1000",
                theme === "dark"
                    ? "bg-[radial-gradient(circle_at_center,transparent_20%,black_90%)]"
                    : "bg-[radial-gradient(circle_at_center,transparent_40%,white_90%)]"
            )} />
        </div>
    );
}
