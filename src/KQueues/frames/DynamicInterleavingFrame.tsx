import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    Shuffle,
    ArrowRightLeft,
    Database,
    CircleDashed,
    GitMerge
} from 'lucide-react';

const DynamicInterleavingFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // --- Helpers ---
    const createSpring = (delay: number, config?: { stiffness?: number; damping?: number }) => {
        return spring({
            frame: frame - delay,
            fps,
            config: config || { stiffness: 100, damping: 10 },
        });
    };

    // --- Data ---
    // Simulating an array of size 8
    // Queue A (Blue): Indices 0, 5, 7
    // Queue B (Indigo): Indices 1, 2
    // Queue C (Violet): Indices 4
    // Empty: 3, 6
    const arraySize = 8;
    const arrayElements = [
        { id: 0, queue: 'A', color: 'bg-blue-600', label: 'Q-A' },
        { id: 1, queue: 'B', color: 'bg-indigo-600', label: 'Q-B' },
        { id: 2, queue: 'B', color: 'bg-indigo-600', label: 'Q-B' },
        { id: 3, queue: null, color: 'bg-zinc-800', label: 'Empty' },
        { id: 4, queue: 'C', color: 'bg-violet-600', label: 'Q-C' },
        { id: 5, queue: 'A', color: 'bg-blue-600', label: 'Q-A' },
        { id: 6, queue: null, color: 'bg-zinc-800', label: 'Empty' },
        { id: 7, queue: 'A', color: 'bg-blue-600', label: 'Q-A' },
    ];

    // --- Animations ---

    // 1. Container Entry
    const containerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

    // 2. Header
    const headerSpring = createSpring(10);
    const headerY = interpolate(headerSpring, [0, 1], [30, 0]);

    // 3. Array Slots Entry (Staggered)
    const getSlotScale = (index: number) => {
        const s = createSpring(30 + index * 5, { stiffness: 150, damping: 12 });
        return interpolate(s, [0, 1], [0, 1]);
    };

    // 4. Queue A Highlight (Connect scattered elements)
    const highlightQueueA = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: 'clamp' });
    const queueAScale = interpolate(createSpring(60), [0, 1], [1, 1.05]);

    // 5. Queue B Highlight
    const highlightQueueB = interpolate(frame, [90, 110], [0, 1], { extrapolateRight: 'clamp' });
    const queueBScale = interpolate(createSpring(90), [0, 1], [1, 1.05]);

    // 6. "Mixing" Animation (Icons rotating/moving to show flexibility)
    const mixIconRotate = interpolate(frame, [120, 180], [0, 360]);
    const mixOpacity = interpolate(frame, [120, 140], [0, 1], { extrapolateRight: 'clamp' });

    // 7. Text Labels Entry
    const textEnter = createSpring(150);
    const textY = interpolate(textEnter, [0, 1], [20, 0]);

    // 8. Connection Lines Opacity
    const linesOpacity = interpolate(frame, [70, 90], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div
                style={{ opacity: containerOpacity }}
                className="w-full max-w-6xl space-y-20"
            >
                {/* Header */}
                <div
                    style={{ transform: `translateY(${headerY}px)` }}
                    className="text-center space-y-6"
                >
                    <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-400 mb-2">
                        <Shuffle size={20} />
                        <span className="uppercase tracking-[0.2em] text-sm font-bold">The Solution</span>
                    </div>
                    <h2 className="text-7xl font-black uppercase tracking-tight">
                        Dynamic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">Interleaving</span>
                    </h2>
                    <p className="text-2xl text-zinc-500 max-w-3xl mx-auto font-medium">
                        Any queue can occupy any free slot. No fixed boundaries.
                    </p>
                </div>

                {/* VISUALIZATION AREA */}
                <div className="relative w-full h-96 bg-zinc-900/30 rounded-3xl border-2 border-zinc-800 flex flex-col items-center justify-center p-8 overflow-visible">

                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-20 bg-[size:40px_40px] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] rounded-3xl" />

                    {/* Array Container */}
                    <div className="flex gap-4 w-full justify-center items-center relative z-10">
                        {arrayElements.map((el, i) => {
                            // Determine active state styling
                            let isActive = false;
                            let ringColor = 'ring-transparent';
                            let scale = 1;

                            if (el.queue === 'A' && frame > 60) {
                                isActive = true;
                                ringColor = 'ring-blue-400';
                                scale = queueAScale;
                            }
                            if (el.queue === 'B' && frame > 90) {
                                isActive = true;
                                ringColor = 'ring-indigo-400';
                                scale = queueBScale;
                            }

                            return (
                                <div
                                    key={i}
                                    style={{ transform: `scale(${getSlotScale(i) * scale})` }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    {/* Index */}
                                    <span className="font-mono text-zinc-600 font-bold">{i}</span>

                                    {/* Slot */}
                                    <div className={`
                                        w-24 h-48 rounded-2xl flex items-center justify-center relative
                                        ${el.color} shadow-lg transition-all duration-300 ring-4 ${ringColor}
                                        ${el.queue ? '' : 'border-2 border-dashed border-zinc-700 bg-transparent'}
                                    `}>
                                        {/* Inner Content */}
                                        {el.queue ? (
                                            <div className="text-center">
                                                <Database size={32} className="text-white/80 mx-auto mb-2" />
                                                <span className="text-2xl font-black">{el.label}</span>
                                            </div>
                                        ) : (
                                            <div className="text-center opacity-30">
                                                <CircleDashed size={32} className="mx-auto mb-2" />
                                                <span className="text-sm font-bold uppercase">Free</span>
                                            </div>
                                        )}

                                        {/* Connector Dot for Lines */}
                                        {el.queue && (
                                            <div className="absolute -bottom-2 w-4 h-4 rounded-full bg-white border-2 border-zinc-900 z-20" />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Connection Lines Illustration (Simplistic visuals for links) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible" style={{ opacity: linesOpacity }}>
                        {/* Queue A connections: 0 -> 5 -> 7 */}
                        {/* Approximate coordinates based on standard layout assumption: 
                             Total width ~1000px. 8 items. Gap 16px. Item Width 96px. 
                             Center of Item i ~= (i * 112) + offset
                             Let's assume center points roughly.
                         */}
                        {/* We can't know exact pixels easily without fixed width container, 
                             so we'll use % based paths assuming evenly distributed flex items 
                          */}
                        {/* 0(10%) -> 5(65%) -> 7(90%) approximate centers */}
                        <path d="M 10% 70% Q 35% 90% 65% 70%" fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray="10,10" className="opacity-60" />
                        <path d="M 65% 70% Q 75% 90% 88% 70%" fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray="10,10" className="opacity-60" />

                        {/* Queue B: 1(22%) -> 2(33%) */}
                        <path d="M 22% 70% Q 27% 85% 33% 70%" fill="none" stroke="#4f46e5" strokeWidth="4" strokeDasharray="10,10" className="opacity-60" />
                    </svg>

                </div>

                {/* Explainer Cards */}
                <div
                    style={{
                        transform: `translateY(${textY}px)`,
                        opacity: interpolate(textEnter, [0, 1], [0, 1])
                    }}
                    className="grid grid-cols-2 gap-8 max-w-4xl mx-auto"
                >
                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex items-center gap-6">
                        <div className="bg-blue-500/20 p-4 rounded-xl">
                            <ArrowRightLeft size={32} className="text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Flexible Placement</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Queue A needs a slot? Take index 5. Needs another? Take index 7. No contiguous block needed.
                            </p>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex items-center gap-6">
                        <div className="bg-indigo-500/20 p-4 rounded-xl">
                            <GitMerge size={32} className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Interleaved Storage</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Different queues occupy the same physical array, maximizing memory efficiency.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Center "Mixing" Badge */}
                <div className="absolute top-[35%] right-12 z-30" style={{ opacity: mixOpacity }}>
                    <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-700 p-4 rounded-full shadow-2xl flex flex-col items-center">
                        <Shuffle size={48} className="text-violet-500" style={{ transform: `rotate(${mixIconRotate}deg)` }} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DynamicInterleavingFrame;
