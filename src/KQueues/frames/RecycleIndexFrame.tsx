import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
    Link
} from 'lucide-react';

const RecycleIndexFrame = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // next[i] = free;
    // index 5 (emptied) -> point to current free (6).
    // so next[5] = 6.

    const createSpring = (delay: number) =>
        spring({ frame: frame - delay, fps, config: { stiffness: 80, damping: 15 } });

    const containerOpacity = interpolate(frame, [0, 10], [0, 1]);

    const iEnter = createSpring(10);
    const freeEnter = createSpring(30);
    const linkLine = interpolate(frame, [60, 90], [0, 1]);

    return (
        <div className="w-full h-full min-h-[1200px] flex flex-col items-center justify-center bg-zinc-950 text-white p-12 font-sans">
            <div style={{ opacity: containerOpacity }} className="w-full max-w-6xl space-y-20">

                <div className="text-center">
                    <code className="text-6xl font-mono font-bold text-white">
                        next[i] = <span className="text-emerald-500">free</span>;
                    </code>
                </div>

                <div className="relative h-80 flex items-center justify-center gap-64">

                    {/* Index 5 (Recently emptied) */}
                    <div style={{ transform: `scale(${iEnter})` }} className="flex flex-col items-center relative z-10">
                        <span className="text-zinc-500 font-bold uppercase tracking-widest text-xl mb-4">Index 5</span>
                        <div className="w-32 h-32 bg-zinc-800 border-4 border-zinc-600 rounded-2xl flex items-center justify-center">
                            <span className="text-zinc-400 font-mono text-xl">Empty</span>
                        </div>
                        {/* Next Slot */}
                        <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-purple-900 border-2 border-purple-500 rounded flex items-center justify-center shadow-lg">
                            <div className="w-3 h-3 bg-white rounded-full" />
                        </div>
                    </div>

                    {/* Free Pool Head (6) */}
                    <div style={{ transform: `scale(${freeEnter})` }} className="flex flex-col items-center relative z-10">
                        <span className="text-emerald-500 font-bold uppercase tracking-widest text-xl mb-4">Free Head (6)</span>
                        <div className="w-32 h-32 bg-emerald-900/20 border-4 border-emerald-500 rounded-full flex items-center justify-center border-dashed">
                            <span className="text-4xl font-black text-emerald-500">6</span>
                        </div>
                    </div>

                    {/* Connection Line */}
                    <div className="absolute left-[30%] top-1/2 h-1 bg-zinc-700 w-[40%] z-0">
                        <div style={{ width: `${linkLine * 100}%` }} className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all" />
                    </div>

                </div>

            </div>
        </div>
    );
};

export default RecycleIndexFrame;
