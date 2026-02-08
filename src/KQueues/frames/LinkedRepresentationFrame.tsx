import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    Link2,
    ListOrdered,
    ArrowUpRight,
    CornerDownRight,
    Map,
    Hash,
    ArrowRight
} from 'lucide-react';

const LinkedRepresentationFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // --- Helpers ---
    const createSpring = (delay: number, config?: { stiffness?: number; damping?: number }) => {
        return spring({
            frame: frame - delay,
            fps,
            config: config || { stiffness: 100, damping: 15 },
        });
    };

    // --- Data Setup ---
    // A scenario where Q1 elements are scattered: Index 0 -> 2 -> 4 -> -1
    const dataArray = ['A', 'X', 'B', 'Y', 'C'];
    const nextArray = [2, -1, 4, -1, -1]; // -1 denotes end
    const indices = [0, 1, 2, 3, 4];

    // Highlights for Q1 path: 0, 2, 4
    const q1Path = [0, 2, 4];

    // --- Animations ---

    // 1. Container
    const containerOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

    // 2. Arrays Entry
    const arraysSlide = createSpring(15);
    const arraysY = interpolate(arraysSlide, [0, 1], [50, 0]);
    const arraysOpacity = interpolate(frame, [15, 30], [0, 1]);

    // 3. Reveal "Next" Array (The Magic)
    const nextReveal = createSpring(45);
    const nextHeight = interpolate(nextReveal, [0, 1], [0, 80]); // Expands down
    const nextOpacity = interpolate(frame, [45, 55], [0, 1]);

    // 4. Trace the Path (The "Link" Animation)
    // Step 1: Highlight Index 0
    const step1Focus = createSpring(70);
    const step1Scale = interpolate(step1Focus, [0, 1], [1, 1.1]);

    // Step 2: Draw Line 0 -> 2
    const line1Progress = createSpring(90, { stiffness: 40 }); // Slower draw

    // Step 3: Highlight Index 2
    const step2Focus = createSpring(110);
    const step2Scale = interpolate(step2Focus, [0, 1], [1, 1.1]);

    // Step 4: Draw Line 2 -> 4
    const line2Progress = createSpring(130, { stiffness: 40 });

    // Step 5: Highlight Index 4
    const step3Focus = createSpring(150);
    const step3Scale = interpolate(step3Focus, [0, 1], [1, 1.1]);

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div
                style={{ opacity: containerOpacity }}
                className="w-full max-w-5xl space-y-16"
            >
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 mb-2">
                        <Link2 size={20} />
                        <span className="uppercase tracking-widest text-xs font-bold">The Solution</span>
                    </div>
                    <h2 className="text-6xl font-black uppercase tracking-tight">
                        Linked <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Representation</span>
                    </h2>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
                        Logical order is maintained by pointers, regardless of physical location.
                    </p>
                </div>

                {/* VISUALIZATION AREA */}
                <div
                    style={{
                        opacity: arraysOpacity,
                        transform: `translateY(${arraysY}px)`
                    }}
                    className="relative w-full py-12 px-4"
                >

                    {/* SVG LAYER FOR CONNECTING LINES (Rendered Behind) */}
                    <div className="absolute inset-0 z-20 pointer-events-none">
                        <svg className="w-full h-full overflow-visible">
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#06b6d4" />
                                </marker>
                            </defs>

                            {/* Line 1: Index 0 to 2 */}
                            {/* Calculation: Each block is 20% width. Center of 0 is 10%, Center of 2 is 50% */}
                            <path
                                d="M 10% 160 Q 30% 240 50% 160" // Curving down from 'Next' row to 'Data' row of next item
                                fill="none"
                                stroke="#06b6d4"
                                strokeWidth="4"
                                strokeDasharray="1000"
                                strokeDashoffset={interpolate(line1Progress, [0, 1], [1000, 0])}
                                markerEnd="url(#arrowhead)"
                                className="drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                            />

                            {/* Line 2: Index 2 to 4 */}
                            {/* Center of 2 is 50%, Center of 4 is 90% */}
                            <path
                                d="M 50% 160 Q 70% 240 90% 160"
                                fill="none"
                                stroke="#06b6d4"
                                strokeWidth="4"
                                strokeDasharray="1000"
                                strokeDashoffset={interpolate(line2Progress, [0, 1], [1000, 0])}
                                markerEnd="url(#arrowhead)"
                                className="drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                            />
                        </svg>
                    </div>


                    {/* THE GRID LAYOUT */}
                    <div className="grid grid-cols-5 gap-4 relative z-10">

                        {/* --- ROW 1: INDICES --- */}
                        {indices.map((idx) => (
                            <div key={`idx-${idx}`} className="text-center pb-2 border-b border-zinc-800">
                                <span className="font-mono text-zinc-600 font-bold text-sm">Index {idx}</span>
                            </div>
                        ))}

                        {/* --- ROW 2: DATA ARRAY (PHYSICAL) --- */}
                        {dataArray.map((val, i) => {
                            // Determine scaling based on active step
                            let scale = 1;
                            let active = false;
                            if (i === 0) { scale = step1Scale; active = frame > 70; }
                            if (i === 2) { scale = step2Scale; active = frame > 110; }
                            if (i === 4) { scale = step3Scale; active = frame > 150; }

                            return (
                                <div
                                    key={`data-${i}`}
                                    style={{ transform: `scale(${scale})` }}
                                    className={`
                                        h-24 rounded-xl flex flex-col items-center justify-center border-2 transition-colors duration-300
                                        ${active ? 'bg-cyan-900/30 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'bg-zinc-900 border-zinc-800'}
                                    `}
                                >
                                    <span className={`text-3xl font-black ${active ? 'text-white' : 'text-zinc-500'}`}>{val}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 mt-2 font-bold">Data</span>
                                </div>
                            );
                        })}

                        {/* --- ROW 3: NEXT ARRAY (LOGICAL) --- */}
                        {nextArray.map((val, i) => {
                            // Only show if revealed
                            return (
                                <div
                                    key={`next-${i}`}
                                    style={{
                                        height: nextHeight, // Animate height to reveal
                                        opacity: nextOpacity,
                                    }}
                                    className="relative flex items-center justify-center"
                                >
                                    <div className={`
                                        w-full h-16 rounded-lg flex items-center justify-between px-4 border
                                        ${val !== -1 && frame > (70 + (i === 0 ? 0 : i === 2 ? 40 : 100)) ? 'bg-purple-900/20 border-purple-500/50' : 'bg-zinc-900/50 border-zinc-800'}
                                    `}>
                                        <div className="flex items-center gap-2">
                                            <CornerDownRight size={16} className="text-purple-400" />
                                            <span className="text-xs font-bold text-purple-400 uppercase">Next</span>
                                        </div>
                                        <span className="font-mono text-xl font-bold text-white">
                                            {val === -1 ? 'END' : val}
                                        </span>
                                    </div>

                                    {/* Connection Line Visual (Vertical connector from Data to Next) */}
                                    <div className="absolute -top-4 w-[1px] h-4 bg-zinc-800" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Explainer Box */}
                <div
                    style={{ opacity: interpolate(step1Focus, [0, 1], [0, 1]) }}
                    className="flex items-center justify-center gap-8 pt-8"
                >
                    <div className="bg-zinc-900 border border-zinc-800 px-6 py-4 rounded-xl flex items-center gap-4">
                        <Map size={24} className="text-cyan-400" />
                        <div className="text-left">
                            <p className="text-xs font-bold text-zinc-500 uppercase">Concept</p>
                            <p className="text-lg font-medium text-white">Data holds the <span className="text-cyan-400">Value</span></p>
                        </div>
                    </div>

                    <ArrowRight className="text-zinc-700" />

                    <div className="bg-zinc-900 border border-zinc-800 px-6 py-4 rounded-xl flex items-center gap-4">
                        <ListOrdered size={24} className="text-purple-400" />
                        <div className="text-left">
                            <p className="text-xs font-bold text-zinc-500 uppercase">Mechanism</p>
                            <p className="text-lg font-medium text-white">Next holds the <span className="text-purple-400">Address</span></p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LinkedRepresentationFrame;