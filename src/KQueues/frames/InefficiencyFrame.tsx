import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    ArrowRight,
    ShieldBan,
    PieChart,
    AlertCircle,
    X,
    ServerCrash
} from 'lucide-react';

const InefficiencyFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // --- Helpers ---
    const createSpring = (delay: number, config?: { stiffness?: number; damping?: number }) => {
        return spring({
            frame: frame - delay,
            fps,
            config: config || { stiffness: 100, damping: 12 },
        });
    };

    // --- Animations ---

    // 1. Scene Setup
    const containerOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

    // 2. The Failed Migration (The core action)
    // Item tries to move from Q0 (Left) to Q1 (Right)
    const attemptStart = 30;
    const migrationSpring = createSpring(attemptStart, { stiffness: 60, damping: 8 });

    // X Position: 0 -> moves right -> hits wall -> bounces back
    const migrationX = interpolate(
        migrationSpring,
        [0, 0.5, 1],
        [0, 180, 0] // 180px is roughly where the wall is
    );

    // Opacity of the "Ghost" item trying to move
    const migrationOpacity = interpolate(frame, [30, 80], [1, 0], { extrapolateRight: 'clamp' });

    // 3. The Barrier Reaction
    const wallHitFrame = attemptStart + 15; // Rough estimate of when it hits
    const wallScale = interpolate(
        frame - wallHitFrame,
        [0, 5, 10],
        [1, 1.5, 1],
        { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
    );
    const wallColor = interpolate(frame - wallHitFrame, [0, 5, 20], [0, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }); // 0 = normal, 1 = red

    // 4. The "Access Denied" Popup
    const deniedEnter = createSpring(wallHitFrame);
    const deniedScale = interpolate(deniedEnter, [0, 1], [0, 1]);
    const deniedOpacity = interpolate(frame, [wallHitFrame, wallHitFrame + 10, wallHitFrame + 40], [0, 1, 0]);

    // 5. Efficiency Metrics (Bottom)
    const metricsEnter = createSpring(70);
    const metricsY = interpolate(metricsEnter, [0, 1], [30, 0]);

    // 6. Global vs Local Warning
    const summaryEnter = createSpring(90);
    const summaryOpacity = interpolate(summaryEnter, [0, 1], [0, 1]);

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div
                style={{ opacity: containerOpacity }}
                className="w-full max-w-5xl space-y-16"
            >
                {/* Header */}
                <div className="text-center space-y-4">
                    <h2 className="text-7xl font-black uppercase tracking-tight text-zinc-600">
                        Total <span className="text-amber-500">Inefficiency</span>
                    </h2>
                    <p className="text-2xl text-zinc-500">Why can't we just share?</p>
                </div>

                {/* VISUALIZATION AREA */}
                <div className="relative w-full h-80 bg-zinc-900/30 rounded-3xl border-2 border-zinc-800 flex items-center justify-center p-8 overflow-hidden">

                    {/* Background Grid for tech feel */}
                    <div className="absolute inset-0 opacity-10 bg-[size:40px_40px] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)]" />

                    {/* Q0 (Source) */}
                    <div className="absolute left-12 w-64 h-48 bg-red-500/10 border-2 border-red-500/50 rounded-2xl flex flex-col items-center justify-center gap-2">
                        <span className="text-red-400 font-bold uppercase tracking-widest">Q0: 100% Full</span>
                        <div className="grid grid-cols-2 gap-2 w-full px-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-8 bg-red-500 rounded shadow-sm" />
                            ))}
                        </div>
                        {/* The item trying to leave */}
                        <div
                            style={{
                                transform: `translateX(${migrationX}px)`,
                                opacity: migrationOpacity
                            }}
                            className="absolute z-20 h-12 w-12 bg-amber-400 rounded-lg flex items-center justify-center border-2 border-white shadow-[0_0_20px_rgba(251,191,36,0.5)]"
                        >
                            <span className="text-black font-black text-xs">DATA</span>
                        </div>
                    </div>

                    {/* The BARRIER (Middle) */}
                    <div className="absolute left-1/2 -translate-x-1/2 h-full w-2 bg-zinc-700 z-10 flex flex-col items-center justify-center overflow-visible">
                        {/* The Glowing Wall Effect */}
                        <div
                            style={{
                                opacity: wallColor,
                                height: '120%'
                            }}
                            className="absolute w-4 bg-red-500 blur-xl transition-all"
                        />

                        {/* The Shield Icon */}
                        <div
                            style={{ transform: `scale(${wallScale})` }}
                            className="bg-zinc-950 p-3 rounded-full border-4 border-zinc-700 relative z-20"
                        >
                            <ShieldBan
                                size={40}
                                className={frame > wallHitFrame && frame < wallHitFrame + 20 ? "text-red-500" : "text-zinc-500"}
                            />
                        </div>
                    </div>

                    {/* Q1 (Destination) */}
                    <div className="absolute right-12 w-64 h-48 bg-emerald-500/5 border-2 border-dashed border-emerald-500/30 rounded-2xl flex flex-col items-center justify-center">
                        <span className="text-emerald-500/50 font-bold uppercase tracking-widest">Q1: Free Space</span>
                        <div className="text-emerald-500/20 text-6xl font-black mt-2">100%</div>
                        <div className="text-emerald-500/40 text-xs font-mono uppercase mt-1">Available</div>
                    </div>

                    {/* "ACCESS DENIED" Popup */}
                    <div
                        style={{
                            opacity: deniedOpacity,
                            transform: `translate(-50%, -50%) scale(${deniedScale})`,
                            top: '50%',
                            left: '50%'
                        }}
                        className="absolute z-50 bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border-2 border-white"
                    >
                        <X size={32} strokeWidth={4} />
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-xl uppercase">Blocked</span>
                            <span className="text-[10px] font-mono opacity-90">Fixed Partition Boundary</span>
                        </div>
                    </div>

                </div>

                {/* METRICS SECTION - The "Proof" of Inefficiency */}
                <div
                    style={{
                        transform: `translateY(${metricsY}px)`,
                        opacity: interpolate(metricsEnter, [0, 1], [0, 1])
                    }}
                    className="grid grid-cols-2 gap-8"
                >
                    {/* Gauge 1: Utilization */}
                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex items-center gap-6">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            {/* Simple SVG Gauge Background */}
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#333" strokeWidth="4" />
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eab308" strokeWidth="4" strokeDasharray="25, 100" />
                            </svg>
                            <div className="absolute text-center">
                                <span className="text-2xl font-black text-white">25%</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-1">Total RAM Usage</h3>
                            <p className="text-xl font-medium text-amber-400">Extremely Low</p>
                            <p className="text-xs text-zinc-500 mt-1">75% of memory sits idle.</p>
                        </div>
                    </div>

                    {/* Gauge 2: Failure Rate */}
                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex items-center gap-6">
                        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border-2 border-red-500/20">
                            <ServerCrash size={40} className="text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-1">Write Status</h3>
                            <p className="text-xl font-medium text-red-500">Failed (Overflow)</p>
                            <p className="text-xs text-zinc-500 mt-1">Request rejected despite free RAM.</p>
                        </div>
                    </div>
                </div>

                {/* Final Summary Text */}
                <div
                    style={{ opacity: summaryOpacity }}
                    className="flex items-center justify-center gap-3 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl mx-auto max-w-2xl"
                >
                    <AlertCircle size={20} className="text-amber-500" />
                    <p className="text-amber-200/80 font-mono text-sm">
                        This architecture prevents dynamic resource sharing.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default InefficiencyFrame;