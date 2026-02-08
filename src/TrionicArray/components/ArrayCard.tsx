import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface ArrayCardProps {
    value: number;
    index: number;
    state?: "default" | "active" | "scanned" | "discarded" | "found";
    label?: string; // e.g. "L", "R", "M"
    highlightColor?: string;
    scale?: number;
    opacity?: number;
}

export const ArrayCard: React.FC<ArrayCardProps> = ({
    value,
    index,
    state = "default",
    label,
    highlightColor,
    scale = 1,
    opacity = 1
}) => {

    // State-based styles using Tailwind & inline styles for dynamic values
    const getStyles = () => {
        switch (state) {
            case "found":
                return "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.4)]";
            case "scanned":
                return "bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]";
            case "active":
                return "bg-blue-500/20 border-blue-400 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]";
            case "discarded":
                return "bg-zinc-900/10 border-zinc-800 text-zinc-700 opacity-30 grayscale";
            default: // default
                return "bg-zinc-900/40 border-zinc-700 text-zinc-200 backdrop-blur-md";
        }
    };

    const hasLabel = !!label;

    return (
        <div
            className="flex flex-col items-center gap-2"
            style={{
                transform: `scale(${scale})`,
                opacity,
                transition: "all 0.3s ease-out"
            }}
        >
            {/* The Card */}
            <div
                className={`
                    w-20 h-20 rounded-2xl border-2 flex items-center justify-center
                    text-3xl font-bold font-mono relative overflow-hidden
                    ${getStyles()}
                `}
            >
                {/* Inner Shine/Gloss effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

                {value}
            </div>

            {/* Index Label (Below) */}
            <div className="text-zinc-500 font-mono text-sm">
                {index}
            </div>

            {/* Pointer Label (Pulsing) e.g. L, R, M */}
            {hasLabel && (
                <div
                    className="absolute -top-12 flex flex-col items-center animate-bounce"
                    style={{ color: highlightColor || '#fff' }}
                >
                    <span className="text-xl font-bold">{label}</span>
                    <div className="w-0.5 h-4 bg-current" />
                </div>
            )}
        </div>
    );
};
