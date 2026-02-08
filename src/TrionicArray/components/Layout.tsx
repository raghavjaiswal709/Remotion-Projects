import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random, interpolate } from "remotion";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    // Generate static stars/particles
    const particles = useMemo(() => {
        return new Array(50).fill(0).map((_, i) => ({
            x: random(i) * width,
            y: random(i + 100) * height,
            size: random(i + 200) * 3 + 1,
            opacity: random(i + 300) * 0.5 + 0.1,
            speed: random(i + 400) * 0.5 + 0.1,
        }));
    }, [width, height]);

    return (
        <AbsoluteFill className="bg-zinc-950 overflow-hidden">
            {/* 1. Base Gradient Background */}
            <AbsoluteFill className="bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black" />

            {/* 2. Animated Grid (Cyberpunk floor) */}
            <AbsoluteFill
                style={{
                    perspective: "1000px",
                    transformStyle: "preserve-3d"
                }}
            >
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px),
                                          linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                        transform: `rotateX(60deg) translateY(${frame % 60}px) scale(2)`,
                        transformOrigin: "center top",
                        height: "200%",
                        width: "100%",
                        maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)"
                    }}
                />
            </AbsoluteFill>

            {/* 3. Floating Particles */}
            {particles.map((p, i) => {
                const yPos = (p.y - frame * p.speed) % height;
                return (
                    <div
                        key={i}
                        className="absolute rounded-full bg-blue-500 blur-[1px]"
                        style={{
                            left: p.x,
                            top: yPos < 0 ? yPos + height : yPos,
                            width: p.size,
                            height: p.size,
                            opacity: p.opacity,
                        }}
                    />
                );
            })}

            {/* 4. Scanlines / Noise Overlay */}
            <AbsoluteFill
                className="pointer-events-none opacity-5 mix-blend-overlay"
                style={{
                    backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
                    filter: "contrast(150%) brightness(100%)",
                }}
            />

            {/* 5. Vignette */}
            <AbsoluteFill className="bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-60" />

            {/* Content Container (Safe Area) */}
            <AbsoluteFill className="p-12 flex flex-col items-center justify-center">
                {children}
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
