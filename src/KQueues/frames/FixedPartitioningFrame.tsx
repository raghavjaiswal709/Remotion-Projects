import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    Columns,
    Lock,
    Scissors,
    Hash,
    ArrowRight
} from 'lucide-react';

const FixedPartitioningFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // --- Helpers ---
    const createSpring = (delay: number, config?: { stiffness?: number; damping?: number; mass?: number }) => {
        return spring({
            frame: frame - delay,
            fps,
            config: config || { stiffness: 100, damping: 10 },
        });
    };

    // --- Animations ---

    // 1. Container Entry
    const containerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

    // 2. Title Section
    const titleSlide = createSpring(10);
    const titleY = interpolate(titleSlide, [0, 1], [30, 0]);
    const titleOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });

    // 3. The Array (Base)
    const arrayWidthSpring = createSpring(30, { stiffness: 60, damping: 12 });
    const arrayWidth = interpolate(arrayWidthSpring, [0, 1], [0, 100]) + '%';
    const arrayOpacity = interpolate(frame, [30, 40], [0, 1], { extrapolateRight: 'clamp' });

    // 4. The Dividers (The "Cutting" Action)
    const dividerSpring = createSpring(55, { stiffness: 150, damping: 15 }); // Snappy impact
    const dividerHeight = interpolate(dividerSpring, [0, 1], [0, 100]) + '%';
    const dividerOpacity = interpolate(frame, [55, 60], [0, 1], { extrapolateRight: 'clamp' });

    // 5. Segment Coloring (Fade in background colors after cut)
    const segmentColorOpacity = interpolate(frame, [65, 80], [0, 1], { extrapolateRight: 'clamp' });

    // 6. Labels (Q0, Q1...) & Indices (0, n/k...)
    const labelsEnter = createSpring(85);
    const labelsY = interpolate(labelsEnter, [0, 1], [10, 0]);
    const labelsOpacity = interpolate(frame, [85, 95], [0, 1], { extrapolateRight: 'clamp' });

    // 7. The Locks (Static Nature)
    const lockSpring = createSpring(105, { stiffness: 120, damping: 8 });
    const lockScale = interpolate(lockSpring, [0, 1], [0, 1]);
    const lockRotate = interpolate(lockSpring, [0, 1], [-45, 0]);

    // Data for segments (k=4)
    const segments = [
        { id: 0, color: 'from-blue-500/20 to-blue-600/5', borderColor: 'border-blue-500/30', label: 'Q0' },
        { id: 1, color: 'from-indigo-500/20 to-indigo-600/5', borderColor: 'border-indigo-500/30', label: 'Q1' },
        { id: 2, color: 'from-violet-500/20 to-violet-600/5', borderColor: 'border-violet-500/30', label: 'Q2' },
        { id: 3, color: 'from-purple-500/20 to-purple-600/5', borderColor: 'border-purple-500/30', label: 'Q3' },
    ];

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div
                style={{ opacity: containerOpacity }}
                className="w-full max-w-5xl space-y-20"
            >
                {/* Header Section */}
                <div
                    style={{
                        opacity: titleOpacity,
                        transform: `translateY(${titleY}px)`
                    }}
                    className="text-center space-y-6"
                >
                    <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 mb-4">
                        <Columns size={20} />
                        <span className="uppercase tracking-[0.2em] text-sm font-bold">Method 1</span>
                    </div>
                    <h2 className="text-7xl font-black tracking-tight">
                        Fixed <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Partitioning</span>
                    </h2>
                    <p className="text-2xl text-zinc-500 max-w-2xl mx-auto font-medium">
                        Dividing the single array into static, immutable segments.
                    </p>
                </div>

                {/* VISUALIZATION AREA */}
                <div className="relative py-12 px-4">

                    {/* The Main Array Container */}
                    <div className="relative h-48 w-full rounded-2xl bg-zinc-900 border-2 border-zinc-800 overflow-hidden flex shadow-2xl">

                        {/* Background appearing to simulate the array existence */}
                        <div
                            style={{
                                width: arrayWidth,
                                opacity: arrayOpacity
                            }}
                            className="absolute inset-0 bg-zinc-800/50"
                        />

                        {/* Render Segments */}
                        {segments.map((seg, index) => (
                            <React.Fragment key={seg.id}>
                                {/* The Segment Block */}
                                <div className="flex-1 relative h-full flex items-center justify-center">
                                    {/* Colored Background (Fades in) */}
                                    <div
                                        style={{ opacity: segmentColorOpacity }}
                                        className={`absolute inset-0 bg-gradient-to-b ${seg.color} border-r ${seg.borderColor} transition-colors`}
                                    />

                                    {/* Queue Label (Q0, Q1...) */}
                                    <div
                                        style={{
                                            opacity: labelsOpacity,
                                            transform: `translateY(${labelsY}px)`
                                        }}
                                        className="relative z-10 flex flex-col items-center gap-3"
                                    >
                                        <span className="text-4xl font-black text-white/90 tracking-widest">{seg.label}</span>

                                        {/* Lock Icon */}
                                        <div
                                            style={{
                                                transform: `scale(${lockScale}) rotate(${lockRotate}deg)`
                                            }}
                                            className="bg-zinc-950/50 p-2 rounded-lg border border-white/10 backdrop-blur-sm"
                                        >
                                            <Lock size={24} className="text-zinc-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* The Divider Line (Except for last element) */}
                                {index < segments.length - 1 && (
                                    <div
                                        style={{
                                            height: dividerHeight,
                                            opacity: dividerOpacity
                                        }}
                                        className="absolute w-1 bg-white/20 z-20 origin-top"
                                    // Calculate left position: (index + 1) * (100 / segments.length)%
                                    // But since we are using flex-1 for segments, we can just position dividers absolutely
                                    // However, standard absolute positioning is easier here:
                                    />
                                )}
                            </React.Fragment>
                        ))}

                        {/* Re-rendering dividers with absolute positioning for precision if flex behaves oddly during anim */}
                        {[1, 2, 3].map((i) => (
                            <div
                                key={`div-${i}`}
                                style={{
                                    left: `${i * 25}%`,
                                    height: dividerHeight,
                                    opacity: dividerOpacity,
                                    top: 0
                                }}
                                className="absolute w-[2px] bg-zinc-500 z-30 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                            >
                                {/* Little 'cut' markers at top and bottom */}
                                <div className="absolute top-0 -left-1.5 w-4 h-1 bg-zinc-400 rounded-full" />
                                <div className="absolute bottom-0 -left-1.5 w-4 h-1 bg-zinc-400 rounded-full" />
                            </div>
                        ))}
                    </div>

                    {/* Mathematical Indices (0, n/k, 2n/k...) */}
                    <div
                        style={{
                            opacity: labelsOpacity,
                            transform: `translateY(${labelsY}px)`
                        }}
                        className="relative w-full h-12 mt-6"
                    >
                        {/* 0 */}
                        <div className="absolute left-0 -translate-x-1/2 flex flex-col items-center">
                            <div className="h-4 w-[2px] bg-zinc-700 mb-2" />
                            <span className="font-mono text-zinc-500 font-bold">0</span>
                        </div>

                        {/* n/k */}
                        <div className="absolute left-[25%] -translate-x-1/2 flex flex-col items-center">
                            <div className="h-4 w-[2px] bg-zinc-700 mb-2" />
                            <div className="flex flex-col items-center leading-none">
                                <span className="font-mono text-zinc-400 font-bold text-sm">n</span>
                                <div className="w-full h-[1px] bg-zinc-600 my-0.5" />
                                <span className="font-mono text-zinc-400 font-bold text-sm">k</span>
                            </div>
                        </div>

                        {/* 2n/k */}
                        <div className="absolute left-[50%] -translate-x-1/2 flex flex-col items-center">
                            <div className="h-4 w-[2px] bg-zinc-700 mb-2" />
                            <div className="flex flex-col items-center leading-none">
                                <span className="font-mono text-zinc-400 font-bold text-sm">2n</span>
                                <div className="w-full h-[1px] bg-zinc-600 my-0.5" />
                                <span className="font-mono text-zinc-400 font-bold text-sm">k</span>
                            </div>
                        </div>

                        {/* 3n/k */}
                        <div className="absolute left-[75%] -translate-x-1/2 flex flex-col items-center">
                            <div className="h-4 w-[2px] bg-zinc-700 mb-2" />
                            <div className="flex flex-col items-center leading-none">
                                <span className="font-mono text-zinc-400 font-bold text-sm">3n</span>
                                <div className="w-full h-[1px] bg-zinc-600 my-0.5" />
                                <span className="font-mono text-zinc-400 font-bold text-sm">k</span>
                            </div>
                        </div>

                        {/* n */}
                        <div className="absolute right-0 translate-x-1/2 flex flex-col items-center">
                            <div className="h-4 w-[2px] bg-zinc-700 mb-2" />
                            <span className="font-mono text-zinc-500 font-bold">n</span>
                        </div>
                    </div>
                </div>

                {/* Explanation Card */}
                <div
                    style={{ opacity: segmentColorOpacity }}
                    className="grid grid-cols-2 gap-8 max-w-4xl mx-auto"
                >
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="bg-zinc-800 p-3 rounded-lg">
                            <Scissors size={24} className="text-blue-400" />
                        </div>
                        <div>
                            <p className="text-zinc-400 text-sm font-bold uppercase tracking-wider">The Method</p>
                            <p className="text-white font-medium">Divide array into <span className="font-mono text-blue-400">k</span> equal parts</p>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="bg-zinc-800 p-3 rounded-lg">
                            <Hash size={24} className="text-purple-400" />
                        </div>
                        <div>
                            <p className="text-zinc-400 text-sm font-bold uppercase tracking-wider">The Calculation</p>
                            <p className="text-white font-medium">Index = <span className="font-mono text-purple-400">i * (n/k)</span></p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FixedPartitioningFrame;