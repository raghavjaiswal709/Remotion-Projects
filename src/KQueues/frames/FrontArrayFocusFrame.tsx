import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    ArrowUpFromLine,
    Search
} from 'lucide-react';

const FrontArrayFocusFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const createSpring = (delay: number) =>
        spring({ frame: frame - delay, fps, config: { stiffness: 80, damping: 15 } });

    // Values for K=3 (3 Queues)
    // front[0] = 5, front[1] = 2, front[2] = -1
    const k = 3;
    const frontData = [5, 2, -1];

    // Anim
    const containerOpacity = interpolate(frame, [0, 10], [0, 1]);
    const titleY = interpolate(createSpring(10), [0, 1], [-50, 0]);
    const arrayEnter = createSpring(30);
    const arrayScale = interpolate(arrayEnter, [0, 1], [0.8, 1]);

    // Highlight specific indices
    const highlight0 = interpolate(frame, [50, 60], [0, 1]);

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div style={{ opacity: containerOpacity }} className="w-full max-w-5xl space-y-20">

                {/* Header */}
                <div style={{ transform: `translateY(${titleY}px)` }} className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-4 text-blue-500 mb-4">
                        <ArrowUpFromLine size={48} />
                        <h2 className="text-6xl font-black uppercase tracking-tight">Front Array</h2>
                    </div>
                    <p className="text-3xl text-zinc-400">Where does each queue begin?</p>
                </div>

                {/* Array Visualization */}
                <div
                    style={{ transform: `scale(${arrayScale})`, opacity: interpolate(arrayEnter, [0, 1], [0, 1]) }}
                    className="flex justify-center gap-8"
                >
                    {frontData.map((val, i) => (
                        <div key={i} className="flex flex-col items-center gap-4">
                            <span className="font-mono text-zinc-500 font-bold text-xl">Index {i}</span>
                            <div className={`
                                w-32 h-32 rounded-3xl flex items-center justify-center border-4 shadow-2xl transition-colors duration-500
                                ${i === 0 && frame > 50 ? 'bg-blue-600 border-blue-400 shadow-blue-500/50' : 'bg-zinc-900 border-zinc-700'}
                            `}>
                                <span className="text-5xl font-black font-mono">{val}</span>
                            </div>
                            <span className="text-zinc-500 font-bold uppercase tracking-wider text-sm">Queue {i}</span>
                        </div>
                    ))}
                </div>

                {/* Explanation */}
                <div
                    style={{ opacity: highlight0 }}
                    className="bg-blue-900/20 border border-blue-500/30 p-8 rounded-2xl flex items-center gap-6 max-w-2xl mx-auto"
                >
                    <Search size={32} className="text-blue-400" />
                    <p className="text-xl text-blue-100">
                        <span className="font-mono bg-blue-500/30 px-2 py-1 rounded">front[0] == 5</span> means the <strong className="text-blue-400">Head</strong> of Queue 0 is physically located at Array Index 5.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default FrontArrayFocusFrame;
