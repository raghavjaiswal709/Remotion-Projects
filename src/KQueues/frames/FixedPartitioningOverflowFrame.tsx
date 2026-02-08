import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    AlertOctagon,
    Ban,
    BatteryWarning,
    Battery,
    ArrowRight,
    XCircle,
    Ghost
} from 'lucide-react';

const FixedPartitioningOverflowFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // --- Helpers ---
    const createSpring = (delay: number, config?: { stiffness?: number; damping?: number }) => {
        return spring({
            frame: frame - delay,
            fps,
            config: config || { stiffness: 120, damping: 12 },
        });
    };

    // --- Animations ---

    // 1. Scene Setup
    const containerOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
    const arrayEnter = createSpring(10);
    const arrayScale = interpolate(arrayEnter, [0, 1], [0.9, 1]);

    // 2. Filling Q0 (The "Full" Queue)
    const item1 = createSpring(25);
    const item2 = createSpring(30);
    const item3 = createSpring(35);
    const item4 = createSpring(40); // The last valid spot

    // 3. The Overflow Event
    const overflowItem = createSpring(60, { stiffness: 60, damping: 8 });
    const overflowX = interpolate(overflowItem, [0, 1], [-50, 0]); // Moves in
    const overflowOpacity = interpolate(frame, [60, 65], [0, 1], { extrapolateRight: 'clamp' });

    // The "Crash" shake effect
    const crashTrigger = frame > 75 ? 1 : 0;
    const shake = interpolate(
        Math.sin((frame - 75) * 0.8) * crashTrigger,
        [-1, 1],
        [-3, 3]
    );
    // Stop shaking after a bit
    const effectiveShake = frame > 100 ? 0 : shake;

    // 4. The Wall (Divider) Highlight
    const wallPulse = interpolate(frame, [75, 85], [1, 1.5], { extrapolateRight: 'clamp' });
    const wallColorOpacity = interpolate(frame, [75, 80], [0, 1], { extrapolateRight: 'clamp' });

    // 5. The Empty Space Reveal
    const emptyReveal = createSpring(90);
    const emptyScale = interpolate(emptyReveal, [0, 1], [0.8, 1]);
    const emptyOpacity = interpolate(frame, [90, 100], [0, 1], { extrapolateRight: 'clamp' });

    // 6. Labels/Alerts
    const alertEnter = createSpring(110);
    const alertY = interpolate(alertEnter, [0, 1], [20, 0]);


    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div
                style={{ opacity: containerOpacity }}
                className="w-full max-w-5xl space-y-16"
            >
                {/* Header */}
                <div className="text-center space-y-4">
                    <h2 className="text-6xl font-black uppercase tracking-tight text-zinc-700">
                        The <span className="text-red-500">Consequence</span>
                    </h2>
                </div>

                {/* THE ARRAY VISUALIZATION */}
                <div
                    style={{ transform: `scale(${arrayScale})` }}
                    className="relative w-full"
                >
                    {/* Main Container */}
                    <div className="relative h-64 w-full bg-zinc-900/50 rounded-3xl border-4 border-zinc-800 flex overflow-hidden shadow-2xl">

                        {/* --- LEFT SIDE: Q0 (OVERFLOWING) --- */}
                        <div
                            style={{ transform: `translateX(${effectiveShake}px)` }}
                            className="w-1/4 h-full relative border-r-4 border-red-500/50 bg-red-900/10 flex flex-col justify-end p-4"
                        >
                            {/* Header */}
                            <div className="absolute top-4 left-0 w-full text-center">
                                <span className="text-xl font-black text-red-500 uppercase tracking-widest">Q0 (Full)</span>
                            </div>

                            {/* Stacked Items */}
                            <div className="flex flex-col-reverse gap-2 h-full justify-end pb-2">
                                {/* The Overflowing Item (Trying to enter) */}
                                <div
                                    style={{
                                        opacity: overflowOpacity,
                                        transform: `translateY(${overflowX * -1}px) rotate(${overflowX}deg)` // Creating a bounce/reject effect
                                    }}
                                    className="h-12 w-full bg-red-500 rounded-lg border-2 border-white flex items-center justify-center relative z-20 shadow-[0_0_20px_rgba(239,68,68,0.6)]"
                                >
                                    <AlertOctagon size={24} className="text-white fill-red-600" />
                                </div>

                                {/* Filled Items */}
                                <div style={{ transform: `scale(${interpolate(item4, [0, 1], [0, 1])})` }} className="h-10 w-full bg-red-500/80 rounded border border-red-400/50" />
                                <div style={{ transform: `scale(${interpolate(item3, [0, 1], [0, 1])})` }} className="h-10 w-full bg-red-500/80 rounded border border-red-400/50" />
                                <div style={{ transform: `scale(${interpolate(item2, [0, 1], [0, 1])})` }} className="h-10 w-full bg-red-500/80 rounded border border-red-400/50" />
                                <div style={{ transform: `scale(${interpolate(item1, [0, 1], [0, 1])})` }} className="h-10 w-full bg-red-500/80 rounded border border-red-400/50" />
                            </div>

                            {/* The "Hit Wall" Effect */}
                            <div
                                style={{ opacity: wallColorOpacity }}
                                className="absolute right-0 top-0 h-full w-1 bg-red-500 shadow-[0_0_30px_rgba(239,68,68,1)]"
                            />
                        </div>

                        {/* --- RIGHT SIDE: Q1, Q2, Q3 (EMPTY) --- */}
                        <div className="flex-1 flex relative bg-zinc-950/30">

                            {/* Q1: The Irony (Directly adjacent) */}
                            <div className="flex-1 border-r-2 border-dashed border-zinc-700 relative flex items-center justify-center">
                                <div
                                    style={{
                                        opacity: emptyOpacity,
                                        transform: `scale(${emptyScale})`
                                    }}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <Ghost size={48} className="text-emerald-500/30" />
                                    <span className="text-2xl font-black text-emerald-500/30 tracking-[0.3em]">EMPTY</span>
                                    <span className="px-3 py-1 bg-emerald-500/10 rounded text-xs font-mono text-emerald-400">0/5 Used</span>
                                </div>
                            </div>

                            {/* Q2 */}
                            <div className="flex-1 border-r-2 border-dashed border-zinc-700 relative flex items-center justify-center opacity-50">
                                <span className="text-xl font-bold text-zinc-700 tracking-widest">UNUSED</span>
                            </div>

                            {/* Q3 */}
                            <div className="flex-1 relative flex items-center justify-center opacity-50">
                                <span className="text-xl font-bold text-zinc-700 tracking-widest">UNUSED</span>
                            </div>
                        </div>

                        {/* The "Blocking" Interaction */}
                        <div
                            style={{ opacity: wallColorOpacity }}
                            className="absolute left-[25%] top-1/2 -translate-y-1/2 -translate-x-1/2 z-30"
                        >
                            <div className="bg-zinc-900 rounded-full p-2 border-2 border-red-500">
                                <Ban size={32} className="text-red-500" />
                            </div>
                        </div>
                    </div>

                    {/* Mathematical/Logical Label */}
                    <div className="mt-4 flex justify-between font-mono text-xs text-zinc-500">
                        <div className="w-1/4 text-center text-red-400 font-bold">Index = Max (Limit Reached)</div>
                        <div className="flex-1 text-center text-emerald-500/50">Free Memory Address Space Available</div>
                    </div>
                </div>

                {/* COMPARISON CARDS */}
                <div
                    style={{
                        opacity: interpolate(alertEnter, [0, 1], [0, 1]),
                        transform: `translateY(${alertY}px)`
                    }}
                    className="grid grid-cols-2 gap-6 w-full"
                >
                    {/* The Error */}
                    <div className="bg-red-500/10 border-2 border-red-500/30 p-6 rounded-2xl flex items-center gap-6">
                        <div className="h-16 w-16 bg-red-500/20 rounded-xl flex items-center justify-center shrink-0">
                            <BatteryWarning size={32} className="text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-red-500 uppercase mb-1">Stack Overflow</h3>
                            <p className="text-zinc-400 leading-tight">
                                Q0 hit the fixed partition limit. It cannot grow further despite available RAM.
                            </p>
                        </div>
                    </div>

                    {/* The Irony */}
                    <div className="bg-emerald-500/5 border-2 border-emerald-500/20 p-6 rounded-2xl flex items-center gap-6">
                        <div className="h-16 w-16 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                            <Battery size={32} className="text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-emerald-500 uppercase mb-1">Under-Utilization</h3>
                            <p className="text-zinc-400 leading-tight">
                                Neighboring segments have <span className="text-emerald-400 font-bold">100% capacity</span> available but inaccessible.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FixedPartitioningOverflowFrame;