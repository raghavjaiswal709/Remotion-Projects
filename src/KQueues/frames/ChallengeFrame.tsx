import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    Layers,
    AlertTriangle,
    Database,
    Ban,
    Maximize2,
    ArrowDown
} from 'lucide-react';

const KQueueChallengeFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Helper for springs
    const createSpring = (delay: number, config?: { stiffness?: number; damping?: number }) => {
        return spring({
            frame: frame - delay,
            fps,
            config: config || { stiffness: 100, damping: 10 },
        });
    };

    // Animations
    const containerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

    // Icon
    const iconScale = createSpring(0, { stiffness: 60 });
    const iconRotate = interpolate(createSpring(0, { stiffness: 60 }), [0, 1], [-20, 0]);

    // Header
    const headerOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });
    const headerY = interpolate(createSpring(15), [0, 1], [10, 0]);

    // Label
    const labelOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' });

    // Arrays
    const q1Item1Params = { delay: 30, height: 0.8 };
    const q1Item2Params = { delay: 35, height: 0.8 };
    const q1Item3Params = { delay: 40, height: 0.8 };

    const getBarHeight = (delay: number, target: number) =>
        interpolate(createSpring(delay), [0, 1], [0, target * 100]) + "%";

    // Overflow
    const overflowEnter = createSpring(75, { stiffness: 40 });
    const overflowX = interpolate(overflowEnter, [0, 1], [100, 0]);
    const overflowOpacity = interpolate(frame, [75, 85], [0, 1], { extrapolateRight: 'clamp' });
    const overflowScale = interpolate(overflowEnter, [0, 1], [0.5, 1]);

    // Q2 Text (Pulse)
    // We can simulate the repeating pulse using sine wave on frame
    const pulsePhase = (frame / 60) * Math.PI; // 2 seconds period approx (60 frames)
    const q2Opacity = interpolate(Math.sin(pulsePhase), [-1, 1], [0.2, 0.5]);
    const q2Scale = interpolate(Math.sin(pulsePhase), [-1, 1], [0.9, 1]);

    // Q3
    const q3Height = getBarHeight(45, 0.4);

    // Problem Label
    const problemOpacity = interpolate(frame, [90, 105], [0, 1], { extrapolateRight: 'clamp' });
    const problemX = interpolate(createSpring(90), [0, 1], [-20, 0]);

    // Opportunity Label
    const opportunityOpacity = interpolate(frame, [120, 135], [0, 1], { extrapolateRight: 'clamp' });
    const opportunityX = interpolate(createSpring(120), [0, 1], [20, 0]);

    // Footer
    const footerOpacity = interpolate(frame, [165, 180], [0, 1], { extrapolateRight: 'clamp' });

    // Bounce effect for arrow
    const bounceY = interpolate(Math.sin((frame / 15) * Math.PI), [-1, 1], [0, 10]);


    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div
                style={{ opacity: containerOpacity }}
                className="w-full max-w-4xl space-y-24"
            >
                {/* Header Section */}
                <div className="text-center space-y-8">
                    <div
                        style={{
                            transform: `scale(${iconScale}) rotate(${iconRotate}deg)`
                        }}
                        className="w-48 h-48 mx-auto bg-indigo-500/10 rounded-[3rem] flex items-center justify-center border-2 border-indigo-500/30 shadow-[0_0_60px_rgba(99,102,241,0.2)]"
                    >
                        <Database size={96} className="text-indigo-400" />
                    </div>

                    <div
                        style={{
                            opacity: headerOpacity,
                            transform: `translateY(${headerY}px)`
                        }}
                        className="space-y-4"
                    >
                        <h2 className="text-8xl font-black uppercase tracking-tight leading-none">
                            The <span className="text-indigo-400">K-Queue</span><br />Dilemma
                        </h2>
                        <p className="text-3xl text-zinc-500 mt-4 font-medium tracking-wide uppercase">
                            1 Array • K Independent Queues
                        </p>
                    </div>
                </div>

                {/* The Array Visualization */}
                <div className="relative pt-12">

                    {/* Label above array */}
                    <div
                        style={{ opacity: labelOpacity }}
                        className="flex items-center justify-center gap-4 mb-6 opacity-60"
                    >
                        <Layers size={28} />
                        <span className="text-2xl uppercase tracking-[0.2em]">Fixed Memory Partitioning</span>
                    </div>

                    {/* The Single Array Container */}
                    <div className="relative w-full h-64 bg-slate-900 rounded-3xl border-4 border-slate-700 overflow-hidden flex shadow-2xl">

                        {/* QUEUE 1: The Overflowing Queue */}
                        <div className="w-[42%] h-full border-r-2 border-dashed border-slate-600 bg-red-500/5 relative flex flex-col justify-end p-4 gap-2">
                            <span className="absolute top-4 left-4 text-2xl font-bold text-red-400 uppercase tracking-wider">Q1 (Full)</span>

                            {/* Existing Items */}
                            <div className="flex gap-2 h-full items-end w-full">
                                <div
                                    style={{ height: getBarHeight(q1Item1Params.delay, q1Item1Params.height) }}
                                    className="flex-1 bg-gradient-to-t from-red-600 to-red-500 rounded-lg border-2 border-red-400/50"
                                />
                                <div
                                    style={{ height: getBarHeight(q1Item2Params.delay, q1Item2Params.height) }}
                                    className="flex-1 bg-gradient-to-t from-red-600 to-red-500 rounded-lg border-2 border-red-400/50"
                                />
                                <div
                                    style={{ height: getBarHeight(q1Item3Params.delay, q1Item3Params.height) }}
                                    className="flex-1 bg-gradient-to-t from-red-600 to-red-500 rounded-lg border-2 border-red-400/50"
                                />
                            </div>

                            {/* The Item trying to enter (Overflow Animation) */}
                            <div
                                style={{
                                    transform: `translate(${overflowX}px, -50%) scale(${overflowScale})`,
                                    opacity: overflowOpacity,
                                    top: '50%'
                                }}
                                className="absolute -right-8 h-24 w-16 bg-red-500 rounded-xl border-4 border-white/90 flex items-center justify-center z-20 shadow-[0_0_30px_rgba(239,68,68,0.6)]"
                            >
                                <AlertTriangle size={32} className="text-white fill-red-600" />
                            </div>
                        </div>

                        {/* QUEUE 2: The Empty/Wasted Space */}
                        <div className="w-[33%] h-full border-r-2 border-dashed border-slate-600 relative flex items-center justify-center bg-emerald-500/5">
                            <span className="absolute top-4 left-4 text-2xl font-bold text-emerald-500 uppercase tracking-wider">Q2 (Empty)</span>

                            <div
                                style={{
                                    opacity: q2Opacity,
                                    transform: `scale(${q2Scale})` // Removed rotation to simplify but can add back if needed
                                }}
                                className="text-emerald-500/20 font-black text-6xl tracking-widest rotate-90 md:rotate-0"
                            >
                                VOID
                            </div>
                        </div>

                        {/* QUEUE 3: Normal */}
                        <div className="flex-1 h-full relative bg-blue-500/5 flex flex-col justify-end p-4">
                            <span className="absolute top-4 left-4 text-2xl font-bold text-blue-400 uppercase tracking-wider">Q3</span>
                            <div
                                style={{ height: q3Height }}
                                className="w-full bg-blue-500/30 rounded-lg border-2 border-blue-500/30"
                            />
                        </div>
                    </div>

                    {/* Explainer Lines (Stacked for Portrait) */}
                    <div className="mt-12 space-y-8">

                        {/* Problem Label */}
                        <div
                            style={{
                                opacity: problemOpacity,
                                transform: `translateX(${problemX}px)`
                            }}
                            className="bg-red-900/20 border border-red-500/20 rounded-2xl p-6 flex items-start gap-6"
                        >
                            <div className="bg-red-500/20 p-4 rounded-xl">
                                <Ban size={32} className="text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-red-400 text-2xl font-bold uppercase mb-2">Overflow Error</h3>
                                <p className="text-xl text-zinc-400 leading-relaxed">
                                    Q1 is full and crashes, even though the array has space elsewhere.
                                </p>
                            </div>
                        </div>

                        {/* Opportunity Label */}
                        <div
                            style={{
                                opacity: opportunityOpacity,
                                transform: `translateX(${opportunityX}px)`
                            }}
                            className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl p-6 flex items-start gap-6"
                        >
                            <div className="bg-emerald-500/20 p-4 rounded-xl">
                                <Maximize2 size={32} className="text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-emerald-400 text-2xl font-bold uppercase mb-2">Wasted Memory</h3>
                                <p className="text-xl text-zinc-400 leading-relaxed">
                                    Q2 is completely empty, but Q1 cannot access this free space.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Next Step Hint */}
                <div
                    style={{ opacity: footerOpacity }}
                    className="flex flex-col items-center gap-4 pt-12"
                >
                    <p className="text-xl text-zinc-500 uppercase tracking-widest">The Solution?</p>
                    <ArrowDown
                        style={{ transform: `translateY(${bounceY}px)` }}
                        size={40}
                        className="text-zinc-600"
                    />
                </div>

            </div>
        </div>
    );
};

export default KQueueChallengeFrame;